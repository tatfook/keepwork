<template>
  <div class="org-teacher">
    <div class="org-teacher-container">
      <div class="org-teacher-sidebar">
        <div class="org-teacher-message">
          <el-dropdown class="org-teacher-role-label" @command="toRolePage" trigger="click" placement="bottom">
            <span class="el-dropdown-link">
              {{$t("org.teacherRole")}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="orgIsAdmin" command="OrgPackages">{{$t("org.admin")}}</el-dropdown-item>
              <el-dropdown-item class="org-teacher-role-label-active">{{$t("org.teacherRole")}}</el-dropdown-item>
              <el-dropdown-item command="OrgStudent">{{$t("org.studentRole")}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <img :src="userPortrait" class="org-teacher-profile" />
          <div class="org-teacher-username">{{username}}</div>
        </div>
        <ul class="org-teacher-menu">
          <li class="org-teacher-menu-item" v-for="(menuItem, index) in teacherMenu" :class="{'org-teacher-menu-item-active': menuItem.match.includes(nowPageName), 'big-button': menuItem.size === 'big'}" :key="index">
            <router-link class="org-teacher-menu-link" :to="{name: menuItem.pageName}"><i class="iconfont icon-class" v-show="index == 0"></i>{{menuItem.text}}</router-link>
          </li>
        </ul>
      </div>
      <router-view class="org-teacher-main"></router-view>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'OrgTeacher',
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      teacherMenu: [
        {
          pageName: 'OrgTeacherTeach',
          text: this.$t('org.TeachLabel'),
          match: ['OrgTeacherTeach'],
          size: 'big'
        },
        {
          pageName: 'OrgTeacherClass',
          text: this.$t('org.MyClassLabel'),
          match: ['OrgTeacherClass', 'OrgTeacherLastUpdate']
        },
        {
          pageName: 'OrgTeacherReports',
          text: '评估报告',
          match: [
            'OrgTeacherReports',
            'OrgTeacherReportEvaluation',
            'OrgTeacherReportEmpty',
            'OrgTeacherReportComment',
          ]
        },
        {
          pageName: 'OrgTeacherLogs',
          text: '机构日志',
          match: ['OrgTeacherLogs']
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      orgIsAdmin: 'org/isAdmin',
      orgIsStudent: 'org/isStudent',
      classroom: 'org/teacher/classroom',
      isBeInClassroom: 'org/teacher/isBeInClassroom',
      userinfo: 'org/userinfo'
    }),
    nowPageName() {
      return _.get(this.$route, 'name')
    },
    userPortrait() {
      return this.userinfo.portrait || this.defaultPortrait
    },
    username() {
      return this.userinfo.username
    }
  },
  methods: {
    toRolePage(pageName) {
      this.$router.push({
        name: pageName
      })
    }
  }
}
</script>
<style lang="scss">
$borderColor: #e8e8e8;
.org-teacher {
  width: 100%;
  height: 100%;
  &-container {
    max-width: 1200px;
    margin: 0 auto 30px;
    display: flex;
    padding-top: 24px;
  }
  &-sidebar {
    width: 270px;
    overflow: hidden;
    margin-right: 24px;
    min-width: 0;
  }
  &-main {
    flex: 1;
  }
  &-message {
    padding: 32px 16px 48px;
    border-bottom: 1px solid $borderColor;
    position: relative;
    text-align: center;
    background-color: #fff;
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
    border-radius: 0 0 8px 8px;
    &-item {
      margin-bottom: 16px;
      text-align: center;
      color: #333;
      background-color: #f5f5f5;
      border: 1px solid $borderColor;
      border-radius: 4px;
      &.big-button {
        height: 56px;
        line-height: 56px;
        font-size: 20px;
        .icon-class {
          font-size: 32px;
          color: #333;
          opacity: 0.6;
        }
        .org-teacher-menu-link {
          height: inherit;
          line-height: inherit;
        }
      }
      &-active {
        background-color: #2397f3;
        color: #fff;
        .iconfont.icon-class {
          opacity: 1;
          color: #fff;
        }
      }
    }
    &-link {
      display: inline-flex;
      text-decoration: none;
      color: inherit;
      height: 40px;
      line-height: 40px;
      width: 100%;
      justify-content: center;
      .icon-class {
        font-size: 26px;
      }
    }
  }
}
</style>
