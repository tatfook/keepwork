<template>
  <el-container id='app' class="index-page-container">
    <el-header height='61px' class="index-page-header" v-if="!isSystemCompShow.isSystemHeaderHide">
      <common-header class="container"></common-header>
    </el-header>
    <el-main class="index-page-main">
      <tool-header class="container" v-if="!isSystemCompShow.isSystemHeaderHide"></tool-header>
      <router-view/>
    </el-main>
    <el-aside></el-aside>
    <el-footer height='auto' class="index-page-footer" v-if="!isSystemCompShow.isSystemFooterHide">
      <common-footer class="container"></common-footer>
    </el-footer>
  </el-container>
</template>

<script>
import CommonHeader from '../../components/common/CommonHeader'
import CommonFooter from '../../components/common/CommonFooter'
import ToolHeader from '../../components/common/ToolHeader'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    CommonHeader,
    CommonFooter,
    ToolHeader
  },
  watch: {
    $route: 'updateActivePage',
    activePageInfo(activePageInfo) {
      let { username, sitename, pagename } = activePageInfo
      document.title = pagename || sitename || username || 'KeepWork'
    }
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
      username: 'user/username',
      userSiteLayoutConfigBySitePath: 'user/siteLayoutConfigBySitePath',
      activePageInfo: 'activePageInfo'
    }),
    isSystemCompShow() {
      let userSiteLayoutConfig = this.userSiteLayoutConfigBySitePath(
        `${this.activePageInfo.username}/${this.activePageInfo.sitename}`
      )
      return {
        isSystemHeaderHide: _.get(
          userSiteLayoutConfig,
          'layoutConfig.isSystemHeaderHide',
          false
        ),
        isSystemFooterHide: _.get(
          userSiteLayoutConfig,
          'layoutConfig.isSystemFooterHide',
          false
        )
      }
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
@media print {
  @media (max-width: 767px) {
    .hidden-xs-only {
      display: none !important;
    }
  }
  @media (min-width: 768px) {
    .hidden-sm-and-up {
      display: none !important;
    }
  }
}
</style>