<template>
  <div class="study-homepage-header">
    <div class="study-homepage-header-menu clearfix">
      <div class="study-homepage-header-menu-left">
        <span :class="['tab-cell', {'active':activeIndex == 1}]" @click="switchTab('textbook',1)">教材</span>
        <span :class="['tab-cell', {'active':activeIndex == 2}]" @click="switchTab('document',2)">文档</span>
        <span :class="['tab-cell', {'active':activeIndex == 3}]" @click="switchTab('lesson',3)">课程</span>
        <span :class="['tab-cell', {'active':activeIndex == 4}]" @click="switchTab('education',4)">教育</span>
      </div>
      <div class="study-homepage-header-menu-right">
        <span :class="['tab-cell', {'active':activeIndex == 5}]" @click="switchTab('myOrganization',5)">我的机构</span>
        <span :class="['tab-cell', {'active':activeIndex == 6}]" @click="switchTab('createPackage',6)">创建课程</span>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'

export default {
  name: 'StudyhomepageHeader',
  data() {
    return {
      activeIndex: 0
    }
  },
  watch: {
    $route(to) {
      this.getCurrentRoute()
    }
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined'
    })
  },
  mounted() {
    this.getCurrentRoute()
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    switchTab(tabname, index) {
      if (index == 1) {
        this.$message.info('敬请期待')
        return
      }
      if (index == 2) {
        window.open('https://keepwork.com/official/docs/index')
        return
      }
      if (index == 4) {
        window.open('https://biz.keepwork.com')
        return
      }
      if (index == 5) {
        if (!this.isLogined) {
          return this.toggleLoginDialog(true)
        }
      }
      this.activeIndex = index
      this.$router.push(`/${tabname}`)
    },
    getCurrentRoute() {
      let name = this.$route.name
      let tabArr = [
        'Textbook',
        'Document',
        'LessonPackage',
        'Education',
        'MyOrganization',
        'CreatePackage'
      ]
      this.activeIndex = tabArr.indexOf(name) + 1
      const LSSON_ROUTER_NAME = [
        'Lesson',
        'LessonPackage',
        'OrganizationCooperation',
        'PackageDetail'
      ]
      if (LSSON_ROUTER_NAME.includes(name)) {
        this.activeIndex = 3
      }
    }
  }
}
</script>



<style lang="scss">
.clearfix:after {
  content: '';
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.clearfix {
  zoom: 1;
}
.study-homepage-header {
  z-index: 999;
  &-menu {
    width: 1200px;
    min-height: 64px;
    margin: 24px auto;
    border-radius: 10px;
    background: #fff;
    padding: 0 24px;
    box-sizing: border-box;
    &-left {
      float: left;
    }
    &-right {
      float: right;
    }
    .tab-cell {
      font-size: 14px;
      cursor: pointer;
      line-height: 64px;
      display: inline-block;
      height: 64px;
      padding: 0 23px;
      // &:hover {
      //   transition: 0.8s all ease-in;
      //   background-color: #e7f1f8;
      // }
    }
    .active {
      color: #2397f3;
    }
  }
}

@media (max-width: 768px) {
  .study-homepage-header {
    margin: 0;
    &-menu {
      &-left-button {
      }
      &-right {
      }
    }
  }
}
</style>

