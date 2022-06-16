<script setup>
/* eslint-disable */

import { useStore } from 'vuex'
import { computed, watch } from 'vue'
const store = useStore()

const activities = computed(() => store.state.userActivities)
const selectedRun = computed(() => store.state.selectedRun)

function select (run) {
  (run === selectedRun.value) ? store.commit('deselectRun') : store.commit('selectRun', run.id)
}

watch(selectedRun, () => {
  document.getElementById(selectedRun.value).scrollIntoView({ behavior: "smooth", block: "center"})
})

</script>

<template>
  <div class="list__container">
    <div v-for="run in activities" @click="select(run)" class="run" :class="selectedRun == run.id ? 'selected' : ''" :data="run" :key="run.id" :id="run.id">{{run.name}}</div>
  </div>
</template>

<style scoped>

  .list__container {
    height: 100%;
  }

  .run {
    cursor: pointer;
  }

  .selected {
    font-weight: bold;
  }
</style>
