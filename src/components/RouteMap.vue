
<script setup>

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'

const polyline = require('@mapbox/polyline')
const store = useStore()

// hard code for now, but eventually get current location!
const center = [42.413306, -71.126423]
const accessToken = process.env.VUE_APP_MAPBOX_TOKEN

const activities = computed(() => store.state.userActivities)
const selectedRun = computed(() => store.state.selectedRun)
var routes = null
var map = null

const setMap = () => {
  map = L.map('mapContainer').setView(center, 13)
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: accessToken
  }).addTo(map)
  populateRoutes(map, activities.value)
}

const populateRoutes = (map, runs) => {
  routes = runs.map((run) => {
    if (!run.map.summary_polyline) return null
    const decoded = polyline.decode(run.map.summary_polyline)
    return L.polyline(decoded, { data: run, color: 'purple', opacity: '.3', weight: '3' })
  })

  routes.forEach((route) => {
    if (route !== null) {
      route.on('click', (e) => {
        if (e.target.options.data === selectedRun.value) {
          store.commit('deselectRun')
        } else {
          store.commit('selectRun', route.options.data)
          // document.getElementById(selectedRun.value.id).scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
      route.addTo(map)
    }
  })
  // set viewport to most recent run
  if (routes.length !== 0) map.fitBounds(routes[0].getBounds())
}

watch(selectedRun, () => {
  routes.forEach((route) => {
    if (route !== null && (route.options.data === selectedRun.value)) {
      map.fitBounds(route.getBounds())
      route.setStyle({ opacity: '1', color: 'red' })
    } else if (route != null) {
      route.setStyle({ opacity: '.3', color: 'purple' })
    }
  })
})

onMounted(() => {
  setMap()
})

</script>

<template>
    <div id="mapContainer"></div>
</template>

<style scoped>
#mapContainer {
    width: 80vw;
    height: 100vh;
}
</style>
