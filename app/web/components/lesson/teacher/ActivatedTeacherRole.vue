<template>
  <div class="activated-teacher-role">
    <div class="activated-teacher-role-content">
      <div class="activated-teacher-role-content-left">
        <div class="activated-teacher-role-content-left-top">
          <div class="avatar">
            <img :src="userProfile.portrait || avatar" alt="">
          </div>
          <div class="nickname-wrap">
            <div class="nickname">{{username}}</div>
          </div>
        </div>
        <div class="activated-teacher-role-content-left-options">
          <el-menu ref='teacherColumnMenu' :mode='menuMode' :key="'mode-'+menuMode" :default-active="itmeActive" menu-trigger='click' text-color='' active-text-color='#fff'>
            <el-menu-item v-if="!isTeacher" index="0" @click="showItem('APPLY')" class="activated-teacher-role-apply">
              <span class="activated-teacher-role-apply-content" slot="title">申请开通</span>
              <span class="activated-teacher-role-apply-fake">{{$t('lesson.teach')}}</span>
              <span class="activated-teacher-role-apply-fake">{{$t('lesson.review')}}</span>
            </el-menu-item>
            <el-menu-item v-if="isTeacher" index="1" @click="showItem('TEACH')">
              <span class="item-title" slot="title">{{$t('lesson.teach')}}</span>
            </el-menu-item>
            <el-menu-item v-if="isTeacher" index="2" @click="showItem('REVIEW')">
              <span class="item-title" slot="title">{{$t('lesson.review')}}</span>
            </el-menu-item>
            <el-submenu index="3" class='lesson-manager-popver-menu' popper-class="manage-menu">
              <template slot="title">
                <span class="item-title">{{$t('lesson.lessonManagement')}}</span>
              </template>
              <el-menu-item index="3-1" @click="showItem('LESSON_MANAGER')">{{$t('lesson.lessonManage.lessonTitle')}}</el-menu-item>
              <el-menu-item index="3-2" @click="showItem('PACKAGE_MANAGER')">{{$t('lesson.packageManage.package')}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="!isMentor" index="4" @click="showItem('MENTOR_INVITE')">
              <span class="item-title" slot="title">{{$t('lesson.becomeAMentor')}}</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="activated-teacher-role-content-right">
        <router-view :windowWidth='windowWidth'></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import avatar from '@/assets/img/default_portrait.png'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ActivatedTeacherRole',
  data() {
    return {
      windowWidth: window.innerWidth,
      itmeActive: '1',
      avatar,
      currOption: 'teaching'
    }
  },
  mounted() {
    this.decideRouter()
    this.setActiveItem()
    window.addEventListener('resize', this.handleWindowResize)
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      username: 'user/username',
      tutorInfo: 'lesson/tutorInfo',
      userIsTeacher: 'lesson/isTeacher',
      userIsAlliance: 'lesson/isAlliance'
    }),
    menuMode() {
      return this.windowWidth > 678 ? 'vertical' : 'horizontal'
    },
    isTeacher() {
      return this.userIsTeacher
    },
    isAlliance() {
      return this.userIsAlliance
    },
    isLearner() {
      return !this.isTeacher && !this.isAlliance
    },
    isMentor() {
      if (!this.tutorInfo) {
        return false
      }
      let { startTime, endTime } = this.tutorInfo
      return moment(new Date()).isBetween(startTime, endTime, 'minute')
    }
  },
  methods: {
    sharedCourseLecturer() {
      this.$router.push('/teacher/sharedCourseLecturer')
    },
    setActiveItem() {
      switch (this.$route.name) {
        case 'TeacherColumnReview':
          this.itmeActive = '2'
          break
        case 'TeacherColumnNewLesson':
        case 'TeacherColumnLessonManager':
        case 'TeacherColumnEditLesson':
          this.itmeActive = '3-1'
          break
        case 'TeacherColumnNewPackage':
        case 'TeacherColumnEditPackage':
        case 'TeacherColumnPackageManager':
          this.itmeActive = '3-2'
          break
        case 'TeacherColumn':
          this.itmeActive = '1'
          break
        case 'TeacherColumnApply':
          this.itmeActive = '0'
          break
        case 'TeacherColumnMentorInvite':
          this.itmeActive = '4'
          break
        default:
          this.itmeActive = this.isTeacher ? '0' : '1'
      }
    },
    showItem(itemName) {
      switch (itemName) {
        case 'APPLY':
          this.$router.push({
            path: `/teacher/apply`
          })
          break
        case 'TEACH':
          this.$router.push({
            path: `/teacher`
          })
          break
        case 'REVIEW':
          this.$router.push({
            path: `/teacher/review`
          })
          break
        case 'LESSON_MANAGER':
          this.$router.push({
            path: `/teacher/lessonManager`
          })
          break
        case 'PACKAGE_MANAGER':
          this.$router.push({
            path: `/teacher/packageManager`
          })
          break
        case 'MENTOR_INVITE':
          this.$router.push({
            path: `/teacher/mentor`
          })
          break
        default:
          break
      }
    },
    decideRouter() {
      let routeName = this.$route.name
      if (!this.isTeacher && (routeName == 'TeacherColumn' || routeName == 'TeacherColumnReview')) {
        this.$router.push({
          path: `/teacher/apply`
        })
        return
      }
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  watch: {
    $route() {
      this.decideRouter()
      this.setActiveItem()
    }
  }
}
</script>

<style lang="scss">
.activated-teacher-role {
  margin: 10px 0;
  &-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    &-left {
      text-align: center;
      background: #fff;
      margin-right: 16px;
      width: 274px;
      &-top {
        padding: 35px 0 0;
        .avatar {
          width: 96px;
          height: 96px;
          border: 1px solid #ccc;
          margin: 0 auto;
          border-radius: 50%;
          margin-bottom: 14px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }
        }
        .nickname {
          font-size: 24px;
          line-height: 34px;
          color: #333333;
          font-family: "ArialMT";
          margin: 5px;
        }
        .lecturer {
          display: flex;
          justify-content: center;
          color: #2d9cf4;
          &-sharing-resource {
            width: 22px;
            height: 22px;
            object-fit: cover;
            margin-right: 5px;
            cursor: pointer;
          }
          &-text {
            cursor: pointer;
          }
        }
      }
      &-options {
        margin: 27px 20px;
        border-top: 1px solid #cfd8dc;
        padding: 20px 0;
        .el-menu {
          border: none;
          .el-submenu__title {
            height: 40px;
            line-height: 32px;
            font-size: 16px;
            color: #333;
            background-color: #f5f5f5;
            border-radius: 4px;
            border: solid 1px #bcbcbc;
          }
          .lesson-manager-popver-menu {
            margin-bottom: 16px;
            .el-menu {
              .el-menu-item {
                margin: 0;
                border-top: none;
                background: #fff;
                border-radius: 0;
                &.is-active {
                  background: #2196f3;
                }
              }
            }
          }
          .el-menu-item {
            padding: 0 !important;
            height: 40px;
            line-height: 38px;
            font-size: 16px;
            color: #333;
            background-color: #f5f5f5;
            border-radius: 4px;
            border: solid 1px #bcbcbc;
            margin-bottom: 16px;
            &.is-active {
              background: #2196f3;
            }
          }
        }
      }
    }
    &-right {
      flex: 1;
      min-width: 0;
      background-color: #fff;
    }
  }
  & .el-menu &-apply.el-menu-item {
    position: relative;
    height: auto;
    background-color: transparent;
    border: none;
    overflow: hidden;
    &.is-active {
      background-color: transparent;
    }
  }
  &-apply {
    &-fake {
      height: 40px;
      line-height: 38px;
      font-size: 16px;
      color: #333;
      background-color: #f5f5f5;
      border-radius: 4px;
      border: solid 1px #bcbcbc;
      margin-top: 16px;
      display: block;
      &:first-child {
        margin-top: 0;
      }
    }
    &-content {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.68);
      font-size: 24px;
      font-weight: bold;
      padding-top: 30px;
      color: #fff;
    }
  }
}
@media screen and (max-width: 768px) {
  .activated-teacher-role {
    &-content {
      display: block;
      &-left {
        width: 100%;
        &-top {
          display: flex;
          .avatar {
            width: 99px;
            margin-left: 22px;
          }
          .nickname-wrap {
            flex: 1;
            padding: 12px 60px 12px 0;
            text-align: right;
            .lecturer {
              justify-content: flex-end;
            }
          }
        }
        &-options {
          padding: 0;
          .el-menu {
            display: flex;
            .el-menu-item {
              flex: 1;
              border: none;
              border-radius: 0;
            }
            .lesson-manager-popver-menu {
              padding: 0;
              &.is-active {
                .el-submenu__title {
                  background: #409efe;
                }
              }
              .el-submenu__title {
                border: none;
                border-radius: 0;
              }
            }
          }
        }
      }
    }
  }
  .manage-menu {
    .el-menu {
      .el-menu-item.is-active {
        background: #409efe;
      }
    }
  }
}
</style>

