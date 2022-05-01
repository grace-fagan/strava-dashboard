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
  <div class="title">
    <h2>Dash! ミ ᕕ( •_•)ᕗ</h2>
    <!-- <h6>Where ya been?</h6> -->
  </div>
  <div class="container border">
    <RouteMap/>
    <div class="sidebar">
      <h3>You've gone on {{activities.length}} runs!</h3>
      <div class="activities">
        <RunsList />
      </div>
    </div>
  </div>
</template>

<style scoped>

.title {
  text-align: left;
}
.border {
  border: 4px solid navy;
  border-style: solid none solid none
}

.sidebar {
  border-left: 4px solid navy
}
.container {
  display: flex;
}

.activities {
  height: 100vh;
  overflow: scroll;
}

</style>
