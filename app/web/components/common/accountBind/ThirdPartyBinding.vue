<template>
  <div class="third-party-bind">
    <span class="third-party-bind-label">{{bindLabel}}</span><span><i :class="['iconfont', iconType]"></i></span>
    <span class="third-party-bind-info">{{isUserBindService ? bindServiceUsername : $t('user.unBound')}}</span>
    <el-button size="small" class="third-party-bind-button" :class="{'third-party-bind-button-unbund':isUserBindService}" @click="authenticate" :loading="isLoading">{{isUserBindService ? $t('user.unbunding') : $t('user.binding')}}</el-button>
    <password-verify-dialog :isPwdDialogVisible='isPwdDialogVisible' :pwdDialogData='pwdDialogData' @close='handlePwdDialogClose'></password-verify-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import PasswordVerifyDialog from './PasswordVerifyDialog'
import { keepwork } from '@/api'

export default {
  name: 'ThirdPartyBinding',
  async mounted() {
    await this.getUserThreeServiceByUsername({ username: this.username })
  },
  props: {
    type: String
  },
  data() {
    return {
      isLoading: false,
      pwdDialogData: {
        type: '',
        value: ''
      },
      isPwdDialogVisible: false
    }
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      getThreeService: 'user/getThreeService'
    }),
    iconType() {
      let _icon = ''
      switch (this.type.split('/')[0]) {
        case 'github':
          _icon = 'icon-github-fill'
          break
        case 'qq':
          _icon = 'icon-QQ-circle-fill'
          break
        case 'weixin':
          _icon = 'icon-logo-wechat'
          break
        case 'xinlangweibo':
          _icon = 'icon-weibo-circle-fill'
          break
        default:
          break
      }
      return _icon
    },
    typeNumber() {
      return _.toNumber(this.type.split('/')[1])
    },
    bindServiceData() {
      return this.getThreeService(this.typeNumber)
    },
    bindServiceId() {
      return _.get(this.bindServiceData, 'id')
    },
    bindServiceUsername() {
      return _.get(this.bindServiceData, 'externalUsername')
    },
    isUserBindService() {
      return this.bindServiceId && this.bindServiceUsername ? true : false
    },
    bindLabel() {
      let label = ''
      switch (this.type.split('/')[0]) {
        case 'github':
          label = this.$t('user.githubBind')
          break
        case 'qq':
          label = this.$t('user.qqBind')
          break
        case 'weixin':
          label = this.$t('user.weixinBind')
          break
        case 'xinlangweibo':
          label = this.$t('user.weiboBind')
          break
        default:
          break
      }
      return label
    }
  },
  methods: {
    ...mapActions({
      getUserThreeServiceByUsername: 'user/getUserThreeServiceByUsername',
      threeServiceDeleteById: 'user/threeServiceDeleteById'
    }),
    async handleBingdingResult(result) {
      if (result && result.data && result.data.token) {
        await this.getUserThreeServiceByUsername({
          username: this.username
        })
        this.$message({
          message: this.$t('user.bindingSuccess'),
          type: 'success'
        })
      } else {
        let defaultErrorMessage =
          this.$t('user.bindingFailed')
        let failureMessage = _.get(result, 'data.message', defaultErrorMessage)
        this.$message({
          message: failureMessage,
          type: 'error'
        })
      }
      this.isLoading = false
    },
    async authenticate() {
      let newestUserInfo = await keepwork.user.getProfile().catch(e => {
        window.location.reload()
      })
      if (
        newestUserInfo.username !== this.username ||
        !newestUserInfo
      ) {
        window.location.reload()
      }
      if (this.isUserBindService) {
        this.pwdDialogData = {
          type: 'threeService',
          value: this.bindServiceUsername,
          username: this.username,
          serviceId: this.bindServiceId
        }
        this.isPwdDialogVisible = true
        return
      }
      this.isLoading = true
      let provider = this.type.split('/')[0]
      this.$auth
        .authenticate(provider, { state: 'bind' })
        .then(async result => {
          this.handleBingdingResult(result)
          this.isLoading = false
        })
        .catch(async result => {
          this.handleBingdingResult(result)
          this.isLoading = false
        })
    },
    handlePwdDialogClose() {
      this.isPwdDialogVisible = false
    }
  },
  components: {
    PasswordVerifyDialog
  }
}
</script>
<style lang="scss" scoped>
.third-party-bind {
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  height: 46px;
  &-label {
    width: 100px;
    display: inline-block;
    text-align: right;
    padding-right: 26px;
    box-sizing: border-box;
  }
  .iconfont {
    font-size: 36px;
    margin-right: 26px;
  }
  .icon-logo-wechat {
    color: rgba(129, 206, 76, 0.99);
  }
  .icon-weibo-circle-fill {
    color: rgba(233, 60, 72, 0.99);
  }
  .icon-QQ-circle-fill {
    color: rgba(59, 156, 230, 0.99);
  }
  .icon-github-fill {
    color: #000;
  }
  &-info {
    display: inline-block;
    width: 180px;
    padding-right: 63px;
  }
  &-button {
    color: #1989fa;
    border-color: #1989fa;
    &-unbund {
      color: #333;
      border-color: #bcbcbc;
    }
  }
}
</style>
