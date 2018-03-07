<template>
  <div id='editor'>
    <el-menu mode='horizontal'>
      <el-menu-item index='0'>
        <a href='/'> Home </a>
      </el-menu-item>
      <el-menu-item index='1'>
        <router-link to='/editor'> Editor </router-link>
      </el-menu-item>
      <el-menu-item index='2'>
        <router-link to='/preview'> Preview </router-link>
      </el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'EditorPage'
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
