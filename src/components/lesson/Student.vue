<template>
  <div>
    <router-view></router-view>
    <div @click.stop v-if="isLoginDialogShow">
      <login-dialog :show="isLoginDialogShow" @close="closeLoginDialog"></login-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'
export default {
  data() {
    return {
      isLoginDialogShow: false
    }
  },
  components: {
    LoginDialog
  },
  methods: {
    closeLoginDialog() {
      this.isLoginDialogShow = false
    }
  },
  beforeRouteUpdate({ name }, from, next) {
    if (name === 'StudentColumn' && !this.isLogined) {
      this.isLoginDialogShow = true
      return next(false)
    }
    next()
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined'
    })
  }
}
</script>
