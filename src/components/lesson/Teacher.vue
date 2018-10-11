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
      _notify: null
    }
  },
  components: {
    LoginDialog
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'lesson/toggleLoginDialog'
    }),
    backToClassroom() {
      const { packageId, lessonId } = this.classroom
      this._notify && this._notify.close()
      this.$router.push(`/teacher/package/${packageId}/lesson/${lessonId}`)
    }
  },
  beforeRouteUpdate(to, from, next) {
    const { name: toName, params: { packageId, lessonId } } = to
    let _route = [
      'LessonTeacherPlan',
      'LessonTeacherPerformance',
      'LessonTeacherPlan'
    ]
    // if (toName === 'TeacherColumn' && !this.isLogined) {
    //   this.toggleLoginDialog(true)
    //   return next(false)
    // }
    if (!this.isBeInClass) return next()
    const { packageId: _packageId, lessonId: _lessonId } = this.classroom
    let isCurrentClass =
      _route.some(i => i === toName) &&
      packageId == _packageId &&
      lessonId == _lessonId
    this._notify && this._notify.close()
    if (!this.isClassIsOver && !isCurrentClass) {
      this._notify = this.$notify({
        customClass: 'back-to-classroom-notify',
        iconClass: 'el-icon-warning',
        dangerouslyUseHTMLString: true,
        message: this.$t('lesson.notifyTips', {
          spanStart: '<span class="back-to-classroom">',
          spanEnd: '</span>'
        }),
        duration: 0,
        position: 'top-left',
        onClick: this.backToClassroom
      })
      console.warn('正在上课呢，瞎搞')
    }
    next()
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined',
      isBeInClass: 'lesson/teacher/isBeInClass',
      isClassIsOver: 'lesson/teacher/isClassIsOver',
      classroom: 'lesson/teacher/classroom',
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

