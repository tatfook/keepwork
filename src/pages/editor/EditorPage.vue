<template>
  <el-container v-loading="loading" id="editor">
    <el-header>
      <EditorHeader></EditorHeader>
    </el-header>
    <el-main>
      <router-view @showPreview='showPreview' />
      <el-dialog class="preview-dialog" :visible.sync='dialogVisible ' width='100% ' height='100% '>
        <PageViewer />
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PageViewer from '@/components/viewer/MdPageViewer'
import EditorHeader from '@/components/editor/EditorHeader'

export default {
  name: 'EditorPage',
  data() {
    return {
      loading: false,
      dialogVisible: false
    }
  },
  created() {
    // this.updateActivePage()
  },
  watch: {
    $route: 'updateActivePage'
  },
  computed:{
    ...mapGetters({
      activePageInfo: 'activePageInfo'
    })
  },
  methods: {
    ...mapActions({
      setActivePage: 'setActivePage',
      userGetWebsiteDetailInfoByPath: 'user/getWebsiteDetailInfoByPath'
    }),
    async updateActivePage() {
      this.loading = true
      let path = this.$router.currentRoute.path
      await this.setActivePage({ path }).catch(e => {
        console.error(e)
        this.loading = false
      })
      await this.userGetWebsiteDetailInfoByPath({
        path: this.activePageInfo.sitepath
      })
      this.loading = false
    },
    showPreview() {
      this.dialogVisible = true
    }
  },
  components: {
    PageViewer,
    EditorHeader
  }
}
</script>

<style>
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
  background-color: #cdd4dc;
}
#editor {
  background: white;
}
.preview-dialog .el-dialog__body {
  padding: 30px 0;
}
</style>

<style lang="scss">
@function px2rem($px) {
  $rem: 100px;
  @return ($px/$rem) + rem;
}
</style>
