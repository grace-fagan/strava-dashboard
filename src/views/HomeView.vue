
<script setup>
import HelloWorld from '@/components/HelloWorld.vue'

    const clientID = process.env.VUE_APP_CLIENT_ID;
    const redirectURL = "http://localhost:8080/redirect";
    const scope = "read,profile:read_all,activity:read_all"

    function handleLogin() {
        window.location = `http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectURL}/exchange_token&approval_prompt=force&scope=${scope}`;
    }
    
</script>

<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <HelloWorld msg="Homepage"/>
    <button @click="handleLogin">Connect with Strava</button>
  </div>
</template>

