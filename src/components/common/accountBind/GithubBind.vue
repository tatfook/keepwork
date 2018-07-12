<template>
  <div class="github-bind">
    <span class="github-bind-label">{{$t('user.githubBind')}}:</span>
    <span class="github-bind-info">{{isUserBindGithub ? userGithubUsername : $t('user.unBound')}}</span>
    <el-button size="small" class="github-bind-button" :class="{'github-bind-button-unbund':isUserBindGithub}" @click="authenticate" :loading="isLoading">{{isUserBindGithub ? $t('user.unbunding') : $t('user.binding')}}</el-button>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'GithubBind',
  async mounted() {
    await this.getUserThreeServiceByUsername({ username: this.username })
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
    bindGithub() {
      return this.getThreeService('github')
    },
    userGithubId() {
      return _.get(this.bindGithub, '_id')
    },
    userGithubUsername() {
      return _.get(this.bindGithub, 'serviceUsername')
    },
    isUserBindGithub() {
      return this.userGithubId && this.userGithubUsername ? true : false
    }
  },
  methods: {
    ...mapActions({
      getUserThreeServiceByUsername: 'user/getUserThreeServiceByUsername',
      threeServiceDeleteById: 'user/threeServiceDeleteById'
    }),
    async authenticate() {
      this.isLoading = true
      if (this.isUserBindGithub) {
        await this.threeServiceDeleteById({
          id: this.userGithubId,
          username: this.username
        })
        this.isLoading = false
        this.$message({
          message: this.$t('user.unbunding') + this.$t('common.success'),
          type: 'success'
        })
        return
      }
      let provider = 'github'
      this.$auth
        .authenticate(provider)
        .then(async () => {
          await this.getUserThreeServiceByUsername({ username: this.username })
          this.isLoading = false
          this.$message({
            message: this.$t('user.binding') + this.$t('common.success'),
            type: 'success'
          })
        })
        .catch(error => {
          this.isLoading = false
          this.$message({
            message: this.$t('user.binding') + this.$t('common.failure'),
            type: 'error'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.github-bind {
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
