<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

var name = computed(() => store.state.userAccess.athlete.firstname)
var activities = computed(() => store.state.userActivities)

</script>

<template>
  <div class="activities">
    <h1>Hi, {{name}}!</h1>
    <p v-for="activity in activities" :key="activity.id" class="activity">{{activity.name}}</p>
  </div>
</template>