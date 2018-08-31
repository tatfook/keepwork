<template>
  <div class="package-editor-header">
    <div class="package-editor-header-header">
      <el-breadcrumb class="package-editor-header-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('lesson.packageManage.package')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('lesson.newPackage')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="package-editor-header-header-operations">
        <el-button round @click="toPackageManagerPage">{{$t('common.Cancel')}}</el-button>
        <el-button round @click="savePackage" :class="{'is-disabled': isPackageNameEmpty}">{{$t('common.Save')}}</el-button>
        <el-button round type="primary" v-if="isSubmitable" :class="{'is-disabled': !isPackageInfoComplete}" @click="submitPackage">{{$t('lesson.packageManage.Submit')}}</el-button>
        <el-button round type="primary" v-if="isReleasable" :class="{'is-disabled': !isPackageInfoComplete}" @click="releasePackage">{{$t('lesson.packageManage.Release')}}</el-button>
      </div>
    </div>
    <div class="package-editor-header-tabs">
      <el-button @click="setActiveTab('basic')" class="package-editor-header-tabs-item" :class="{'active': activeTab === 'basic'}">{{$t('lesson.packageManage.basicInfo')}}</el-button>
      <el-button @click="setActiveTab('catalogue')" class="package-editor-header-tabs-item" :class="{'active': activeTab === 'catalogue'}">{{$t('lesson.catalogue')}}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PackageEditorHeader',
  props: {
    activeTab: String,
    isSubmitable: {
      type: Boolean,
      default: true
    },
    isReleasable: {
      type: Boolean,
      default: false
    },
    isPackageNameEmpty: Boolean,
    isPackageInfoComplete: Boolean
  },
  methods: {
    setActiveTab(type) {
      if (type === this.activeTab) {
        return
      }
      this.$emit('changeActiveType', type)
    },
    savePackage() {
      this.$emit('savePackage', {})
    },
    submitPackage() {
      this.$emit('submitPackage')
    },
    releasePackage() {
      this.$emit('releasePackage')
    },
    toPackageManagerPage() {
      this.$router.push('/teacher/packageManager')
    }
  }
}
</script>
<style lang="scss">
.package-editor-header {
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
