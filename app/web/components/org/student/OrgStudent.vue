<template>
  <div class="org-student">
    <div class="org-student-tips" v-if="isBeInClassroom">
      <span class="org-student-tips-icon"></span>
      <span class="org-student-tips-text">正在上课: {{currentClassroomLessonName}}</span>
      <span @click="handleEnterCurrentClassroom" class="org-student-tips-button">进入课堂</span>
    </div>
    <div class="org-student-container" >
      <div class="org-student-sidebar" v-if="isShowSidebar">
        <div class="org-student-message">
          <div class="org-student-role-label">学生</div>
          <img :src="userPortrait" class="org-student-profile" />
          <div class="org-student-username">{{username}}</div>
        </div>
        <div class="org-student-menu">
          <span class="org-student-menu-item" v-for="item in orgClasses" :key="item.id">
            <i class="iconfont icon-member"></i> {{item.name}}
          </span>
        </div>
      </div>
      <router-view class="org-student-main"></router-view>
    </div>
  </div>
</template>
<script>
import OrgHeader from '@/components/org/common/OrgHeader'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgStudent',
  data() {
    return {
      isLoading: true,
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      className: '',
      selectedClassId: ''
    }
  },
  async created() {
    await Promise.all([
      this.getOrgClasses(),
      this.resumeClassroom()
    ])
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/student/getOrgClasses',
      resumeClassroom: 'org/student/resumeClassroom'
    }),
    handleEnterCurrentClassroom() {
      const { packageId, lessonId } = this.classroom
      this.$router.push({ name: 'OrgStudentLessonContent', params: { packageId, lessonId }})
    }
  },
  computed: {
    ...mapGetters({
      userinfo: 'org/userinfo',
      orgClasses: 'org/student/orgClasses',
      classroom: 'org/student/classroom',
      isBeInClassroom: 'org/student/isBeInClassroom'
    }),
    currentClassroomLessonName() {
      return _.get(this.classroom, 'extra.lessonName', '')
    },
    username() {
      return _.get(this.userinfo, 'username', '')
    },
    nowPageName() {
      return _.get(this.$route, 'name')
    },
    isShowSidebar() {
      return ['OrgStudentClass'].includes(this.nowPageName)
    },
    userPortrait() {
      return _.get(this.userinfo, 'portrait') || this.defaultPortrait
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
      margin-left: 40px;
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
    padding: 32px 16px 48px;
    // border-bottom: 1px solid $borderColor;
    position: relative;
    text-align: center;
  }
  &-role-label {
    position: absolute;
    left: 8px;
    top: 10px;
    color: #2397f3;
    border: 1px solid;
    font-size: 12px;
    padding: 0 10px;
    height: 20px;
    line-height: 20px;
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
  &-menu {
    margin: 0;
    padding-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    box-sizing: border-box;
    &-item {
      text-align: center;
      margin-top: 10px;
      margin-left: 8px;
      width: 112px;
      height: 32px;
      line-height: 32px;
      padding: 0 7px;
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
}
</style>
