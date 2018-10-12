<template>
  <div class="lesson-page" v-loading="loading">
    <div class="lesson-page-header">
      <common-header class="container" @callback="resetPage"></common-header>
    </div>
    <lesson-header></lesson-header>
    <router-view class="lesson-page-main-content" :class="{'lesson-page-main-content-scroll-only': isHeaderFooterFixed}" id="lesson-page" />
    <common-footer class="container"></common-footer>
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
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      isShowLoginDialog: 'lesson/isShowLoginDialog'
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
      toggleLoginDialog: 'lesson/toggleLoginDialog'
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
    resetPage() {
      const { name } = this.$route
      const rules = ['TeacherColumn', 'StudentColumn']
      if (rules.some(i => i === name)) {
        this.$router.push({ name: 'StudentCenter' })
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
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
