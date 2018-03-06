<template>
  <div id='app'>
    <el-menu mode='horizontal'>
      <el-menu-item index='1'>
        <router-link to='/'> Home </router-link>
      </el-menu-item>
      <el-menu-item index='2'>
        <router-link to='/editor'> Editor </router-link>
      </el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
