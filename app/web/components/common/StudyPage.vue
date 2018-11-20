<template>
  <div class="study-page">
    <div class="study-page-header">
      <div class="study-page-header-menu">
        <div class="study-page-header-menu-lef">
          <span @click="toLearnCenter" class="study-page-header-menu-left-button">学习中心</span>
          <span @click="toLessonCenter" class="study-page-header-menu-left-button">全部课程</span>
        </div>
        <div class="study-page-header-menu-right">
          <el-dropdown class="study-page-header-menu-right-dropdown">
            <span class="el-dropdown-link">
              解决方案<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>教学理念</el-dropdown-item>
              <el-dropdown-item>学校教师</el-dropdown-item>
              <el-dropdown-item>学生家长</el-dropdown-item>
              <el-dropdown-item>机构合作</el-dropdown-item>
              <el-dropdown-item>作品和创意大赛</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown class="study-page-header-menu-right-dropdown">
            <span class="el-dropdown-link">
              学习资源<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>教学视频</el-dropdown-item>
              <el-dropdown-item>Paracraft下载</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <span class="study-page-header-menu-right-link">查看教师页</span>
          <!-- <span class="study-page-header-menu-right-link">查看学生页</span> -->
        </div>
      </div>
    </div>
    <div class="study-page-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StudyPage',
  data() {
    return {
      activeIndex: ''
    }
  },
  watch: {
    $route(route) {
      console.warn(route)
    }
  },
  methods: {
    handleSelect(value) {
      console.warn(value)
    },
    toLearnCenter() {
    },
    toLessonCenter() {
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .study-page {
    &-header {
      &-menu {
        height: 50px;
        padding: 10px;
        flex-direction: column;
        align-items: flex-start;
        &-left-button {
          margin-right: 0px;
          font-size: 14px;
          padding: 4px 8px;
        }
        &-right {
          &-dropdown {
            margin-right: 0px;
          }
          &-link {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>


<style lang="scss">
.pull-right {
  float: right !important;
}
.study-page {
  &-header {
    max-width: 1200px;
    margin: 0 auto;
    border: none !important;
    &-menu {
      height: 87px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-left {
        &-button {
          padding: 8px 25px;
          color: #909399;
          font-size: 14px;
          background: #f5f5f5;
          border-radius: 4px;
          border: solid 1px #e8e8e8;
          cursor: pointer;
          margin-right: 20px;
          &:hover {
            background: #4db5ff;
            color: #ffffff;
          }
          &.selected {
            background: #2397f3;
            color: #ffffff;
          }
        }
      }
      &-right {
        &-dropdown {
          margin-right: 70px;
          cursor: pointer;
        }
        &-link {
          color: #2397f3;
          font-size: 16px;
          cursor: pointer;
          &:hover {
            color: #4db5ff;
          }
          &.selected {
            color: #4db5ff;
          }
        }
      }
      .el-row {
        margin-right: 0 !important;
        margin-left: 0 !important;
      }
    }
  }
  &-content {
    background: #f6f7f8;
  }
}
</style>


