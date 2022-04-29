<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import RouteMap from '@/components/RouteMap.vue'
import RunsList from '@/components/RunsList.vue'

const store = useStore()

const athlete = computed(() => store.state.userAccess.athlete)
const activities = computed(() => store.state.userActivities)

</script>

<template>
  <div class="container">
    <h3>You've gone on {{activities.length}} runs!</h3>
  </div>
  <div class="container">
    <RouteMap/>
    <div class="sidebar">
      <h2>Hi, {{athlete.firstname}}!</h2>
      <div class="activities">
        <RunsList />
      </div>
    </div>
  </div>
</template>

<style scoped>

.container {
  display: flex;
}
.activities {
  max-height: 100vh;
  overflow: scroll;
}

</style>
