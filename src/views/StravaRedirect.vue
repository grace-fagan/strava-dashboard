<script setup>
import { onMounted } from 'vue'

import {
  cleanUpAuthToken,
  AuthGetter,
  getUserData,
} from "@/js/strava-config";

async function authenticate() {

  // Save the Auth Token
  const stravaAuthToken = cleanUpAuthToken(location.search);

  // Post Request to Strava (with AuthToken) which returns Refresh Token and and Access Token
  const tokens = await AuthGetter(stravaAuthToken);
  const accessToken = tokens.access_token;
  const userID = tokens.athlete.id;

  console.log("access: ", accessToken, "ID: ", userID)

  //Get user data!
  const activities = await getUserData(userID, accessToken);
  console.log(activities);
}

onMounted(() => {
  authenticate();
})
</script>


<template>
  <div class="redirect">
    <h1>Loading...</h1>
  </div>
</template>
