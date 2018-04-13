<template>
  <el-container v-loading="loading" id="editor">
      <el-header>
        <EditorHeader></EditorHeader>
      </el-header>
      <el-main>
        <router-view @showPreview='showPreview' />
        <el-dialog :visible.sync='dialogVisible ' width='100% ' height='100% '>
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
    this.updateActivePage()
  },
  watch: {
    $route: 'updateActivePage'
  },
  methods: {
    ...mapActions({
      setActivePage: 'setActivePage'
    }),
    async updateActivePage() {
      this.loading = true
      await this.setActivePage(this.$router.currentRoute.path).catch(e => {
        console.error(e)
        this.loading = false
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
</style>

<style lang="scss">
@function px2rem($px) {
  $rem: 100px;
  @return ($px/$rem) + rem;
}
</style>
