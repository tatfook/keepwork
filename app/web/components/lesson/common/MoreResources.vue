<template>
  <div class="parent-more-container">
    <combo-box :routes="routes"></combo-box>
  </div>
</template>

<script>
import ComboBox from '@/components/combo/ComboBox'
export default {
  name: 'MoreResources',
  components: {
    ComboBox
  },
  data() {
    return {
      routes: {
        offline: {
          projectName: 'official/paracraft',
          filePath: 'offline-courses'
        },
        mentor: {
          projectName: 'official/paracraft',
          filePath: 'learn/mentor_service'
        },
        our_ideas_view_more: {
          projectName: 'official/paracraft',
          filePath: 'learn/our_ideas_view_more'
        }
      },
      currentFilePath: ''
    }
  },
  mounted() {
    const { params: { command } } = this.$route
    const { projectName, filePath } = this.routes[command]
    this.currentFilePath = filePath
  },
  watch: {
    $route(to) {
      const { params: { command } } = to
      const { projectName, filePath } = this.routes[command]
      this.currentFilePath = filePath
    }
  }
}
</script>

<style lang="scss">
.parent-more-container {
  background: #fff;
  max-width: 1200px;
  margin: 0 auto;
  div[data-mod] {
    .el-row {
      width: auto;
      max-width: 1200px;
    }
    .el-carousel__container {
      width: auto;
      max-width: 1200px;
    }
  }
}
</style>


