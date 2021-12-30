function getTime(timeframe) {
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
    return afterValue;
}

//code taken from: https://arumind.com/how-to-generate-an-array-of-weeks-between-two-dates-in-javascript/
function getDates(startDate, endDate) {
    let dates = []
    const addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    //now our Sunday check
    let currentDate = startDate
    console.log(startDate)
    if (currentDate.getDay() > 1) {
        currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    }
     
    while (currentDate <= endDate) {
      let endWeekDate = addDays.call(currentDate, 6);
      dates.push({after: currentDate.toDateString(), 
                   before: endWeekDate.toDateString()});
      currentDate = addDays.call(currentDate, 7);
     }
    return dates;
}

function getData(obj){
    axios.get("https://www.strava.com/api/v3/athlete/activities?per_page=200&after=" + obj.after, {headers: {"Authorization": "Bearer a8d6598b6e7ba3c9ad5fbafa882a887af3afe554"}})
    .then(response => {
        obj.runs = (response.data);
        obj.count = response.data.length;});
}

//STORE to hold global state
const store = new Vuex.Store({
    state: {
      selectedRun: null
    },
    mutations: {
      selectRun (state, run) {
        state.selectedRun = run
      },
      deselectRun (state) {
          state.selectedRun = null
      }
    }
  })

//COMPONENT: Route Map
let routeMap = {
    template: '#route-map-template',
    props: {
        runs: Array,
    },
    data (){
        return {
            center: [42.413306, -71.126423],
            map: null,
            tileLayer: null,
            routes: [],
        }
    },
    computed: {
        selectedRoute () { return this.$store.state.selectedRun }
    },
    methods: {
        setMap () {
            if (this.map != null) this.map.remove();
            this.map = L.map('route-map').setView(this.center, 13),
            this.tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/light-v10',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiZ3JhY2VmYWdhbiIsImEiOiJja3gyNmFlY3gwZzFtMnBtdWtzcDYxbmk5In0.XGxf9wDcKw_kxESf6FgaOQ'
            });
            this.tileLayer.addTo(this.map);
            this.setRoutes(this.runs)
        },
        setRoutes(runs) {
            let self = this
            this.routes = this.runs.map((run) => {
                if (!run.map.summary_polyline) return null;
                let decoded = polyline.decode(run.map.summary_polyline)
                return L.polyline(decoded, {data: run, color: 'purple', opacity: '.3', weight: '3'});
            })
            this.routes.forEach((route) => {
                if (route != null) {
                    route.on('click', () => {
                        if (self.selectedRoute == route.options.data){
                            self.$store.commit('deselectRun') 
                        } else {
                            self.$store.commit('selectRun', route.options.data)
                            document.getElementById(self.selectedRoute.id).scrollIntoView({behavior: "smooth", block: "center"});
                        }
                    })
                    route.addTo(this.map)
                }
            });
            if (this.routes.length != 0) this.map.fitBounds(this.routes[this.routes.length - 1].getBounds());
        }
    },
    watch: {
        runs() { this.setMap() },
        selectedRoute () {
            this.routes.forEach((route) => {
                if (route != null && (route.options.data == this.selectedRoute)) {
                    this.map.fitBounds(route.getBounds());
                    route.setStyle({opacity: '1', color: 'red'})
                } else if (route != null) {
                    route.setStyle({opacity: '.3', color: 'purple'})
                }
            })
        }
    },
    mounted() {
        this.setMap();
    }
}

//COMPONENT: Single Run
let singleRun = {
    template:"#single-run-template",
    props: {
        data: Object,
    },
    methods:{
        getMiles(dist){
            return Math.round(dist * 0.000621371192)
        },
        select() {
            (this.data === this.selectedRun) ? this.$store.commit('deselectRun') : this.$store.commit('selectRun', this.data)
        }
    },
    computed:{
        isSelected() { return this.data === this.selectedRun },
        selectedRun() { return this.$store.state.selectedRun }
    }
}

//COMPONENT: Runs List
let runsList = {
    template: "#runs-list-template",
    props: {
        before: Number,
        after: Number,
        timeframe: String
    },
    components: {
        'single-run': singleRun,
        'route-map': routeMap
    },
    data() {
        return {
            runs: [],
            count: null,
        }
    },
    computed: {
        selectedRun() { return this.$store.state.selectedRun }
    },
    watch: {
        after() {getData(this)}
    },
    mounted() {getData(this)} 
}

let specificTimeframe = {
    template: "#specific-timeframe-template",
    props: {
        bins: Array
    },
    data() {
        return {
            specificTime: null,
        }
    }
}

//COMPONENT: Timeframe Selector
let timeframeSelector = {
    template: "#timeframe-selector-template",
    components: {
        'runs-list': runsList,
        'specific-timeframe': specificTimeframe
    },
    data() {
        return {
            selectedTime: 'week',
            options: ['week', 'month', 'year']
        };
    },
    computed: {
        after() {return getTime(this.selectedTime)},
        bins() {
            switch(this.selectedTime) {
                case "week":
                    return getDates((new Date (2021, 0)), (new Date(2022, 0)));
                    break;
                case "month":
                    return Array.from({length: 12}, (item, i) => {
                        return new Date(2021, i).toLocaleString('en-US', {year: 'numeric', month: 'short'})
                      });
                    break;
                case "year":
                    return [2020, 2021]
            }  
        }
    }
}

new Vue({
    el: '#app',
    store: store,
    components: {
        'timeframe-selector': timeframeSelector,
    }
})