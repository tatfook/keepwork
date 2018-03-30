<template>
  <el-container id='app' class="index-page-container">
    <el-header height='61px' class="index-page-header">
      <common-header class="container"></common-header>
    </el-header>
    <el-main class="index-page-main">
      <router-view/>
    </el-main>
    <el-aside></el-aside>
    <el-footer height='100px' class="index-page-footer">
      <common-footer class="container"></common-footer>
    </el-footer>
  </el-container>
</template>

<script>
import CommonHeader from '../../components/common/CommonHeader'
import CommonFooter from '../../components/common/CommonFooter'
export default {
  name: 'App',
  components: {
    CommonHeader,
    CommonFooter
  },
  created() {
    // this.updateActivePage()
  },
  watch: {
    $route: 'updateActivePage'
  },
  methods: {
    updateActivePage() {
      this.$store.dispatch('setActivePage', this.$router.currentRoute.path)
    }
  }
}
</script>

<style>
html,
body {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
.index-page-header .container {
  max-width: 1140px;
  margin: 0 auto;
}
.index-page-header {
  border-bottom: 1px solid #e6e6e6;
}
.index-page-footer {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
}
.index-page-container {
  min-height: 100%;
}
</style>