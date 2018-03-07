<template>
  <div id='editor'>
    <el-menu mode='horizontal'>
      <el-menu-item index='0'>
        <a href='/'> Home </a>
      </el-menu-item>
      <el-menu-item index='1'>
        <router-link to='/user/repo/page1'> page1 </router-link>
      </el-menu-item>
      <el-menu-item index='2'>
        <router-link to='/user/repo/page2'> page2 </router-link>
      </el-menu-item>
      <el-button @click='showPreview'>Preview</el-button>
    </el-menu>
    <router-view/>
    <el-dialog
      :visible.sync='dialogVisible'
      width='100%'
      height='100%'>
      <PageViewer />
    </el-dialog>

  </div>
</template>

<script>
import PageViewer from '@/components/viewer/MdPageViewer'
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
  watch: {
    $route: 'setActivePage'
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
    PageViewer
  }
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
