<template>
  <div class="org-admin">
    <org-header></org-header>
    <div class="org-admin-container" v-if="isSidebarShow">
      <div class="org-admin-sidebar">
        <div class="org-admin-message">
          <el-dropdown class="org-admin-role-label" @command="toRolePage" trigger="click" placement="bottom">
            <span class="el-dropdown-link">
              {{$t("org.admin")}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="org-admin-role-label-active">{{$t("org.admin")}}</el-dropdown-item>
              <el-dropdown-item v-if="orgIsTeacher" command="OrgTeacher">{{$t("org.teacherRole")}}</el-dropdown-item>
              <el-dropdown-item command="OrgStudent">{{$t("org.studentRole")}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <user-portrait :user="orgUserinfo" class="org-admin-profile" size="large"></user-portrait>
          <div class="org-admin-username">{{orgUserinfo.username}}</div>
          <div class="org-validity-date">{{$t('org.validity')}}: {{startDate}}-{{endDate}} <span v-if="currentOrgToExpire" class="expire-tips">{{$t('org.toExpire')}}</span> <span v-if="currentOrgHaveExpired" class="expire-tips">{{$t('org.haveExpired')}}</span></div>
        </div>
        <ul class="org-admin-menu">
          <li class="org-admin-menu-item" v-for="(menuItem, index) in adminMenu" :class="{'org-admin-menu-item-active': isMenuItemActive(menuItem)}" :key="index">
            <router-link class="org-admin-menu-link" :to="{name: menuItem.indexPageName}">{{menuItem.text}}</router-link>
          </li>
        </ul>
        <div class="org-admin-help">
          <a class="org-admin-help-link" href="https://keepwork.com/official/docs/teach/index" target="_blank">
            {{$t('org.Help')}}<span class="org-admin-help-icon">?</span>
          </a>
        </div>
      </div>
      <router-view class="org-admin-main"></router-view>
    </div>
    <router-view v-if="!isSidebarShow"></router-view>
  </div>
</template>
<script>
import OrgHeader from './common/OrgHeader'
import UserPortrait from '@/components/common/UserPortrait'
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'OrgAdmin',
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      adminMenu: [
        {
          pageNames: ['OrgPackages'],
          indexPageName: 'OrgPackages',
          text: this.$t('org.lessonPackage')
        },
        {
          pageNames: [
            'OrgClassMembers',
            'OrgClassList',
            'OrgNewClass',
            'OrgEditClass',
            'OrgClassDetail',
            'OrgTeacherList',
            'OrgNewTeacher',
            'OrgEditTeacher',
            'OrgStudentList',
            'OrgUseFormalCode',
            'OrgEditStudent'
          ],
          indexPageName: 'OrgClassList',
          text: this.$t('org.classInfoManage')
        },
        {
          pageNames: ['EvaluationReport', 'ClassEvaluation'],
          indexPageName: 'EvaluationReport',
          text: '评估报告'
        },
        {
          pageNames: ['MessageList', 'NewMessage'],
          indexPageName: 'MessageList',
          text: '校园OA'
        },
        {
          pageNames: [
            'InvitationCode',
            'NewInvitationCode',
            'PrintInvitationCode'
          ],
          indexPageName: 'InvitationCode',
          text: this.$t('org.studentInvitationCodeManagement')
        },
        {
          pageNames: [
            'HistoricalData',
            'HistoricalMember',
            'ReActivate',
            'OrgHistoryClassDetail',
          ],
          indexPageName: 'HistoricalData',
          text: this.$t('org.historicalData')
        },
        {
          pageNames: ['OrgForms', 'NewForm', 'EditForm', 'FormFeedback'],
          indexPageName: 'OrgForms',
          text: '表单管理'
        },
        {
          pageNames: ['OrgSetting'],
          indexPageName: 'OrgSetting',
          text: this.$t('org.settings')
        },
        {
          pageNames: ['OrgAdminLogs'],
          indexPageName: 'OrgAdminLogs',
          text: '机构日志'
        }
      ]
    }
  },
  mounted() {
    if (this.$route.query.firstLogin) {
      window.history.replaceState({}, '', '?firstLogin')
      this.checkCurrentOrgExpire()
    }
  },
  computed: {
    ...mapGetters({
      orgIsStudent: 'org/isStudent',
      orgIsTeacher: 'org/isTeacher',
      orgUserinfo: 'org/userinfo',
      currentOrg: 'org/currentOrg',
      currentOrgToExpire: 'org/currentOrgToExpire',
      currentOrgHaveExpired: 'org/currentOrgHaveExpired'
    }),
    nowPageName() {
      return _.get(this.$route, 'name')
    },
    isSidebarShow() {
      return ![
        'OrgAdminPackageDetail',
        'OrgAdminPackageLesson',
        'OrgAdminPackageLesson',
        'OrgAdminLessonPlan',
        'OrgAdminCourseware'
      ].includes(this.nowPageName)
    },
    startDate() {
      return moment(this.currentOrg.startDate).format('YYYY/M/D')
    },
    endDate() {
      return moment(this.currentOrg.endDate).format('YYYY/M/D')
    }
  },
  methods: {
    ...mapActions({
      checkCurrentOrgExpire: 'org/checkCurrentOrgExpire'
    }),
    toRolePage(pageName) {
      this.$router.push({
        name: pageName
      })
    },
    isMenuItemActive(menuItem) {
      return _.indexOf(menuItem.pageNames, this.nowPageName) !== -1
    }
  },
  components: {
    OrgHeader,
    UserPortrait
  }
}
</script>
<style lang="scss">
$borderColor: #e8e8e8;
.org-admin {
  width: 100%;
  background-color: #f5f5f5;
  .org-validity-date {
    color: #666;
    font-size: 12px;
    margin-top: 10px;
  }
  .expire-tips {
    color: #f56c6c;
  }
  &-container {
    max-width: 1200px;
    margin: 0 auto 30px;
    display: flex;
    padding-top: 24px;
  }
  &-sidebar {
    width: 270px;
    margin-right: 24px;
  }
  &-main {
    flex: 1;
    min-width: 0;
    margin-bottom: 24px;
  }
  &-message {
    padding: 32px 16px 20px;
    position: relative;
    text-align: center;
    background-color: #fff;
    border-bottom: 1px solid $borderColor;
    border-radius: 8px 8px 0 0;
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
  &-menu {
    margin: 0;
    padding: 0;
    list-style: none;
    padding: 24px 16px 8px;
    background-color: #fff;
    border-width: 0 1px;
    border-radius: 0;
    &-item {
      margin-bottom: 16px;
      text-align: center;
      color: #333;
      background-color: #f5f5f5;
      border: 1px solid $borderColor;
      border-radius: 4px;
      &-active {
        background-color: #2397f3;
        color: #fff;
      }
    }
    &-link {
      display: inline-block;
      text-decoration: none;
      color: inherit;
      height: 40px;
      line-height: 40px;
      width: 100%;
    }
  }
  &-help {
    background-color: #fff;
    border-width: 0 1px 1px;
    padding: 0 16px 16px;
    border-radius: 0 0 8px 8px;
    &-link {
      text-decoration: none;
      color: #2397f3;
      font-size: 14px;
    }
    &-icon {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
      border: 1px solid;
      display: inline-block;
      margin-left: 4px;
      font-size: 12px;
      font-weight: bold;
    }
  }
}
</style>
