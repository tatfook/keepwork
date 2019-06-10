<template>
  <div class="org-student-router">
    <org-header></org-header>
    <router-view v-if="!isLoading"></router-view>
  </div>
</template>


<script>
import OrgHeader from './common/OrgHeader'
import { mapActions, mapGetters } from 'vuex'
import { lesson } from '@/api'
import io from 'socket.io-client'

export default {
  name: 'OrgStudentContainer',
  components: {
    OrgHeader
  },
  data() {
    return {
      isLoading: true,
      _notify: null,
      _interval: null,
      isFirstCheck: true
    }
  },
  async created() {
    try {
      await Promise.all([
        this.getUserOrgRealName(),
        this.getUserInfo(),
        this.getOrgClasses()
      ])
      await this.resumeClassroom()
      this.checkIsInClassroom(this.$route)
      this.initSocket()
      // this.intervalCheckClass()
    } catch (error) {
      console.error(error)
    }
    this.isLoading = false
    lesson.users.getUserDetail()
  },
  methods: {
    ...mapActions({
      resumeClassroom: 'org/student/resumeClassroom',
      checkClassroom: 'org/student/checkClassroom',
      getUserInfo: 'org/student/getUserInfo',
      getUserOrgRealName: 'org/student/getUserOrgRealName',
      getOrgClasses: 'org/student/getOrgClasses',
      getTeachingLesson: 'org/student/getTeachingLesson'
    }),
    backToClassroom() {
      const { packageId, lessonId } = this.classroom
      if (packageId && lessonId) {
        this.$router.push({
          name: 'OrgStudentPackageLesson',
          params: { packageId, lessonId }
        })
      }
    },
    initSocket() {
      const socket = io(process.env.SOCKET_API_PREFIX, {
        query: {
          userId: this.userId,
          token: this.token
        },
        transports: ['websocket']
      })
      socket.on('msg', data => {
        const { payload = {} } = data
        if (payload.type === 1 && (payload.beginClass || payload.classOver)) {
          this.getTeachingLesson()
          if (this.isBeInClassroom) {
            this.checkClassroom().catch(e => {
              this._notify && this._notify.close()
              this._notify = null
              if (this.$route.name === 'OrgStudentPackageLesson') {
                this.$message({
                  message: this.$t('lesson.classIsOver'),
                  type: 'warning',
                  duration: 10000
                })
              }
            })
          }
        }
      })
    },
    checkIsInClassroom(route) {
      const {
        params: { packageId, lessonId }
      } = route
      const { packageId: pid, lessonId: lid } = this.classroom

      if (
        this.isBeInClassroom &&
        this.isTeaching &&
        !(packageId == pid && lessonId == lid)
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
    },
    async intervalCheckClass(delay = 30) {
      if (this.isFirstCheck) {
        this.isFirstCheck = false
      } else {
        await this.checkClassroom()
      }
      clearTimeout(this._interval)
      this._interval = setTimeout(async () => {
        await this.intervalCheckClass().catch(e => {
          this._notify && this._notify.close()
          this._notify = null
        })
      }, delay * 1000)
    }
  },
  computed: {
    ...mapGetters({
      isBeInClassroom: 'org/student/isBeInClassroom',
      classroom: 'org/student/classroom',
      isTeaching: 'org/student/isTeaching',
      userinfo: 'org/userinfo',
      token: 'org/token'
    }),
    userId() {
      return this.userinfo.id
    }
  },
  destroyed() {
    this._notify && this._notify.close()
  },
  beforeRouteUpdate(to, from, next) {
    this.checkIsInClassroom(to)
    next()
  }
}
</script>

<style lang="scss">
.org-student-router {
  width: 100%;
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
<style lang="scss">
@media print {
  .back-to-classroom-notify {
    display: none;
  }
}
</style>
