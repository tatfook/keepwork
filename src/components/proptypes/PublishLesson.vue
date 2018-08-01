<template>
    <div class="menu-type">
        <el-button plain type='primary' @click="publish">发布课程</el-button>
    </div>
</template>

<script>
export default {
  name: 'PublishLesson',
  data() {
    return {}
  },
  methods: {
    publish() {
      // TODO: 发布课程
      console.log('publish----------->')
    }
  }
}
</script>


<style lang="scss">
.menu-type {
  margin-top: 20px;
}
</style>



