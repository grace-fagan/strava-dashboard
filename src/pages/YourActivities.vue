<script setup>
import { onMounted } from 'vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import HomePage from '@/components/HomePage.vue'


const store = useStore()

var name = computed(() => store.state.userAccess.athlete.firstname)
var activities = computed(() => store.state.userActivities)

onMounted( () => {
  console.log("this thing has been mounted")
})

</script>

<template>
  <div class="activities">
    <HomePage msg="Homepage"/>
    <h2>Hi, {{name}}! ᕕ( ᐛ )ᕗ</h2>
    <p v-for="activity in activities" :key="activity.id" class="activity">{{activity.name}}</p>
  </div>
</template>