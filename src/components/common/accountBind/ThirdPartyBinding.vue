<template>
  <div class="third-party-bind">
    <span class="third-party-bind-label">{{bindLabel}}:</span>
    <span class="third-party-bind-info">{{isUserBindService ? bindServiceUsername : $t('user.unBound')}}</span>
    <el-button size="small" class="third-party-bind-button" :class="{'third-party-bind-button-unbund':isUserBindService}" @click="authenticate" :loading="isLoading">{{isUserBindService ? $t('user.unbunding') : $t('user.binding')}}</el-button>
    <PasswordVerifyDialog :isPwdDialogVisible='isPwdDialogVisible' :pwdDialogData='pwdDialogData' @close='handlePwdDialogClose'></PasswordVerifyDialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import PasswordVerifyDialog from './PasswordVerifyDialog'
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
    bindServiceData() {
      return this.getThreeService(this.type)
    },
    bindServiceId() {
      return _.get(this.bindServiceData, '_id')
    },
    bindServiceUsername() {
      return _.get(this.bindServiceData, 'serviceUsername')
    },
    isUserBindService() {
      return this.bindServiceId && this.bindServiceUsername ? true : false
    },
    bindLabel() {
      let label = ''
      switch (this.type) {
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
      if (result && result.data && result.data.error == 0) {
        await this.getUserThreeServiceByUsername({
          username: this.username
        })
        this.$message({
          message: this.$t('user.binding') + this.$t('common.success'),
          type: 'success'
        })
      } else {
        let defaultErrorMessage =
          this.$t('user.binding') + this.$t('common.failure')
        let failureMessage = _.get(result, 'data.message', defaultErrorMessage)
        this.$message({
          message: failureMessage,
          type: 'error'
        })
      }
      this.isLoading = false
    },
    async authenticate() {
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
      let provider = this.type
      this.$auth
        .authenticate(provider)
        .then(async result => {
          console.log(result)
          this.handleBingdingResult(result)
        })
        .catch(async result => {
          console.log(result)
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
  &-label {
    width: 140px;
    display: inline-block;
    text-align: right;
    padding-right: 56px;
    box-sizing: border-box;
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
