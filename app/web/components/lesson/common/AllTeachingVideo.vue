<template>
  <div class="all-teaching-video">
    <div class="all-teaching-video-content">
      <div class="all-teaching-video-content-sidebar">
        <el-tree
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
      <div class="all-teaching-video-content-main">
        <combo-box pattern="iframe" :routes="routes"></combo-box>
      </div>
    </div>
  </div>
</template>
<script>
import ComboBox from '@/components/combo/ComboBox'

const TeacherPageReg = /^\/teacher/

export default {
  name: 'AllTeachingVideo',
  components: {
    ComboBox
  },
  data() {
    return {
      routes: {
        animate: {
          projectName: 'official/paracraft',
          filePath: 'learn/our_ideas'
        },
        program: {
          projectName: 'official/paracraft',
          filePath: 'learn/parents'
        },
        cad: {
          projectName: 'official/paracraft',
          filePath: 'learn/works_and_contests'
        }
      },
      data: [
        {
          label: '教学视频:',
          children: [
            {
              label: '动画教学',
              value: 'animate'
            },
            {
              label: '编程教学',
              value: 'program'
            },
            {
              label: 'CAD教学',
              value: 'cad'
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
  computed: {
    isTeacherPage() {
      return TeacherPageReg.test(this.nowFullPath)
    },
    currentPath() {
      return this.isTeacherPage ? '/teacher' : '/student'
    },
  },
  methods: {
    handleNodeClick(data) {
      console.warn(data)
      if (data.value) {
        this.$router.push({ path: `${this.currentPath}/allteachingvideo/${data.value}` })
      }
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
