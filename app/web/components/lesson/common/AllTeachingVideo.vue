<template>
  <div class="all-teaching-video">
    <div class="all-teaching-video-content">
      <div class="all-teaching-video-content-sidebar">
        <el-tree
          :data="data"
          node-key="id"
          :current-node-key="defaultKey"
          :default-expand-all="true"
          :highlight-current="true"
          :props="defaultProps"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
      <div class="all-teaching-video-content-main">
        <combo-box
          :routes="routes"
          :autoWidth="true"
        ></combo-box>
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
          filePath: 'animation-tutorials'
        },
        program: {
          projectName: 'official/paracraft',
          filePath: 'codeblock'
        },
        cad: {
          projectName: 'intro/keepwork',
          filePath: 'NPLCAD'
        }
      },
      data: [
        {
          id: 1,
          label: `${this.$t("lesson.instructionalVideos")}:`,
          children: [
            {
              id: 2,
              label: this.$t("lesson.animationsLesson"),
              value: 'animate'
            },
            {
              id: 3,
              label: this.$t("lesson.programmingLesson"),
              value: 'program'
            },
            {
              id: 4,
              label: this.$t("lesson.CADLesson"),
              value: 'cad'
            }
          ]
        },
      ],
      defaultKey: 2,
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
      margin-right: 10px;
      background: #fff;
    }
    &-main {
      flex: 1;
      background: #fff;
      height: 100%;
      overflow: hidden;
      padding-left: 10px;
      .el-row {
        width: auto;
        max-width: 930px;
      }
      div[data-mod] {
        width: auto;
        max-width: 930px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .all-teaching-video {
    display: block;
    height: auto;
    &-content {
      display: block;
      height: auto;
      &-sidebar {
        width: 100%;
      }
    }
  }
}
</style>
