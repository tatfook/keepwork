<template>
  <div class="activated-teacher-role">
    <el-container class="teacher">
      <el-aside width="260px">
        <el-menu :default-active="itmeActive" class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="showItem('TEACH')">
            <i class="iconfont icon-teach"></i>
            <span class="item-title" slot="title">{{$t('lesson.teach')}}</span>
          </el-menu-item>
          <el-menu-item index="2" @click="showItem('REVIEW')">
            <i class="iconfont icon-review"></i>
            <span class="item-title" slot="title">{{$t('lesson.review')}}</span>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">
              <i class="iconfont icon-setting"></i>
              <span class="item-title">{{$t('lesson.lessonManagement')}}</span>
            </template>
            <el-menu-item index="3-1">课程管理</el-menu-item>
            <el-menu-item index="3-2" @click="showItem('PACKAGE_MANAGER')">课程包管理</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>

</template>

<script>
export default {
  name: 'ActivatedTeacherRole',
  data() {
    return {
      itmeActive: '1'
    }
  },
  mounted() {
    switch (this.$route.name) {
      case 'TeacherColumnReview':
        this.itmeActive = '2'
        break
      case '':
        break
      default:
        this.itmeActive = '1'
    }
  },
  methods: {
    showItem(itemName) {
      switch (itemName) {
        case 'TEACH':
          this.itmeActive = '1'
          this.$router.push({
            path: `/teacher`
          })
          break
        case 'REVIEW':
          this.itmeActive = '2'
          this.$router.push({
            path: `/teacher/review`
          })
          break
        case 'PACKAGE_MANAGER':
          this.itmeActive = 1
          this.$router.push({
            path: `/teacher/packageManager`
          })
          break
        case 'MANAGEMENT':
          this.itmeActive = '3'
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
.activated-teacher-role {
  .teacher {
    margin: 0 auto;
    max-width: 1150px;
    .el-aside {
      padding: 80px 0;
      background: #fff;
      border-right: 10px solid #409efe;
      overflow: hidden;
      margin-right: 38px;
      .el-menu {
        border: none;
        .el-menu-item {
          border-bottom: 1px solid #d2d2d2;
        }
        .is-active {
          background: #409efe;
          color: #fff !important;
          .item-title {
            color: white;
          }
          .iconfont {
            color: white !important;
          }
        }
        .item-title {
          font-weight: 700;
          color: #111;
          font-size: 14px;
          height: 63px;
          line-height: 63px;
          cursor: pointer;
          padding: 0 10px;
          margin-left: 12px;
        }
      }
    }
    .el-main {
      overflow: hidden;
      padding: 0;
      // min-height: calc(100vh - 61px - 63px -104px);
    }
  }
}
</style>


