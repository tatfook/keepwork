<template>
  <div class="org-teacher">
    <div class="org-teacher-tips" v-if="isBeInClassroom">
      <span class="org-teacher-tips-icon"></span>
      <span class="org-teacher-tips-text">正在上课: {{currentClassroomLessonName}}</span>
      <span @click="handleEnterCurrentClassroom" class="org-teacher-tips-button">进入课堂</span>
    </div>
    <div class="org-teacher-container">
      <div class="org-teacher-sidebar">
        <div class="org-teacher-message">
          <div class="org-teacher-role-label">教师</div>
          <img :src="defaultPortrait" class="org-teacher-profile" />
          <div class="org-teacher-username">chiyu</div>
        </div>
        <ul class="org-teacher-menu">
          <li class="org-teacher-menu-item" v-for="(menuItem, index) in teacherMenu" :class="{'org-teacher-menu-item-active': menuItem.pageName === nowPageName}" :key="index">
            <router-link class="org-teacher-menu-link" :to="{name: menuItem.pageName}">{{menuItem.text}}</router-link>
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
          text: '上课'
        },
        {
          pageName: 'OrgTeacherStatistics',
          text: '数据统计'
        },
        {
          pageName: 'OrgTeacherClass',
          text: '我的班级'
        }
      ]
    }
  },
  methods: {
    async handleEnterCurrentClassroom() {
      const { classId, packageId, lessonId } = this.classroom
      this.$router.push({
        name: 'OrgTeacherClassPackageLesson',
        params: {
          classId,
          packageId,
          lessonId
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      classroom: 'org/teacher/classroom',
      isBeInClassroom: 'org/teacher/isBeInClassroom'
    }),
    nowPageName() {
      return _.get(this.$route, 'name')
    },
    currentClassroomLessonName() {
      return _.get(this.classroom, 'extra.lessonName', '')
    }
  }
}
</script>
<style lang="scss" scoped>
$borderColor: #e8e8e8;
.org-teacher {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
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
    border-bottom: 1px solid $borderColor;
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
}
</style>
