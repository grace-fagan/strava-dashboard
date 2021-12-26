function getTime(timeframe) {
    console.log("Timeframe: ", timeframe);
    let afterValue = new Date();

    //convert time to epoch value
    switch(timeframe){
        case "week":
            //sets the after value to the most recent Monday at midnight
            let today = new Date();
            today.setDate(today.getDate() - (today.getDay() + 6) % 7)
            afterValue = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0).getTime() / 1000;
            break;
        
        case "month":
            afterValue = new Date(afterValue.getFullYear(), afterValue.getMonth(), 1, 0).getTime() / 1000;
            break;
        
        case "year":
            afterValue = new Date(afterValue.getFullYear(), 0, 1, 0).getTime() / 1000;
    }
    console.log("after: ", afterValue)
    return afterValue;
}

function getData(obj){
    axios.get("https://www.strava.com/api/v3/athlete/activities?per_page=200&after=" + obj.after, {headers: {"Authorization": "Bearer 97ef98f0c80fba7e05a0595a7801e25fa17ce6f1"}})
    .then(response => {
        obj.runs = (response.data);
        obj.count = response.data.length;
        createMap(response.data)});
}

//Local single run component
let singleRun = {
    template:"#single-run-template",
    props: {
        data: Object
    },
    data: function() {
        return {
            clicked: false
        }
    },
    methods:{
        getMiles(dist){
            return Math.round(dist * 0.000621371192)
        },
        runClicked(run){
            route_arr.forEach((e) => {
                if (e.options.name == run.name) {
                    map.fitBounds(e.getBounds());
                    e.setStyle({opacity: '1', color: 'red'})
                } else {e.setStyle({opacity: '.4', color: 'purple'})}
            })
        }
    }
}

//Local list component
let runsList = {
    template: "#runs-list-template",
    props: {
        after: Number,
        timeframe: String
    },
    components: {
        'single-run': singleRun
    },
    data: function() {
        return {
            runs: [],
            count: null
        }
    },
    watch: {
        after() {getData(this)}
    },
    methods: {

    }, mounted() {getData(this)} 
}

// Local timeframe selector component
let timeframeSelector = {
    template: "#timeframe-selector-template",
    components: {
        'runs-list': runsList
    },
    data() {
        return {
            selectedTime: 'week',
            options: [
                'week',
                'month',
                'year'
            ]
        };
    },
    computed: {
        after() {return getTime(this.selectedTime)}
    }
}

new Vue({
    el: '#app',
    components: {
        'timeframe-selector': timeframeSelector,
    }
})