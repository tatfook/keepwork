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
      isLoginDialogShow: false,
      _notify: null
    }
  },
  components: {
    LoginDialog
  },
  methods: {
    closeLoginDialog() {
      this.isLoginDialogShow = false
    },
    backToClassroom() {
      const { packageId, lessonId } = this.enterClassInfo
      this._notify && this._notify.close()
      this.$router.push(`/student/package/${packageId}/lesson/${lessonId}`)
    }
  },
  beforeRouteUpdate(to, from, next) {
    const { name: toName, params: { packageId, lessonId } } = to
    let _route = ['LessonStudent']
    if (toName === 'StudentColumn' && !this.isLogined) {
      this.isLoginDialogShow = true
      return next(false)
    }
    this._notify && this._notify.close()
    if (!this.isBeInClassroom) {
      return next()
    }
    const { packageId: _packageId, lessonId: _lessonId } = this.enterClassInfo
    let isCurrentClass =
      _route.some(i => i === toName) &&
      packageId == _packageId &&
      lessonId == _lessonId
    if (!isCurrentClass) {
      this._notify = this.$notify({
        customClass: 'back-to-classroom-notify',
        iconClass: 'el-icon-warning',
        dangerouslyUseHTMLString: true,
        message: this.$t('lesson.notifyTipsStudent', {
          spanStart: '<span class="back-to-classroom">',
          spanEnd: '</span>'
        }),
        duration: 0,
        position: 'top-left',
        onClick: this.backToClassroom
      })
    }
    next()
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined',
      isBeInClassroom: 'lesson/student/isBeInClassroom',
      enterClassInfo: 'lesson/student/enterClassInfo'
    })
  }
}
</script>

<style lang="scss">
$background: #ed9f21;
$icon: #e54104;
$blue: #5353ff;
.back-to-classroom-notify {
  background: $background;
  .el-notification__icon {
    color: $icon;
    background: white;
    border-radius: 50%;
  }
  .el-notification__content {
    color: white;
    line-height: 14px;
  }
  .back-to-classroom {
    color: $blue;
    cursor: pointer;
  }
  .el-notification__closeBtn {
    color: white;
  }
}
</style>

