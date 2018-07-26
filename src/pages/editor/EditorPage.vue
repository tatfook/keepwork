<template>
  <el-container v-loading="showLoading" id="editor">
    <el-header>
      <EditorHeader></EditorHeader>
    </el-header>
    <el-main>
      <router-view @showPreview='showPreview' />
      <!-- <el-dialog class="preview-dialog" :visible.sync='previewDialogVisible' width='88% ' height='100% '> -->
        <div class="preview-site-wrap" id="previewWinSite">
            <div class="preview-site-close"><span @click="handleClosePreview">X</span></div>
            <div class="preview-content-wrap">
              <PageViewer/>
            </div>
        </div>
      <!-- </el-dialog> -->
    </el-main>
    <div @click.stop v-if="showLoginDialog">
      <LoginDialog :show="showLoginDialog" :forceLogin="true" @close="handleLoginDialogClose"/>
    </div>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import fullscreen from 'vue-fullscreen'
import PageViewer from '@/components/viewer/MdPageViewer'
import LoginDialog from '@/components/common/LoginDialog'
import EditorHeader from '@/components/editor/EditorHeader'

export default {
  name: 'EditorPage',
  data() {
    return {
      loading: false,
      previewDialogVisible: false,
      profileLoaded: false,
      isFullscreen: false,
      showPreviewClose: false
    }
  },
  async mounted() {
    await this.userGetProfile().catch(e => console.error(e))
    this.profileLoaded = true
    document.title = 'wikieditor'
  },
  watch: {
    $route: 'updateActivePage'
  },
  computed:{
    ...mapGetters({
      activePageInfo: 'activePageInfo',
      userIsLogined: 'user/isLogined',
    }),
    showLoginDialog() {
      return this.profileLoaded && !this.userIsLogined
    },
    showLoading() {
      return !this.showLoginDialog && this.loading
    }
  },
  methods: {
    ...mapActions({
      setActivePage: 'setActivePage',
      userGetProfile: 'user/getProfile',
      userGetWebsiteDetailInfoByPath: 'user/getWebsiteDetailInfoByPath'
    }),
    async updateActivePage() {
      this.loading = true
      let path = this.$router.currentRoute.path
      await this.setActivePage({ path }).catch(e => {
        console.error(e)
        this.loading = false
        // this.$router.push('/')
        throw new Error('Set activeAage failed, goto initial page!')
      })
      await this.userGetWebsiteDetailInfoByPath({
        path: this.activePageInfo.sitepath
      }).catch(e => {
        console.error(e)
        this.loading = false
      })
      this.loading = false
    },
    showPreview() {
      // this.previewDialogVisible = true
      this.showPreviewClose = true
      this.$fullscreen.toggle(this.$el.querySelector('#previewWinSite'), {
        wrap: false,
        fullscreenClass: 'preview-win-fullscreen',
        callback: this.fullscreenChange
      })
    },
     fullscreenChange(fullscreen) {
      this.isFullscreen = fullscreen
    },
    handleClosePreview(){
      this.$fullscreen.toggle(this.$el.querySelector('#previewWinSite'), {
        wrap: false,
        fullscreenClass: 'preview-win-fullscreen',
        callback: this.fullscreenChange
      })
      this.showPreviewClose = false
    },
    handleLoginDialogClose() {
      location.reload()
    }
  },
  components: {
    PageViewer,
    EditorHeader,
    LoginDialog
  }
}
</script>

<style >
html,
body,
.el-container {
  height: 100%;
}
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
}
.el-main {
  height: 100%;
  padding: 17px 0;
}
#editor {
  background: white;
}
.preview-dialog .el-dialog__body {
  padding: 30px 0;
}
.preview-dialog .el-main{
  background-color: #fff;
  overflow: hidden;
}
.preview-site-wrap{
  height: 0;
  overflow: hidden;
}
.preview-win-fullscreen {
  width: 100% !important;
  height: 100%;
  padding: 10px;
  overflow: hidden;
}
.preview-content-wrap{
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.preview-site-close {
  overflow: hidden;
}
.preview-site-close span{
  display: block;
  text-align: center;
  line-height: 50px;
  height: 50px;
  width: 50px;
  float: right;
  cursor: pointer;
  color: #000;
}
</style>

<style lang="scss">
@function px2rem($px) {
  $rem: 100px;
  @return ($px/$rem) + rem;
}
</style>
