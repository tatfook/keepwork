<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'
export default {
  data() {
    return {
      isLoginDialogShow: false,
      _notify: null,
      _interval: null
    }
  },
  components: {
    LoginDialog
  },
  methods: {
    ...mapActions({
      checkClassroom: 'lesson/student/checkClassroom',
      toggleLoginDialog: 'lesson/toggleLoginDialog',
      changeStatus: 'lesson/student/changeStatus',
      uploadLearnRecords: 'lesson/student/uploadLearnRecords',
      resumeTheClass: 'lesson/student/resumeTheClass'
    }),
    closeLoginDialog() {
      this.toggleLoginDialog(false)
    },
    async backToClassroom() {
      if (!this.enterClassInfo.packageId || !this.enterClassInfo.lessonId) {
        await this.resumeTheClass()
      }
      const { packageId = '', lessonId = '' } = this.enterClassInfo
      this._notify && this._notify.close()
      if (packageId && lessonId) {
        this.$router.push(`/student/package/${packageId}/lesson/${lessonId}`)
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('lesson.classIsOver')
        })
      }
    },
    async intervalCheckClass(delay = 10 * 1000) {
      await this.checkClassroom()
      clearTimeout(this._interval)
      this._interval = setTimeout(async () => {
        await this.intervalCheckClass().catch(e => {
          this.$message({
            message: this.$t('lesson.classIsOver'),
            type: 'warning'
          })
          this._notify.close()
        })
      }, delay)
    }
  },
  beforeRouteUpdate(to, from, next) {
    const {
      name: toName,
      params: { packageId, lessonId }
    } = to

    const { name: fromName } = from
    let _route = ['LessonStudent']

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
      this.changeStatus(2)
      if (_route.some(i => i === fromName)) {
        this.uploadLearnRecords().catch(e => console.error(e))
      }
      !this._interval && this.intervalCheckClass()
      // 不在当前课堂里面
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
    } else {
      this.changeStatus(1)
      this._interval && clearTimeout(this._interval)
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

