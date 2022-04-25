<script setup>
import { onMounted } from 'vue'

import {
  cleanUpAuthToken,
  // AuthGetter,
} from "@/js/strava-config";

async function authenticate() {
  const stravaAuthToken = cleanUpAuthToken(location.search);
  console.log("authenticating");
  console.log(stravaAuthToken);
}

// const tokens = await AuthGetter(stravaAuthToken);
// const accessToken = tokens.access_token;
// const userID = tokens.athlete.id;
// const userData = await stravaRequest(stravaAuthToken);

onMounted(() => {
  authenticate();
})
</script>


<template>
  <div class="redirect">
    <h1>Loading...</h1>
  </div>
</template>
