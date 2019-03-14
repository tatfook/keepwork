<template>
  <div class="org-admin">
    <org-header></org-header>
    <div class="org-admin-container">
      <div class="org-admin-sidebar">
        <div class="org-admin-message">
          <div class="org-admin-role-label">{{$t('org.admin')}}</div>
          <img :src="defaultPortrait" class="org-admin-profile" />
          <div class="org-admin-username">chiyu</div>
        </div>
        <ul class="org-admin-menu">
          <li class="org-admin-menu-item" v-for="(menuItem, index) in adminMenu" :class="{'org-admin-menu-item-active': menuItem.pageName === nowPageName}" :key="index">
            <router-link class="org-admin-menu-link" :to="{name: menuItem.pageName}">{{menuItem.text}}</router-link>
          </li>
        </ul>
      </div>
      <router-view class="org-admin-main"></router-view>
    </div>
  </div>
</template>
<script>
import OrgHeader from './common/OrgHeader'
export default {
  name: 'OrgAdmin',
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      adminMenu: [
        {
          pageName: 'OrgPackages',
          text: this.$t('org.lessonPackage')
        },
        {
          pageName: 'OrgClasses',
          text: this.$t('org.classInfoManage')
        },
        {
          pageName: 'OrgSetting',
          text: this.$t('org.settings')
        }
      ]
    }
  },
  computed: {
    nowPageName() {
      return _.get(this.$route, 'name')
    }
  },
  components: {
    OrgHeader
  }
}
</script>
<style lang="scss" scoped>
$borderColor: #e8e8e8;
.org-admin {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  &-container {
    max-width: 1200px;
    margin: 0 auto;
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
  }
  &-message {
    padding: 32px 16px 48px;
    position: relative;
    text-align: center;
    background-color: #fff;
    border: 1px solid $borderColor;
    border-radius: 4px 4px 0 0;
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
    background-color: #fff;
    border: 1px solid $borderColor;
    border-width: 0 1px 1px;
    border-radius: 0 0 4px 4px;
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
