function getTime(timeframe) {
    console.log("Timeframe: ", timeframe);
    let afterValue = new Date();

    //convert time to epoch value
    switch(timeframe){
        case "Week":
            let monday = new Date();
            monday.setDate(monday.getDate() - monday.getDay() + 1)
            afterValue = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 0).getTime() / 1000;
            break;
        
        case "Month":
            afterValue = new Date(afterValue.getFullYear(), afterValue.getMonth(), 1, 0).getTime() / 1000;
            break;
        
        case "Year":
            afterValue = new Date(afterValue.getFullYear(), 0, 1, 0).getTime() / 1000;
    }
    console.log("after: ", afterValue)
    return afterValue;
}

//Local list component
let runsList = {
    template: "#runs-list-template",
    // components: {
    //     'route-map': routeMap
    // },
    props: {
        after: Number
    },
    data: function() {
        return {
            runs: []
        }
    },
    watch: {
        after() {
            axios.get("https://www.strava.com/api/v3/athlete/activities?per_page=200&after=" + this.after, {headers: {"Authorization": "Bearer 321516dfebd054cc24c7f3ee35ba6ac82e9b1930"}})
                .then(response => {
                    this.runs = response.data;
                    createMap(response.data)});
        }
    }, mounted() {
        axios.get("https://www.strava.com/api/v3/athlete/activities?per_page=200&after=" + this.after, {headers: {"Authorization": "Bearer 321516dfebd054cc24c7f3ee35ba6ac82e9b1930"}})
            .then(response => (this.runs = response.data))
    } 
}

// Local timeframe selector component
let timeframeSelector = {
    template: "#timeframe-selector-template",
    components: {
        'runs-list': runsList
    },
    data() {
        return {
            selectedTime: 'Week',
            options: [
                'Week',
                'Month',
                'Year'
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