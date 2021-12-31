function getData(obj){
    axios.get("https://www.strava.com/api/v3/athlete/activities?per_page=200&after=" + obj.after +"&before=" + obj.before, {headers: {"Authorization": "Bearer d182538b987112a597be6d7b973c9006ad696e61"}})
    .then(response => {
        let distance = (response.data).reduce(function(prev, curr){
            return prev + curr.distance
        }, 0)
        obj.distance = Math.round(distance * 0.000621371192)
        obj.runs = (response.data);
        obj.count = response.data.length;});
}

//STORE to hold global state
const store = new Vuex.Store({
    state: {
      selectedRun: null,
      timeframe: 'week',
      specificTime: { before: getBeforeValue((new Date()), 'week'),
                    after: getAfterValue((new Date()), 'week')}
    },
    mutations: {
      selectRun (state, run) {
        state.selectedRun = run
      },
      deselectRun (state) {
          state.selectedRun = null
      },
      updateTimeframe(state, time) {
          state.timeframe = time
          state.specificTime = {before: getBeforeValue((new Date()), time), after: getAfterValue((new Date()), time)}
      },
      updateSpecificTime(state, time) {
          console.log("updating time to...", time)
          state.specificTime = time
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
            //set map to most recent route
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
        after: Number
    },
    components: {
        'single-run': singleRun,
        'route-map': routeMap
    },
    data() {
        return {
            runs: [],
            count: null,
            distance: 0
        }
    },
    computed: {
        selectedRun() { return this.$store.state.selectedRun },
        selectedTime() { return this.$store.state.timeframe }
    },
    watch: {
        after() {getData(this)}
    },
    mounted() {getData(this)} 
}

//COMPONENT: Specific timeframe
let specificTimeframe = {
    template: "#specific-timeframe-template",
    components: {
        'runs-list': runsList,
    },
    props: {
        bins: Array
    },
    methods: {
        updateSpecificTime(event) {
            console.log("updating specific time ...")
            let beforeVal = event.target.value
            let newTime = this.bins.find(e => e.before == beforeVal)
            console.log("new time!", newTime)
            this.$store.commit('updateSpecificTime', newTime)
        }
    },
    computed: {
        selectedTime () { return this.$store.state.timeframe },
        specificTime () { return this.$store.state.specificTime}
    }
}

//COMPONENT: Timeframe Selector
let timeframeSelector = {
    template: "#timeframe-selector-template",
    components: {
        'specific-timeframe': specificTimeframe
    },
    data() {
        return {
            options: ['week', 'month', 'year']
        };
    },
    methods: {
        updateTimeframe(event) {
            this.$store.commit('updateTimeframe', event.target.value)
        }
    },
    computed: {
        selectedTime () {return this.$store.state.timeframe},
        bins() {
            let curr_year = new Date().getFullYear()
            switch(this.selectedTime) {
                case "week":
                    return getWeekBins(new Date((curr_year), 0), (new Date(curr_year + 1, 0)));
                    break;
                case "month":
                    months = Array.from({length: 24}, (item, i) => {
                        return ({before: getBeforeValue(new Date(curr_year - 1, i), 'month'), after: getAfterValue(new Date(curr_year - 1, i), 'month')})
                    });
                    console.log(months)
                    return months;
                    break;
                case "year":
                    years = Array.from({length: 4}, (item, i) => {
                        return ({before: getBeforeValue(new Date(curr_year + (i - 3), 0), 'year'), after: getAfterValue(new Date(curr_year + (i - 3), 0), 'year')})
                    })
                    console.log(years)
                    return years;
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