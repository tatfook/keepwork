<template>
  <div class="org-teacher-router">
    <org-header></org-header>
    <router-view v-if="!isLoading"></router-view>
  </div>
</template>


<script>
import OrgHeader from './common/OrgHeader'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgTeacherContainer',
  components: {
    OrgHeader
  },
  data() {
    return {
      isLoading: true,
      _notify: null
    }
  },
  async created() {
    try {
      await this.getCurrentClass()
      this.checkIsInClassroom(this.$route)
    } catch (error) {
      console.error(error)
    }
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      getCurrentClass: 'org/teacher/getCurrentClass'
    }),
    backToClassroom() {
      const { classId, packageId, lessonId } = this.classroom
      if (packageId && lessonId) {
        this.$router.push({
          name: 'OrgTeacherClassPackageLesson',
          params: { classId, packageId, lessonId }
        })
      }
    },
    checkIsInClassroom(route) {
      const {
        params: { classId, packageId, lessonId }
      } = route
      const { classId: cid, packageId: pid, lessonId: lid } = this.classroom
      if (
        this.isBeInClass &&
        !(classId == cid && packageId == pid && lessonId == lid)
      ) {
        if (!this._notify) {
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
            onClick: this.backToClassroom,
            onClose: () => (this._notify = null)
          })
        }
      } else {
        this._notify && this._notify.close()
        this._notify = null
      }
    }
  },
  computed: {
    ...mapGetters({
      classroom: 'org/teacher/classroom',
      isBeInClass: 'org/teacher/isBeInClass'
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.checkIsInClassroom(to)
    next()
  }
}
</script>

<style lang="scss">
.org-teacher-router {
  width: 100%;
  min-height: 100%;
  background-color: #f5f5f5;
}

.back-to-classroom-notify {
  background: #ed9f21;
  /deep/.el-notification__icon {
    color: #e54104;
    background: white;
    border-radius: 50%;
  }
  /deep/.el-notification__content {
    color: white;
    line-height: 14px;
  }
  .back-to-classroom {
    color: #5353ff;
    cursor: pointer;
  }
  /deep/.el-notification__closeBtn {
    color: white;
  }
}
</style>
