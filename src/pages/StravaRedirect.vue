<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import {
  cleanUpAuthToken,
  AuthGetter,
  getUserData
} from '@/js/strava-config'

const store = useStore()
const router = useRouter()

async function authenticate () {
  // Save the Auth Token
  const stravaAuthToken = cleanUpAuthToken(location.search)

  // Post Request to Strava (with AuthToken) which returns Refresh Token and and Access Token
  const userAccess = await AuthGetter(stravaAuthToken)
  const accessToken = userAccess.access_token
  const userID = userAccess.athlete.id
  store.commit('setUserAccess', userAccess)

  // Get user data!
  let activities = []
  let page = 1
  do {
    var activityPage = await getUserData(userID, accessToken, page)
    activities = activities.concat(activityPage.data)
    page++
  } while (activityPage.data.length !== 0)

  // Add activities to store and redirect user to activities page
  store.commit('setUserActivities', activities)
  router.push({ name: 'activities' })
}

onMounted(() => {
  authenticate()
})
</script>

<template>
  <div class="redirect">
    <h1>🤸‍♂️ Loading 🤸‍♂️...</h1>
  </div>
</template>
