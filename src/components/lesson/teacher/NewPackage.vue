<template>
  <div class="new-package">
    <div class="new-package-header">
      <el-breadcrumb class="new-package-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>课程包</el-breadcrumb-item>
        <el-breadcrumb-item>新建课程包</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="new-package-header-operations">
        <el-button round>取消</el-button>
        <el-button round>保存</el-button>
        <el-button round type="primary">提交</el-button>
      </div>
    </div>
    <div class="new-package-tabs">
      <el-button @click="setActiveTab('basic')" class="new-package-tabs-item" :class="{'active': activeTab === 'basic'}">基本信息</el-button>
      <el-button @click="setActiveTab('catalogue')" class="new-package-tabs-item" :class="{'active': activeTab === 'catalogue'}">目录</el-button>
    </div>
    <PackageBasicInfo v-show="activeTab === 'basic'"></PackageBasicInfo>
    <CoverMediaSetter v-show="activeTab === 'basic'" class="new-package-media-setter"></CoverMediaSetter>
    <CatalogueManager v-show="activeTab === 'catalogue'"></CatalogueManager>
  </div>
</template>
<script>
import PackageBasicInfo from './PackageBasicInfo'
import CoverMediaSetter from './CoverMediaSetter'
import CatalogueManager from './CatalogueManager'
export default {
  name: 'NewPackage',
  data() {
    return {
      activeTab: 'basic' //basic or catalogue
    }
  },
  methods: {
    setActiveTab(type) {
      if (type === this.activeTab) {
        return
      }
      this.activeTab = type
    }
  },
  components: {
    PackageBasicInfo,
    CatalogueManager,
    CoverMediaSetter
  }
}
</script>
<style lang="scss">
.new-package {
  padding: 37px 0 0;
  &-header {
    display: flex;
    &-breadcrumb {
      flex: 1;
      .el-breadcrumb__inner {
        color: #b3b3b3;
      }
      .el-breadcrumb__item:last-child .el-breadcrumb__inner {
        color: #333;
      }
    }
    &-operations {
      font-size: 17px;
      .el-button {
        width: 90px;
      }
      .el-button + .el-button {
        margin-left: 7px;
      }
    }
  }
  &-tabs {
    margin: 56px 0 14px;
    display: flex;
    justify-content: space-between;
    .el-button {
      width: 50%;
      font-size: 18px;
      background-color: #d2d2d2;
      border-color: #b3b3b3;
      color: #fff;
    }
    .el-button + .el-button {
      margin-left: 27px;
    }
    .el-button.active {
      background-color: #409efe;
    }
  }
  &-media-setter {
    margin-top: 35px;
  }
}
</style>
