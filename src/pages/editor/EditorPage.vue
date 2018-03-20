<template>
  <el-container id="editor">
    <el-header>
      <EditorHeader></EditorHeader>
    </el-header>
    <el-main>
      <router-view/>
      <el-dialog :visible.sync='dialogVisible' width='100%' height='100%'>
        <PageViewer />
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions } from 'vuex'
import PageViewer from '@/components/viewer/MdPageViewer'
import EditorHeader from '@/components/editor/EditorHeader'

export default {
  name: 'EditorPage',
  data() {
    return {
      dialogVisible: false
    }
  },
  created() {
    this.setActivePage()
  },
  mounted() {
    this.userLogin({
      username: 'kaitlyn',
      password: '123456'
    })

    this.getAllProjects()
  },
  watch: {
    $route: 'setActivePage'
  },
  methods: {
    ...mapActions({
      getAllProjects: 'gitlab/getAllProjects',
      userLogin: 'user/login'
    }),
    setActivePage() {
      this.$store.dispatch('setActivePage', this.$router.currentRoute.path)
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
  padding: 17px 16px;
  background-color: #cdd4dc;
}
</style>

<style lang="scss">
@function px2rem($px) {
  $rem: 100px;
  @return ($px/$rem) + rem;
}
</style>

