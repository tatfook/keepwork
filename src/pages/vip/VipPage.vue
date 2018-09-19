<template>
  <div class="vip-page" v-loading="isLoading">
    <div class="vip-page-header">
      <common-header class="container"></common-header>
    </div>
    <lesson-vip class="vip-page-main"></lesson-vip>
    <common-footer class="vip-page-footer"></common-footer>
    <div @click.stop v-if="isShowLoginDialog">
      <login-dialog :show="isShowLoginDialog" @close="handleLoginDialogClose"></login-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CommonHeader from '@/components/common/CommonHeader'
import CommonFooter from '@/components/common/CommonFooter'
import LoginDialog from '@/components/common/LoginDialog'
import LessonVip from '@/components/vip/LessonVip'

export default {
  name: 'VipPage',
  components: {
    CommonHeader,
    CommonFooter,
    LoginDialog,
    LessonVip
  },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapGetters({
      isShowLoginDialog: 'vip/isShowLoginDialog'
    })
  },
  async created() {
    await this.loadVipPresets()
  },
  methods: {
    ...mapActions({
      getUserProfile: 'user/getProfile',
      toggleLoginDialog: 'vip/toggleLoginDialog'
    }),
    async loadVipPresets() {
      await this.getUserProfile({ force: false, useCache: false }).catch(
        err => {
          console.error(err)
        }
      )
      this.isLoading = false
    },
    handleLoginDialogClose() {
      this.toggleLoginDialog(false)
    }
  }
}
</script>
<style lang="scss">
html,
body {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}
.vip-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  &-header {
    height: 60px;
    border-bottom: 1px solid #e6e6e6;
  }
  &-main {
    flex: 1;
  }
  &-footer {
    text-align: center;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
