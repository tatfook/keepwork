<template>
  <div class="lesson-page" :class="{'lesson-page-scroll-all': isIE}" v-loading="loading">
    <div class="lesson-page-header">
      <common-header class="container" @callback="resetPage" @preCallback="preChangeStatus"></common-header>
    </div>
    <lesson-header></lesson-header>
    <router-view class="lesson-page-main-content" :class="{'lesson-page-main-content-scroll-only': isHeaderFooterFixed}" id="lesson-page" />
    <common-footer class="lesson-page-footer container"></common-footer>
    <div @click.stop v-if="isShowLoginDialog.show">
      <login-dialog :show="isShowLoginDialog.show" :to="isShowLoginDialog.to" @close="handleLoginDialogClose"></login-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CommonHeader from '@/components/common/CommonHeader'
import LessonHeader from '@/components/lesson/common/Header'
import CommonFooter from '@/components/common/CommonFooter'
import LoginDialog from '@/components/common/LoginDialog'
const TeacherColumnActivePageNameReg = /^TeacherColumn+/
export default {
  name: 'LessonPage',
  components: {
    LessonHeader,
    CommonHeader,
    CommonFooter,
    LoginDialog
  },
  data() {
    return {
      isIE: !!window.ActiveXObject || 'ActiveXObject' in window,
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      isShowLoginDialog: 'lesson/isShowLoginDialog',
      isBeInClassroom: 'lesson/student/isBeInClassroom'
    }),
    nowPagename() {
      return this.$route.name
    },
    isHeaderFooterFixed() {
      return TeacherColumnActivePageNameReg.test(this.nowPagename)
    }
  },
  async created() {
    await this.loadLessonPresets()
  },
  methods: {
    ...mapActions({
      getUserProfile: 'user/getProfile',
      getUserDetail: 'lesson/getUserDetail',
      toggleLoginDialog: 'lesson/toggleLoginDialog',
      changeStatus: 'lesson/student/changeStatus',
      uploadLearnRecords: 'lesson/student/uploadLearnRecords'
    }),
    async loadLessonPresets() {
      await this.getUserProfile({ force: false, useCache: false }).catch(err =>
        console.error(err)
      )
      await this.getUserDetail().catch(err => console.error(err))
      this.loading = false
    },
    handleLoginDialogClose() {
      this.toggleLoginDialog(false)
    },
    async resetPage() {
      const { name } = this.$route
      const rules = ['TeacherColumn', 'StudentColumn']
      if (rules.some(i => i === name)) {
        this.$router.push({ name: 'StudentCenter' })
      }
    },
    async preChangeStatus() {
      if (this.isBeInClassroom) {
        this.changeStatus(0)
        await this.uploadLearnRecords().catch(e => console.error(e))
        console.warn('preChangeStatus finish --->')
      }
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
.lesson-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-scroll-all {
    display: block;
  }
  &-header {
    height: 60px;
    border-bottom: 1px solid #e6e6e6;
  }
  &-main-content {
    background: #f8f8f8;
    min-height: auto;
    flex: 1;
    &-scroll-only {
      overflow: auto;
    }
  }
  &-footer {
    width: 100%;
    text-align: center;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .lesson-page {
    &-main-content {
      &-scroll-only {
        overflow: unset;
      }
    }
  }
}
</style>
