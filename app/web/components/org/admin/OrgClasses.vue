<template>
  <div class="org-classes">
    <div class="org-classes-header">
      <div class="org-classes-menu">
        <div class="org-classes-menu-item" :class="{'org-classes-menu-item-active': currentPageName === menu.pageName}" v-for="(menu, index) in menuData" :key="index">
          <router-link class="org-classes-menu-link" :to='{name: menu.pageName}'>{{menu.text}}</router-link>
        </div>
      </div>
      <div class="org-classes-available">可添加用户数：<span class="org-classes-available-warning">50人</span></div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'OrgClasses',
  data() {
    return {
      menuData: [
        {
          pageName: 'OrgClassList',
          text: '班级'
        },
        {
          pageName: 'OrgTeacherList',
          text: '教师'
        },
        {
          pageName: 'OrgStudentList',
          text: '学生'
        }
      ]
    }
  },
  computed: {
    currentPageName() {
      return _.get(this.$route, 'name')
    }
  }
}
</script>
<style lang="scss" scoped>
.org-classes {
  background-color: #fff;
  &-header {
    display: flex;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-menu {
    flex: 1;
    padding: 0 16px;
    &-item {
      display: inline-block;
      font-size: 16px;
      color: #999;
      border-color: transparent;
      margin-right: 16px;
      &-active {
        color: #2397f2;
        border-color: #2397f3;
      }
    }
    &-link {
      color: inherit;
      text-decoration: none;
      padding: 8px;
      border-bottom: 3px solid;
      border-color: inherit;
    }
  }
  &-available {
    padding: 0 24px;
    font-size: 12px;
    color: #333;
    &-warning {
      color: #f4b744;
    }
  }
}
</style>

