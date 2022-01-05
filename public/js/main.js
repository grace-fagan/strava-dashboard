function getGeneralData(after, bins){
    console.log("after value: ", after)
    axios.get("https://www.strava.com/api/v3/athlete/activities?per_page=200&after=" + after, {headers: {"Authorization": "Bearer 1514ce60a18e1faed4ae3c1e0113d72139503f24"}})
    .then (response => {
        response.data.forEach((run) => {
            let run_time = (new Date(run.start_date)).getTime() / 1000
            bins.forEach((bin) => {
                if (run_time < bin.before && run_time > bin.after)
                    bin.dist += run.distance
            })
        })
        console.log("bins: ", bins)
    })
}

function getRunListData(obj){
    axios.get("https://www.strava.com/api/v3/athlete/activities?per_page=200&after=" + obj.after +"&before=" + obj.before, {headers: {"Authorization": "Bearer 1514ce60a18e1faed4ae3c1e0113d72139503f24"}})
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
        getPace(speed){
            function str_pad_left(string,pad,length) {
                return (new Array(length+1).join(pad)+string).slice(-length);
            }
    
            let pace_in_seconds = 1609.344 / speed
            let pace_minutes = Math.floor(pace_in_seconds / 60)
            console.log(pace_minutes)
            let seconds = pace_in_seconds - pace_minutes * 60

            var finalPace = str_pad_left(pace_minutes,'0',2)+':'+str_pad_left(seconds,'0',2)
            return finalPace
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
        after() {getRunListData(this)}
    },
    mounted() {getRunListData(this)} 
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
        renderChart(){

            let margin = {top: 10, right: 30, bottom: 50, left: 40},
                width = 1200 - margin.left - margin.right,
                height = 150 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            let svg = d3.select("#timeline-chart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            let x = d3.scaleBand()
                .range([ 0, width ])
                .domain(this.bins.map(function(d) { return d.before; }))
                .padding(0.2);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end");

            let y = d3.scaleLinear()
                .domain([0, 40000])
                .range([ height, 0 ]);
            svg.append("g")
                .call(d3.axisLeft(y));

            svg.selectAll("bar")
                .data(this.bins)
                .enter()
                .append("rect")
                  .attr("x", function(d) { return x(d.before); })
                  .attr("y", function(d) { return y(d.dist); })
                  .attr("width", x.bandwidth())
                  .attr("height", function(d) { return height - y(d.dist); })
                  .attr("fill", "thistle")
        },
        //because the event only stores the before value, search array of bins to find matching before value to update specific timeframe in store
        updateSpecificTime(event) {
            let beforeVal = event.target.value
            let newTime = this.bins.find(e => e.before == beforeVal)
            this.$store.commit('updateSpecificTime', newTime)
        }
    },
    watch: {
        bins() {
            d3.select('#timeline-chart').selectAll('*').remove();
            this.renderChart()}
    },
    computed: {
        selectedTime () { return this.$store.state.timeframe },
        specificTime () { return this.$store.state.specificTime}
    },
    mounted() {
        this.renderChart()
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
        },
        getGeneralData(after, bins){
            console.log("after value: ", after)
            axios.get("https://www.strava.com/api/v3/athlete/activities?per_page=200&after=" + after, {headers: {"Authorization": "Bearer 1514ce60a18e1faed4ae3c1e0113d72139503f24"}})
            .then (response => {
                response.data.forEach((run) => {
                    let run_time = (new Date(run.start_date)).getTime() / 1000
                    bins.forEach((bin) => {
                        if (run_time < bin.before && run_time > bin.after)
                            bin.dist += run.distance
                    })
                })
            })
        }
    },
    computed: {
        selectedTime () {return this.$store.state.timeframe},
        bins() {
            let curr_year = new Date().getFullYear()
            let curr_month = new Date().getMonth()
            let curr_day = new Date().getDate()
            switch(this.selectedTime) {
                case "week":
                    return (getWeekBins(new Date((curr_year - 1), curr_month, curr_day), (new Date(curr_year, curr_month, curr_day)))).reverse();
                    break;
                case "month":
                    months = Array.from({length: 24}, (item, i) => {
                        return ({before: getBeforeValue(new Date(curr_year, curr_month - i), 'month'), after: getAfterValue(new Date(curr_year, curr_month - i), 'month'), dist: 0})
                    });
                    return months;
                    break;
                case "year":
                    years = Array.from({length: 4}, (item, i) => {
                        return ({before: getBeforeValue(new Date(curr_year - i, 0), 'year'), after: getAfterValue(new Date(curr_year - i, 0), 'year'), dist: 0})
                    })
                    return years;
            }  
        }
    },
    // watch: {
    //     bins() {
    //         this.getGeneralData(getAfterValue(new Date(2021, 0), 'year'), this.bins)
    //     }
    // },
    // mounted() {
    //     this.getGeneralData(getAfterValue(new Date(2021, 0), 'year'), this.bins)
    // }
}

new Vue({
    el: '#app',
    store: store,
    components: {
        'timeframe-selector': timeframeSelector,
    }
})