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
import { mapActions, mapGetters } from 'vuex'
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
  },
  watch: {
    $route: 'setActivePage'
  },
  computed: {
  },
  methods: {
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
