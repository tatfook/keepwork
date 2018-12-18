<template>
  <div class="personal-center-page">
    <div class="personal-center">
      <div class="personal-center-sidebar">
        <div v-for="(tab,index) in tabTitles" :key="index" class="personal-center-sidebar-tab" @click="switchTab(index)"><span :class="[{'selected': currTabIndex == index}]">{{tab.title}}</span></div>
      </div>
      <div class="personal-center-main">
        <router-view />
      </div>
    </div>
    <div @click.stop v-if="showLoginDialog">
      <login-dialog :show="showLoginDialog" :forceLogin="true" @close="handleLoginDialogClose" />
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'

export default {
  name: "PersonalCenter",
  data(){
    return{
      tabTitles: [
        {title: this.$t('common.userData')},
        {title: this.$t('profile.changePassword')},
        {title: this.$t('common.thirdBanding')},
        {title: this.$t('common.realNameAuthentication')},
      ],
      currTabIndex: 0,
    }
  },
  watch: {
    $route(value) {
      this.getTabIndex(value)
    }
  },
  mounted(){
    this.getTabIndex(this.$route)
  },
  computed: {
    ...mapGetters({
      userIsLogined: 'user/isLogined',
    }),
    showLoginDialog() {
      return !this.userIsLogined
    }
  },
  methods:{
    handleLoginDialogClose() {
      location.reload()
    },
    getTabIndex(value){
      switch(value.name){
        case 'UserData':
        this.currTabIndex =0
        break
        case 'ChangePassword':
        this.currTabIndex =1
        break
        case 'ThirdPartyAccountBinding':
        this.currTabIndex =2
        break
        case 'RealNameAuthentication':
        this.currTabIndex =3
        break
        default:
        break
      }
    },
    switchTab(index){
      this.currTabIndex = index
      switch(this.currTabIndex) {
        case 0:
        this.$router.push('userData')
        break
        case 1:
        this.$router.push('changePassword')
        break
        case 2:
        this.$router.push('thirdPartyAccountBinding')
        break
        case 3:
        this.$router.push('realNameAuthentication')
        break
      }
    }
  },
  components: {
    LoginDialog
  }
}
</script>
<style lang="scss">
.personal-center-page {
  background: #f5f5f5;
  .personal-center {
    max-width: 1200px;
    display: flex;
    margin: 24px auto;
    &-sidebar {
      width: 300px;
      padding-right: 30px;
      &-tab {
        height: 48px;
        background-color: #ffffff;
        border-radius: 0px 0px 4px 4px;
        border: solid 1px #e8e8e8;
        margin-top: -1px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #999;
        cursor: pointer;
        &:hover{
          background: rgba(35,151,243, .05);
        }
        span{
          padding-left: 16px;
          border-left: 2px solid transparent;
          &.selected{
            border-left-color: #2397f3;
            color: #2397f3;
          }
        }
      }
    }
    &-main {
      flex: 1;
    }
  }
}
</style>


