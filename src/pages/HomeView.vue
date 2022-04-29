
<script setup>
import RouteMap from '@/components/RouteMap.vue'

const clientID = process.env.VUE_APP_CLIENT_ID
const redirectURL = 'http://localhost:8080/redirect'
const scope = 'read,profile:read_all,activity:read_all'

function handleLogin () {
  window.location = `http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectURL}/exchange_token&approval_prompt=force&scope=${scope}`
}

</script>

<template>
  <div class="header">
    <button @click="handleLogin">Connect with Strava</button>
  </div>
    <!-- <RouteMap /> -->
</template>

<style scoped>
.header {
  margin-right: 30px;
  display: flex;
  justify-content: flex-end;
}
</style>
