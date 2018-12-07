<template>
  <div class="profile-detail-page" v-loading='isLoading'>
    <user-basic-msg v-if="isFinishFirstInit && isUserExist" class="hidden-sm-and-up" :isLoginUserEditable='isLoginUserEditable' :nowUserDetail='nowUserDetail'></user-basic-msg>
    <profile-header v-if="isFinishFirstInit && isUserExist" :nowUsername='nowUsername'></profile-header>
    <router-view v-if="isFinishFirstInit && isUserExist" :nowUserDetail='nowUserDetail'></router-view>
    <div class="profile-detail-page-notfound" v-if="!isUserExist">
      <img src="@/assets/img/404.png" alt="">
      <h1>{{$t("profile.usernameDoNotExist")}}</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ProfileHeader from './common/ProfileHeader'
import UserBasicMsg from './common/UserBasicMsg'
export default {
  name: 'ProfileDetailPage',
  async mounted() {
    await this.init()
    this.isFinishFirstInit = true
  },
  data() {
    return {
      isUserExist: true,
      isLoading: false,
      isFinishFirstInit: false
    }
  },
  computed: {
    ...mapGetters({
      loginUserId: 'user/userId',
      userGetDetailWithRankByUsername: 'user/getDetailWithRankByUsername'
    }),
    nowUsername() {
      return this.$route.params.username
    },
    nowUserDetail() {
      return this.userGetDetailWithRankByUsername({ username: this.nowUsername })
    },
    nowUserId() {
      return _.get(this.nowUserDetail, 'id')
    },
    nowProfileUserId() {
      return _.get(this.nowUserDetail, 'id')
    },
    isLoginUserEditable() {
      return this.loginUserId === this.nowProfileUserId
    }
  },
  methods: {
    ...mapActions({
      getUserDetailWithRankByUserIdOrUsername: 'user/getUserDetailWithRankByUserIdOrUsername'
    }),
    async init() {
      this.isLoading = true
      if (/^[0-9]*$/.test(this.nowUsername)) {
        this.isUserExist = false
        this.isLoading = false
        return
      }
      await this.getUserDetailWithRankByUserIdOrUsername({ username: this.nowUsername }).catch(err => {
        this.isUserExist = false
      })
      this.isLoading = false
    }
  },
  watch: {
    route() {
      this.init()
    }
  },
  components: {
    UserBasicMsg,
    ProfileHeader
  }
}
</script>
<style lang="scss">
.profile-detail-page {
  background-color: #f5f5f5;
  &-notfound {
    text-align: center;
    padding-top: 40px;
    h1 {
      font-weight: normal;
      font-size: 24px;
      color: #303133;
      margin-top: 24px;
    }
  }
}
</style>
