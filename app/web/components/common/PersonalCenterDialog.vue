<template>
  <el-dialog v-loading="loading" :append-to-body=true v-if='show' class="personal-center-dialog" :title="title" :visible.sync="show" :before-close="handleClose">
    <div class="personal-center-sidebar">
      <ul>
        <li @click='doActiveNavItem(index)' v-for="(navItem, index) in personalSettingNavs" :key="index">
          <span :class="{'active': index === activeSettingIndex}" class="sidebar-nav-item">{{navItem.text}}</span>
        </li>
      </ul>
    </div>
    <div class="personal-center-content">
      <component ref='personalCenterComponent' :is='activeSettingComp' @close='handleClose' :sitePath='sitePath'></component>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import UserData from './UserData'
import AccountSecurity from './AccountSecurity'
import RealNameAuthentication from './RealNameAuthentication'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PersonalCenterDialog',
  props: {
    show: Boolean,
    sitePath: String
  },
  data() {
    return {
      loading: false,
      title: this.$t('common.personalCenter'),
      personalSettingNavs: [
        {
          text: this.$t('common.userData'),
          comp: UserData
        },
        {
          text: this.$t('common.accountSecurity'),
          comp: AccountSecurity
        },
        {
          text: this.$t('common.realNameAuthentication'),
          comp: RealNameAuthentication
        }
      ],
      activeSettingIndex: 0
    }
  },
  computed: {
    ...mapGetters({
      loginUserProfile: 'user/profile'
    }),
    activeSettingComp() {
      return this.personalSettingNavs[this.activeSettingIndex].comp
    }
  },
  methods: {
    ...mapActions({
      userUpdateUserInfo: 'user/updateUserInfo',
      verifyCellphoneTwo: 'verifyCellphoneTwo'
    }),
    async handleSave() {
      let componentRef = this.$refs.personalCenterComponent
      switch (this.activeSettingIndex) {
        case 0:
          break
        case 1:
          await saveSecurityChanges()
          break
        default:
          break
      }
    },
    async saveSecurityChanges() {
      let { activeName } = componentRef
      switch (activeName) {
        case 'changePwd':
          await this.savePassword()
          break
        case 'accountBinding':
          break
        case 2:
          break
        default:
          let paylaod = {bind: true, cellphone: 18665835727, smsCode: 1234}
          this.verifyCellphoneTwo(paylaod)
          break
      }
    },
    async savePassword() {},
    handleClose() {
      this.$emit('close')
    },
    doActiveNavItem(index) {
      this.activeSettingIndex = index
    }
  },
  components: {
    UserData,
    AccountSecurity,
    RealNameAuthentication
  }
}
</script>

<style lang='scss'>
.personal-center {
  &-dialog {
    .el-dialog {
      width: 1020px;
    }
    .el-dialog__header {
      box-shadow: 0 2px 2px #b5b5b5;
      z-index: 10;
      position: relative;
    }
    .el-dialog__body {
      padding: 0;
      border-top: 15px solid #cdd4dc;
      display: flex;
      min-height: 652px;
    }
  }
  &-sidebar {
    width: 170px;
    box-sizing: border-box;
    flex-shrink: 0;
    ul {
      margin: 0;
      padding: 0;
      padding-top: 33px;
    }
    li {
      list-style: none;
      text-align: center;
      margin-bottom: 10px;
    }
    .sidebar-nav-item {
      display: inline-block;
      width: 120px;
      height: 40px;
      line-height: 40px;
      color: #333;
      font-size: 14px;
      border: 1px solid #f0efed;
      border-radius: 4px;
      cursor: pointer;
    }
    .sidebar-nav-item.active {
      background-color: #1989fa;
      color: #fff;
      border-color: #1989fa;
    }
  }
  &-content {
    flex: 1;
    border: 15px solid #cdd4db;
    border-width: 0 0 0 15px;
  }
}
</style>
