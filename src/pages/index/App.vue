<template>
  <div id='app'>
    <common-header></common-header>
    <router-view/>
  </div>
</template>

<script>
import CommonHeader from '../../components/viewer/CommonHeader'
export default {
  name: 'App',
  components: {
      CommonHeader
  }
}
</script>

<style>
body{
    margin: 0;
    padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
