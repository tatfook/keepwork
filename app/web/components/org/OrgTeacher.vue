<template>
  <div class="org-teacher-router" v-loading.fullscreen.lock="isLoading" element-loading-text="loading..." element-loading-background="#fff">
    <org-header></org-header>
    <router-view v-if="!isLoading"></router-view>
  </div>
</template>


<script>
import OrgHeader from './common/OrgHeader'
import { mapActions, mapGetters } from 'vuex'
import { lesson } from '@/api'
export default {
  name: 'OrgTeacherContainer',
  components: {
    OrgHeader
  },
  data() {
    return {
      isLoading: false
    }
  },
  async created() {
    try {
      this.isLoading = true
      await this.getOrgClasses()
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
    lesson.users.getUserDetail()
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/teacher/getOrgClasses'
    })
  }
}
</script>

<style lang="scss">
.org-teacher-router {
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
