<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <LoginWe></LoginWe>
  </div>
</template>

<script>
import LoginWe from './components/login/login.vue'

export default {
  name: 'app',
  components: {
    LoginWe
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
