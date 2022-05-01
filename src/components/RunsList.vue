<script setup>

import { useStore } from 'vuex'
import { computed } from 'vue'
const store = useStore()

const activities = computed(() => store.state.userActivities)
const selectedRun = computed(() => store.state.selectedRun)

let selected

const select = (e) => {
  if (this.data === selectedRun.value) {
    selected = false
    store.commit('deselectRun')
  } else {
    selected = true
    store.commit('selectRun', this.data)
  }
}
</script>

<template>
  <div @click="select" v-for="run in activities" class="run" :key="run.id" :data="run" :class="[selected ? 'selected' : '']">{{run.name}}</div>
</template>

<style scoped>
  .selected {
    color: red;
  }
</style>
