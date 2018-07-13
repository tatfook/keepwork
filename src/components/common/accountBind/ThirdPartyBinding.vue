<template>
  <div class="third-party-bind">
    <span class="third-party-bind-label">{{bindLabel}}:</span>
    <span class="third-party-bind-info">{{isUserBindService ? bindServiceUsername : $t('user.unBound')}}</span>
    <el-button size="small" class="third-party-bind-button" :class="{'third-party-bind-button-unbund':isUserBindService}" @click="authenticate" :loading="isLoading">{{isUserBindService ? $t('user.unbunding') : $t('user.binding')}}</el-button>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
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
      isLoading: false
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
      if (result && result.error == 0) {
        await this.getUserThreeServiceByUsername({
          username: this.username
        })
        this.showMgitessage({
          message: this.$t('user.binding') + this.$t('common.success'),
          type: 'success'
        })
      } else {
        this.$message({
          message: this.$t('user.binding') + this.$t('common.failure'),
          type: 'error'
        })
      }
      this.isLoading = false
    },
    async authenticate() {
      this.isLoading = true
      if (this.isUserBindService) {
        await this.threeServiceDeleteById({
          id: this.bindServiceId,
          username: this.username
        })
        this.isLoading = false
        this.$message({
          message: this.$t('user.unbunding') + this.$t('common.success'),
          type: 'success'
        })
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
    }
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
