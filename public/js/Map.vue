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