<template>
  <div class="all-teaching-video">
    <div class="all-teaching-video-content">
      <div class="all-teaching-video-content-sidebar">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="all-teaching-video-content-main">
        <p>
         
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AllTeachingVideo',
  data() {
    return {
      data: [
        {
          label: '教学视频:',
          children: [
            {
              label: '动画教学'
            },
            {
              label: '编程教学'
            },
            {
              label: 'CAD教学'
            }
          ]
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>
<style lang="scss">
.all-teaching-video {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  &-content {
    display: flex;
    height: 100%;
    &-sidebar {
      width: 274px;
      height: 100%;
      margin-right: 36px;
      background: #fff;
    }
    &-main {
      flex: 1;
      background: #fff;
    }
  }
}
</style>
