<template>
  <div class="study-homepage-header">
    <div class="study-homepage-header-menu clearfix">
      <div class="study-homepage-header-menu-left">
        <span :class="['tab-cell', {'active':activeIndex == 1}]" @click="switchTab('textbook',1)">教材</span>
        <span :class="['tab-cell', {'active':activeIndex == 2}]" @click="switchTab('document',2)">文档</span>
        <span :class="['tab-cell', {'active':activeIndex == 3}]" @click="switchTab('lessonPackage',3)">课程</span>
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
  mounted(){
    this.getCurrentRoute()
  },
  methods: {
    switchTab(tabname, index) {
      this.activeIndex = index
      this.$router.push(`/${tabname}`)
    },
    getCurrentRoute(){
      let name = this.$route.name
      let tabArr = ['Textbook', 'Document', 'LessonPackage', 'Education', 'MyOrganization', 'CreatePackage']
      this.activeIndex = tabArr.indexOf(name) + 1
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
  background: #f8f8f8;
  &-menu {
    width: 1200px;
    min-height: 64px;
    margin: 24px auto;
    border-radius: 10px;
    background: #fff;
    padding: 0 24px;
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

