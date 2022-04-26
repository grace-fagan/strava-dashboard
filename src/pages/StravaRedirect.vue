<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import {
  cleanUpAuthToken,
  AuthGetter,
  getUserData,
} from "@/js/strava-config";

const store = useStore()
const router = useRouter()

async function authenticate() {

  // Save the Auth Token
  const stravaAuthToken = cleanUpAuthToken(location.search);

  // Post Request to Strava (with AuthToken) which returns Refresh Token and and Access Token
  const userAccess = await AuthGetter(stravaAuthToken);
  const accessToken = userAccess.access_token;
  const userID = userAccess.athlete.id;
  store.commit("setUserAccess", userAccess);

  //Get user data!
  var activities = [];
  let page = 1;
  do {
    var activity_page = await getUserData(userID, accessToken, page);
    activities = activities.concat(activity_page.data);
    page ++;
  } while (activity_page.data.length != 0);

  //Add activities to store and redirect user to activities page
  store.commit("setUserActivities", activities);
  router.push({ name: "activities"})
}

onMounted(() => {
  // if (store.userAccess) {
  //   console.log("I already have an access token!!")
  // } else {
    authenticate();
  //}
})
</script>

<template>
  <div class="redirect">
    <h1>🤸‍♂️ Loading 🤸‍♂️...</h1>
  </div>
</template>
