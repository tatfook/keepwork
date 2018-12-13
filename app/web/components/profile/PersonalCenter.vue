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
  </div>
</template>
<script>
export default {
  name: "PersonalCenter",
  data(){
    return{
      tabTitles: [
        {title: '个人资料'},
        {title: '密码修改'},
        {title: '第三方账号绑定'},
        {title: '实名认证'},
      ],
      currTabIndex: 0,
    }
  },
  methods:{
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


