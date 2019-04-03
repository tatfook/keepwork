<template>
  <div class="org-student">
    <div class="org-student-tips" v-for="item in teachingLesson" :key="item.id">
      <span class="org-student-tips-icon"></span>
      <span class="org-student-tips-text">{{$t('org.classBegins') + item.lessonName}},{{$t('lesson.curentClassId')}}: C{{item.key}}</span>
      <span @click="handleJoinClassroom(item)" class="org-student-tips-button">{{$t("org.enterClass")}}</span>
    </div>
    <div class="org-student-container">
      <div class="org-student-sidebar" v-if="isShowSidebar">
        <div class="org-student-message">
          <div class="org-student-role-label">{{$t("org.studentRole")}}</div>
          <img :src="userPortrait" class="org-student-profile" />
          <div class="org-student-username">{{username}}</div>
        </div>
        <div class="org-student-skill">
          <p>{{skillpointsCount}} {{$t('lesson.skillPoints')}}<span class="org-student-skill-detail" @click="isSkillDetailShow = true">{{$t('lesson.packageManage.detailLabel')}}<i class="el-icon-back"></i></span></p>
        </div>
        <div class="org-student-menu">
          <span class="org-student-menu-item" v-for="item in orgClasses" :key="item.id">
            <i class="iconfont icon-team"></i> {{item.name}}
          </span>
        </div>
      </div>
      <router-view class="org-student-main"></router-view>
    </div>
    <el-dialog title="" center :visible.sync="beInClassDialog" width="30%">
      <div class="hint">
        <i class="el-icon-warning redIcon"></i>{{$t('lesson.beInClass')}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backCurrentClass">{{$t('lesson.resumeOldClass')}}</el-button>
        <el-button type="primary" @click="enterNewClass">{{$t('lesson.enterNewClass')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog class="org-student-skill-dialog" :class="{'org-student-skill-dialog-en': isEn}" :title="$t('lesson.skillPointDetails')" :visible.sync="isSkillDetailShow">
      <div class="org-student-skill-dialog-info">{{skillpointsCount}} {{$t('lesson.skillPoints')}}:</div>
      <ul class="org-student-skill-dialog-skills">
        <li class="org-student-skill-dialog-skills-item" v-for="(skill,index) in skillsList" :key="index">
          {{skillName(skill)}}：<span class="org-student-skill-dialog-skills-count">{{skill.score}}</span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>
<script>
import OrgHeader from '@/components/org/common/OrgHeader'
import { mapActions, mapGetters } from 'vuex'
import { keepwork, lesson } from '@/api'
const { graphql } = keepwork
import _ from 'lodash'
import colI18n from '@/lib/utils/i18n/column'
import { locale } from '@/lib/utils/i18n'

export default {
  name: 'OrgStudent',
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      selectedClassId: '',
      beInClassDialog: false,
      joinKey: '',
      skillsList: [],
      isSkillDetailShow: false
    }
  },
  computed: {
    ...mapGetters({
      userinfo: 'org/userinfo',
      orgClasses: 'org/student/orgClasses',
      classroom: 'org/student/classroom',
      teachingLesson: 'org/student/teachingLesson'
    }),
    isEn() {
      return locale === 'en-US' ? true : false
    },
    currentClassroomLessonName() {
      return _.get(this.classroom, 'extra.lessonName', '')
    },
    classroomKey() {
      return _.get(this.classroom, 'key', '')
    },
    skillpointsCount() {
      let sum = 0
      if (this.skillsList.length === 0) {
        sum = 0
      } else {
        this.skillsList.every(skill => (sum += skill.score * 1))
      }
      return sum
    },
    username() {
      return _.get(this.userinfo, 'username', '')
    },
    userId() {
      return _.get(this.userinfo, 'id', '')
    },
    nowPageName() {
      return _.get(this.$route, 'name')
    },
    isShowSidebar() {
      return ['OrgStudentClass'].includes(this.nowPageName)
    },
    userPortrait() {
      return _.get(this.userinfo, 'portrait') || this.defaultPortrait
    },
    organizationId() {
      return _.get(this.userinfo, 'organizationId', '')
    }
  },
  async created() {
    await Promise.all([
      this.getOrgClasses(),
      this.getTeachingLesson(),
      this.getUserInfo(),
      this.getSkills()
    ])
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/student/getOrgClasses',
      getTeachingLesson: 'org/student/getTeachingLesson',
      enterClassroom: 'org/student/enterClassroom',
      getUserInfo: 'org/student/getUserInfo'
    }),
    getSkills() {
      lesson.users
        .userSkills({ userId: this.userId })
        .then(res => {
          this.skillsList = res
        })
        .catch(() => {})
    },
    skillName(skill) {
      return colI18n.getLangValue(skill, 'skillName')
    },
    async handleJoinClassroom({ key, packageId, lessonId }) {
      try {
        if (this.classroomKey && key !== this.classroomKey) {
          this.beInClassDialog = true
          this.joinKey = key
        } else if (this.classroomKey && key == this.classroomKey) {
          if (packageId && lessonId) {
            this.$router.push({
              name: 'OrgStudentPackageLesson',
              params: { packageId, lessonId }
            })
          }
        } else {
          const classInfo = await this.enterClassroom({ key })
          const { packageId, lessonId } = classInfo
          if (packageId && lessonId) {
            this.$router.push({
              name: 'OrgStudentPackageLesson',
              params: { packageId, lessonId }
            })
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    backCurrentClass() {
      const { packageId, lessonId } = this.classroom
      this.$router.push({
        name: 'OrgStudentPackageLesson',
        params: { packageId, lessonId }
      })
    },
    async enterNewClass() {
      const classInfo = await this.enterClassroom({ key: this.joinKey })
      const { packageId, lessonId } = classInfo
      if (packageId && lessonId) {
        this.$router.push({
          name: 'OrgStudentPackageLesson',
          params: { packageId, lessonId }
        })
      }
      this.beInClassDialog = false
    }
  },
  components: {
    OrgHeader
  }
}
</script>
<style lang="scss" scoped>
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
    margin: 0 auto;
    display: flex;
    padding-top: 24px;
  }
  &-sidebar {
    width: 270px;
    border: 1px solid $borderColor;
    border-radius: 4px;
    margin-right: 24px;
    background-color: #fff;
  }
  &-main {
    flex: 1;
  }
  &-message {
    padding: 32px 16px 0;
    // border-bottom: 1px solid $borderColor;
    position: relative;
    text-align: center;
  }
  &-skill {
    text-align: center;
    font-size: 14px;
    &-detail {
      color: #409eff;
      cursor: pointer;
      padding-left: 6px;
      .el-icon-back {
        transform: rotate(180deg);
        margin-left: 3px;
      }
    }
  }
  &-role-label {
    position: absolute;
    left: 8px;
    top: 10px;
    font-size: 12px;
    padding: 0 10px;
    height: 20px;
    line-height: 20px;
    border-radius: 4px;
    color: #a65f2c;
    background-color: #ffd21f;
    box-shadow: inset 0px -1px 3px 0px rgba(113, 20, 46, 0.28);
    border-radius: 4px;
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
  &-skills {
    font-size: 14px;
    color: #606266;
    cursor: pointer;
  }
  &-menu {
    margin: 0;
    padding-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    box-sizing: border-box;
    &-item {
      margin-top: 10px;
      margin-left: 8px;
      width: 112px;
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      box-sizing: border-box;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      border-radius: 16px;
      border: solid 1px #dddddd;
      color: #030313;
      font-size: 14px;
    }
  }
  &-skill-dialog {
    /deep/ .el-dialog {
      width: 396px;
      max-width: 100%;
    }
    /deep/ .el-dialog__header {
      padding: 0;
      text-align: center;
      height: 40px;
      line-height: 40px;
      background-color: #309efe;
    }
    /deep/ .el-dialog__title {
      color: #fff;
      font-size: 16px;
    }
    /deep/ .el-dialog__headerbtn {
      top: 14px;
      right: 16px;
    }
    /deep/ .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
      font-weight: bold;
    }
    /deep/ .el-dialog__body {
      padding: 24px 42px 36px 42px;
    }
    &-skills {
      &-count {
        color: #303133;
      }
    }
    &-info {
      font-size: 14px;
      color: #777;
      margin-bottom: 16px;
    }
    ul {
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    li {
      list-style: none;
      width: 145px;
      border-bottom: 1px solid #ececec;
      font-size: 14px;
      color: #818181;
      height: 32px;
      line-height: 32px;
      &:nth-child(1),
      &:nth-child(2) {
        border-top: 1px solid #ececec;
      }
    }
    &-en {
      .el-dialog {
        width: 566px;
      }
      li {
        width: 230px;
      }
    }
  }
}
</style>
