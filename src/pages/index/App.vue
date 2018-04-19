<template>
  <el-container id='app' class="index-page-container">
    <el-header height='61px' class="index-page-header">
      <common-header class="container"></common-header>
    </el-header>
    <el-main class="index-page-main">
      <tool-header class="container"></tool-header>
      <router-view/>
    </el-main>
    <el-aside></el-aside>
  </el-container>
</template>

<script>
import CommonHeader from '../../components/common/CommonHeader'
import ToolHeader from '../../components/common/ToolHeader'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    CommonHeader,
    ToolHeader
  },
  watch: {
    $route: 'updateActivePage'
  },
  methods: {
    ...mapActions({
      setActivePage: 'setActivePage',
      userInitPageDetail: 'user/initPageDetail'
    }),
    async updateActivePage() {
      let path = this.$router.currentRoute.path
      await this.setActivePage({ path, editorMode: false })
      try {
        await this.userInitPageDetail({
          url: path,
          visitor: this.username || ''
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    ...mapGetters({
      activePageUrl: 'activePageUrl',
      username: 'user/username'
    })
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
.container {
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
.index-page-main {
  padding: 0;
}
[mod-container] {
  overflow: hidden;
}
</style>