<template>
  <div class="org-student">
    <div class="org-student-container">
      <div class="org-student-sidebar" v-if="isShowSidebar">
        <div class="org-student-sidebar-top">
          <div class="org-student-message">
            <div v-if="isJustStudent" class="org-student-role-label">{{$t("org.studentRole")}}</div>
            <el-dropdown v-else class="org-student-role-label" @command="toRolePage" trigger="click" placement="bottom">
              <span class="el-dropdown-link">
                {{$t("org.studentRole")}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="orgIsAdmin" command="OrgPackages">{{$t("org.admin")}}</el-dropdown-item>
                <el-dropdown-item v-if="orgIsTeacher" command="OrgTeacher">{{$t("org.teacherRole")}}</el-dropdown-item>
                <el-dropdown-item class="org-student-role-label-active">{{$t("org.studentRole")}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <user-portrait :user="userinfo" class="org-student-profile" size="large"></user-portrait>
            <div class="org-student-username">{{username}}</div>
            <div class="org-student-edit-btn" v-if="isShowEditUserInfo" @click="showEditStudentDialog">编辑个人信息</div>
          </div>
        </div>

        <div class="org-student-renew" v-if="isShowRenewPane">
          <div class="org-student-renew-expire">有效期至: {{studentEndTime}}</div>
          <span class="org-student-renew-button" @click="() => isShowJoinClassDialog = true"><i class="el-icon-circle-plus-outline"></i> 续费</span>
        </div>

        <div class="org-student-class-select" v-if="isClassDetailPage">
          <el-dropdown v-if="isMultiClasses" class="class-select-dropdown" @command="onDropdown">
            <span class="el-dropdown-link">
              <i class="iconfont icon-team org-student-class-select-icon"></i>
              <span class="org-student-class-select-dropdown-item">
                {{currentClassName}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in orgClasses" :key="item.id" :command="item.id">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span v-else class="org-student-class-onlyone">
            <i class="iconfont icon-team org-student-class-onlyone-icon"></i>
            <span class="org-student-class-onlyone-class-name">
              {{currentClassName}}
            </span>
          </span>
        </div>

        <div v-if="isClassDetailPage" class="org-student-sidebar-bottom org-student-sidebar-evaluations" @click="toEvaluationsPage">
          <i class="iconfont icon-pinggubaogao"></i> 我的评估报告
        </div>
        <div class="org-student-sidebar-bottom" v-if="isClassDetailPage">
          <div class="org-student-operation">
            <span>我的老师</span>
          </div>
          <div v-if="hasTeacher" class="org-student-menu">
            <span class="org-student-menu-item" v-for="item in myTeacher" :key="item.id" :title="item.realname">
              <i class="iconfont icon-jiaoshi1 org-student-menu-item-icon"></i>
              <span @click="toUserPage(item.username)" class="org-student-menu-item-username">{{item.realname}}</span>
            </span>
          </div>
          <div v-else class="org-student-class-empty">
            暂无老师
          </div>
        </div>

        <div class="org-student-sidebar-bottom" v-if="isClassDetailPage">
          <div class="org-student-operation">
            <span>我的同学</span>
          </div>
          <div v-if="hasClassmate" class="org-student-menu">
            <span class="org-student-menu-item" v-for="item in myClassmate" :key="item.id" :title="item.realname">
              <i class="iconfont icon-tongxue org-student-menu-item-icon"></i>
              <span @click="toUserPage(item.users.username)" class="org-student-menu-item-username">{{item.realname}}</span>
            </span>
          </div>
          <div v-else class="org-student-class-empty">
            暂无同学
          </div>
        </div>
      </div>
      <template v-if="!isLoading">
        <router-view class="org-student-main"></router-view>
      </template>
    </div>
    <el-dialog class="org-student-join-class-dialog" width="500px" :visible.sync="isShowJoinClassDialog">
      <join-class v-if="isShowJoinClassDialog" @cancel="onHideJoinClassDialog"></join-class>
    </el-dialog>
    <edit-student-dialog :isDialogVisible="isEditStudentVisible" @close="closeEditStudentDialog" />
  </div>
</template>
<script>
import OrgHeader from '@/components/org/common/OrgHeader'
import UserPortrait from '@/components/common/UserPortrait'
import JoinOrg from './JoinOrg'
import JoinClass from './JoinClass'
import { mapActions, mapGetters } from 'vuex'
import { keepwork, lesson } from '@/api'
const { graphql } = keepwork
import _ from 'lodash'
import colI18n from '@/lib/utils/i18n/column'
import { locale } from '@/lib/utils/i18n'
import EditStudentDialog from './EditStudentDialog'
import moment from 'moment'

export default {
  name: 'OrgStudent',
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      selectedClassId: '',
      beInClassDialog: false,
      joinKey: '',
      isLoading: true,
      isShowJoinClassDialog: false,
      isEditStudentVisible: false,
    }
  },
  computed: {
    ...mapGetters({
      userinfo: 'org/userinfo',
      orgIsAdmin: 'org/isAdmin',
      orgIsTeacher: 'org/isTeacher',
      orgClasses: 'org/student/orgClasses',
      studentUserinfo: 'org/student/userinfo',
      OrgIsStudent: 'org/isStudent',
      isCurrentOrgToken: 'org/isCurrentOrgToken',
      myClassmate: 'org/student/myClassmate',
      myTeacher: 'org/student/myTeacher',
    }),
    studentEndTime() {
      return moment(this.studentUserinfo.endTime).format('YYYY/MM/DD')
    },
    isClassDetailPage() {
      return (
        this.OrgIsStudent &&
        [
          'OrgStudentClassDetail',
          'OrgStudentClassLastUpdate',
          'OrgStudentEvaluations',
          'OrgStudentEvaluationDetail',
        ].includes(this.nowPageName)
      )
    },
    isShowEditUserInfo() {
      return !['JoinOrg'].includes(this.nowPageName)
    },
    isShowRenewPane() {
      return !['JoinOrg'].includes(this.nowPageName)
    },
    currentClassName() {
      return _.get(_.find(this.orgClasses, item => item.id === this.currentClassID), 'name', '')
    },
    isJustStudent() {
      return !this.orgIsAdmin && !this.orgIsTeacher
    },
    hasOrgClasses() {
      return this.isCurrentOrgToken && _.get(this.orgClasses, 'length', 0) > 0
    },
    hasClassmate() {
      return this.myClassmate.length > 0
    },
    hasTeacher() {
      return this.myTeacher.length > 0
    },
    isEn() {
      return locale === 'en-US' ? true : false
    },
    username() {
      return _.get(this.userinfo, 'username', '')
    },
    realname() {
      return _.get(this.studentUserinfo, 'realname', '')
    },
    userId() {
      return _.get(this.userinfo, 'id', '')
    },
    nowPageName() {
      return _.get(this.$route, 'name')
    },
    isShowSidebar() {
      return [
        'JoinOrg',
        'OrgStudent',
        'OrgStudentClass',
        'OrgStudentClassSelect',
        'OrgStudentClassDetail',
        'OrgStudentClassLastUpdate',
        'OrgStudentEvaluations',
        'OrgStudentEvaluationDetail',
      ].includes(this.nowPageName)
    },
    userPortrait() {
      return _.get(this.userinfo, 'portrait') || this.defaultPortrait
    },
    organizationId() {
      return _.get(this.userinfo, 'organizationId', '')
    },
    routeName() {
      return _.get(this.$route, 'name')
    },
    isOrgStudentClassRoute() {
      return ['OrgStudent'].includes(this.routeName)
    },
    isNeedRedirect() {
      return this.isOrgStudentClassRoute
    },
    isOnlyOneClass() {
      return this.orgClasses.length === 1
    },
    isMultiClasses() {
      return this.orgClasses.length > 1
    },
    currentClassID() {
      return _.toNumber(_.get(this.$route, 'params.classId'))
    },
    firstClassID() {
      return _.get(this.orgClasses, '[0].id')
    },
  },
  async created() {
    try {
      if (!this.OrgIsStudent) {
        this.$router.push({
          name: 'JoinOrg',
        })
        return
      }
      if (!this.isNeedRedirect) {
        return
      }
      if (this.isOnlyOneClass) {
        this.$router.push({
          name: 'OrgStudentClassDetail',
          params: { classId: this.firstClassID },
        })
      } else {
        this.$router.push({
          name: 'OrgStudentClassSelect',
        })
      }
      if (this.isClassDetailPage) {
        this.getTeacherAndClassmate(this.currentClassID)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    ...mapActions({
      getTeacherAndClassmate: 'org/student/getTeacherAndClassmate',
      enterClassroom: 'org/student/enterClassroom',
      getUserInfo: 'org/student/getUserInfo',
    }),
    showEditStudentDialog() {
      this.isEditStudentVisible = true
    },
    closeEditStudentDialog() {
      this.isEditStudentVisible = false
    },
    toEvaluationsPage() {
      this.$router.push({
        name: 'OrgStudentEvaluations',
        params: {
          classId: this.currentClassID,
        },
      })
    },
    toUserPage(username) {
      window.open(`${window.location.origin}/u/${username}`)
    },
    toRolePage(pageName) {
      this.$router.push({
        name: pageName,
      })
    },
    onDropdown(classId) {
      this.$router.push({
        name: 'OrgStudentClassDetail',
        params: {
          classId,
        },
      })
    },
    async enterNewClass() {
      const classInfo = await this.enterClassroom({ key: this.joinKey })
      const { packageId, lessonId } = classInfo
      if (packageId && lessonId) {
        this.$router.push({
          name: 'OrgStudentPackageLesson',
          params: { packageId, lessonId },
        })
      }
      this.beInClassDialog = false
    },
    onHideJoinClassDialog() {
      this.isShowJoinClassDialog = false
    },
  },
  components: {
    OrgHeader,
    JoinOrg,
    JoinClass,
    UserPortrait,
    EditStudentDialog,
  },
}
</script>
<style lang="scss">
$borderColor: #e8e8e8;
.org-student {
  width: 100%;
  height: 100%;
  &-tips {
    max-width: 1200px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    box-sizing: border-box;
    margin: 20px auto 0;
    background-color: rgba($color: #e6a23c, $alpha: 0.2);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    &-icon {
      height: 41px;
      width: 41px;
      object-fit: cover;
      background: url('../../../assets/org/teacher.png');
    }
    &-text {
      color: #333;
      font-size: 14px;
      margin-left: 10px;
    }
    &-button {
      display: inline-block;
      width: 102px;
      height: 32px;
      line-height: 32px;
      margin-left: 20px;
      background-color: #f4b744;
      color: #fff;
      box-shadow: inset 0px -3px 0px 0px rgba(151, 21, 0, 0.28);
      border-radius: 4px;
      cursor: pointer;
    }
  }
  &-container {
    max-width: 1200px;
    margin: 0 auto 30px;
    display: flex;
    padding-top: 24px;
  }
  &-sidebar {
    width: 270px;
    border-radius: 4px;
    margin-right: 24px;
    &-top {
      border-radius: 8px;
      background: #fff;
    }

    &-bottom {
      margin-top: 20px;
      background: #fff;
      border-radius: 8px;
    }
    &-evaluations {
      height: 82px;
      line-height: 82px;
      text-align: center;
      cursor: pointer;
      font-weight: bold;
      .iconfont {
        font-size: 44px;
        vertical-align: middle;
        margin-right: 16px;
        color: #108ee9;
        font-weight: normal;
      }
    }
  }
  &-main {
    flex: 1;
  }
  &-message {
    padding: 32px 16px 16px;
    position: relative;
    text-align: center;
    margin-bottom: 20px;
    &.fix-bottom {
      padding-bottom: 10px;
    }
  }
  &-renew {
    background: #fff;
    margin-bottom: 20px;
    border-radius: 4px;
    text-align: center;
    font-size: 14px;
    color: #2397f3;
    &-expire {
      border-bottom: 1px solid #e8e8e8;
      height: 60px;
      line-height: 60px;
      color: #8c8c8c;
      font-size: 12px;
    }
    &-button {
      height: 46px;
      line-height: 46px;
      cursor: pointer;
    }
  }
  &-class-select {
    display: flex;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    height: 68px;
    background: #fff;
    &-icon {
      font-size: 26px;
      color: #606266;
    }
    &-dropdown-item {
      cursor: pointer;
      font-size: 14px;
      color: #2397f3;
    }
    &-onlyone {
      margin-top: 10px;
      font-size: 14px;
      &-icon {
        font-size: 26px;
      }
      &-class-name {
        color: #2397f3;
      }
    }
  }

  &-role-label {
    position: absolute;
    left: 8px;
    top: 10px;
    font-size: 12px;
    padding: 0 5px;
    height: 20px;
    line-height: 20px;
    border-radius: 4px;
    color: #409efe;
    border: 1px solid;
    border-radius: 4px;
    cursor: pointer;
    &-active {
      color: #409efe;
    }
  }
  &-profile {
    width: 96px;
    height: 96px;
    object-fit: cover;
    line-height: 1;
    margin-bottom: 16px;
    border-radius: 50%;
  }
  &-username {
    font-size: 20px;
    color: #333;
  }
  &-edit-btn {
    color: #666;
    font-size: 14px;
    width: 198px;
    border: 1px solid #d8d8d8;
    margin: 16px auto 0;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    cursor: pointer;
  }

  &-operation {
    height: 52px;
    border-bottom: 1px solid $borderColor;
    display: flex;
    align-items: center;
    padding: 0 20px;
    .iconfont {
      margin-right: 6px;
    }
    &-add {
      color: #409efe;
      cursor: pointer;
    }
  }
  &-menu {
    padding-bottom: 10px;
    padding: 10px;
    box-sizing: border-box;
    &-item {
      height: 32px;
      font-size: 16px;
      width: 100%;
      line-height: 32px;
      padding: 0 10px;
      box-sizing: border-box;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      color: #030313;
      font-size: 14px;
      &-icon {
        margin-right: 6px;
      }
      &-username {
        cursor: pointer;
      }
    }
  }
  &-class-empty {
    text-align: center;
    height: 90px;
    line-height: 60px;
    font-size: 14px;
    color: #999;
  }
}
</style>
