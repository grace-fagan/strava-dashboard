
<script setup>
/* eslint-disable */
// import mapboxgl from 'mapbox-gl'
// import "mapbox-gl/dist/mapbox-gl.css"
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'

const polyline = require('@mapbox/polyline')
const store = useStore()

// hard code for now, but eventually get current location!
const center = [42.413306, -71.126423]
const accessToken = process.env.VUE_APP_MAPBOX_TOKEN

const activities = computed(() => store.state.userActivities)
const selectedRun = computed(() => store.state.selectedRun)

let routes = null
let map = null

const setMap = () => {
  // mapboxgl.accessToken = accessToken
  // const map = new mapboxgl.Map({
  //   container: 'mapContainer',
  //   style: 'mapbox://styles/gracefagan/cl41z1iv1001h15p8tzq6m7fy'
  // });
  // map.on('load', () => {

  // });

  map = L.map('map').setView(center, 13)
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'gracefagan/cl41z1iv1001h15p8tzq6m7fy',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: accessToken
  }).addTo(map)
  populateRoutes(map, activities.value)
}

const populateRoutes = (map, runs) => {
  // create new array of polyline routes from runs data
  routes = runs.map((run) => {
    if (!run.map.summary_polyline) return null
    const decoded = polyline.decode(run.map.summary_polyline)
    return L.polyline(decoded, { data: run.id, className: 'polyline', color: 'purple', opacity: '.3', weight: '3' })
  })

  routes = routes.filter((route) => { return route !== null; })

  routes.forEach((route) => {
    if (route !== null) {
      route.on('click', (e) => {
        if (e.target.options.data === selectedRun.value) {
          store.commit('deselectRun')
        } else {
          store.commit('selectRun', route.options.data)
        }
      })
      let routeThis = route.addTo(map)
      console.log(routeThis);
    }
  })
  // set viewport to most recent run
  if (routes.length !== 0) map.fitBounds(routes[0].getBounds())
}

watch(selectedRun, () => {
  const selectedRoute = routes.find((route) => {
    return route.options.data === selectedRun.value
  })

  if (selectedRoute) map.fitBounds(selectedRoute.getBounds())

  routes.forEach((e) => {
    e == selectedRoute ? e.setStyle({ opacity: '1', color: 'red'}) : e.setStyle({ opacity: '.3', color: 'purple'})
  })
})

onMounted(() => {
  setMap()
})

</script>

<template>
  <div class="map__container">
    <div id="map"></div>
  </div>
</template>

<style scoped>

.map__container {
    width: 80vw;
    height: 100%;
}

#map {
  width: 100%;
  height: 100%;
}

.polyline {
  color: red;
}
</style>
