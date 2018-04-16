<template>
  <div class="tool-header">
    <!-- <el-breadcrumb separator='/'>
      <el-breadcrumb-item>http://keepwork.com</el-breadcrumb-item>
      <el-breadcrumb-item>{{activePageInfo.username}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{activePageInfo.sitename}}</el-breadcrumb-item>
      <el-breadcrumb-item v-for="path in activePageInfo.paths" :key="path">{{path}}</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="breadcrumb">
      <a class="breadcrumb-item" href="/">http://keepwork.com</a>
      <span class="breadcrumb-separator" role="presentation">/</span>
      <a class="breadcrumb-item" :href="'/' + activePageInfo.username">{{activePageInfo.username}}</a>
      <el-dropdown class="breadcrumb-item">
        <span class="el-dropdown-link">
          <span class="breadcrumb-separator" role="presentation">/</span> {{activePageInfo.sitename}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="breadcrumb-item" v-for="path in activePageInfo.paths" :key="path">
        <span class="el-dropdown-link">
          <span class="breadcrumb-separator" role="presentation">/</span> {{path}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="icons">
      <a href="/editor.html" class="icon-item">
        <img src="http://keepwork.com/wiki/assets/imgs/icon/wiki_edit.png" alt="">
      </a>
      <img class="icon-item" src="http://keepwork.com/wiki/assets/imgs/icon/wiki_share.png" alt="">
      <i class="iconfont icon-dianzan icon-item"></i>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ToolHeader',
  computed: {
    ...mapGetters({
      activePage: 'activePage',
      activePageInfo: 'activePageInfo'
    })
  }
}
</script>
<style <style lang="scss" scoped>
.tool-header {
  position: relative;
  .breadcrumb {
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
  }
  .icons {
    position: absolute;
    right: 0;
    top: 0;
  }
  .icon-item {
    font-size: 30px;
    line-height: 1;
    padding: 10px 15px;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
  }
  a {
    color: #606266;
    text-decoration: none;
    font-size: 14px;
  }
  .el-dropdown-link:hover,
  a:hover {
    color: #3ba4ff;
    cursor: pointer;
  }
}
</style>
