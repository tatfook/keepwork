<template>
  <div class="profile-index">
    <div class="container">
      <div class="profile-index-sidebar hidden-sm-and-down">
        <user-basic-msg class="profile-index-sidebar-item" :nowUserDetail='nowUserDetail' :isLoginUserEditable='isLoginUserEditable'></user-basic-msg>
        <user-certificates :nowUserDetail='nowUserDetail' :isLoginUserEditable='isLoginUserEditable'></user-certificates>
      </div>
      <div class="profile-index-main">
        <user-statics class="profile-index-main-item" :nowUserDetail='nowUserDetail'></user-statics>
        <recent-project class="profile-index-main-item" :nowUserDetail='nowUserDetail' :isLoginUserEditable='isLoginUserEditable'></recent-project>
        <contribution-calendar class="profile-index-main-item hidden-sm-and-down" :nowUserDetail='nowUserDetail'></contribution-calendar>
        <user-certificates class="profile-index-main-item hidden-md-and-up" :nowUserDetail='nowUserDetail' :isLoginUserEditable='isLoginUserEditable'></user-certificates>
        <user-experiences class="profile-index-main-item" :nowUserDetail='nowUserDetail' :isLoginUserEditable='isLoginUserEditable'></user-experiences>
      </div>
    </div>
  </div>
</template>
<script>
import ContributionCalendar from '@/components/common/ContributionCalendar'
import UserStatics from './common/UserStatics'
import UserBasicMsg from './common/UserBasicMsg'
import RecentProject from './common/RecentProject'
import UserCertificates from './common/UserCertificates'
import UserExperiences from './common/UserExperiences'
import { mapGetters } from 'vuex'
export default {
  name: 'ProfileIndex',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      loginUserId: 'user/userId'
    }),
    nowProfileUserId() {
      return this.nowUserDetail.id
    },
    isLoginUserEditable() {
      return this.loginUserId === this.nowProfileUserId
    }
  },
  components: {
    UserStatics,
    UserBasicMsg,
    UserCertificates,
    RecentProject,
    ContributionCalendar,
    UserExperiences
  }
}
</script>
<style lang="scss">
.profile-index {
  padding-top: 24px;
  & > .container {
    display: flex;
  }
  &-sidebar {
    width: 272px;
    margin-right: 28px;
    &-item {
      margin-bottom: 24px;
      background-color: #fff;
    }
  }
  &-main {
    flex: 1;
    min-width: 0;
    &-item {
      margin-bottom: 24px;
    }
  }
}
</style>
<style lang="scss">
@media only screen and (max-width: 991px) {
  .profile-index {
    padding-top: 8px;
    &-main {
      &-item {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
