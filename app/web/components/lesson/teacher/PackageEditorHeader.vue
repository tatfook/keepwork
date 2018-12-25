<template>
  <div class="package-editor-header">
    <div class="package-editor-header-header">
      <el-breadcrumb class="package-editor-header-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('lesson.packageManage.package')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{isEditing ? packageName : $t('lesson.newPackage')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="package-editor-header-header-operations">
        <el-button round @click="toPackageManagerPage" v-if="isEditable" class="package-editor-header-header-cancel-button">{{$t('common.Cancel')}}</el-button>
        <el-button round @click="savePackage" v-if="isEditable" class="package-editor-header-header-save-button" :class="{'is-disabled': isPackageNameEmpty}">{{$t('common.Save')}}</el-button>
        <el-button round type="primary" v-if="isSubmitable" class="package-editor-header-header-submit-button" :class="{'is-disabled': !isPackageInfoComplete}" @click="submitPackage">{{$t('lesson.packageManage.Submit')}}</el-button>
        <el-button round type="primary" v-if="isReleasable" class="package-editor-header-header-release-button" :class="{'is-disabled': !isPackageInfoComplete}" @click="releasePackage">{{$t('lesson.packageManage.Release')}}</el-button>
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
    editingPackageDetail: Object,
    isEditing: Boolean,
    isEditable: {
      type: Boolean,
      default: true
    },
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
  computed: {
    packageName() {
      if (this.isEditing) {
        let { packageName } = this.editingPackageDetail
        return packageName
      }
      return undefined
    }
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
  background-color: #f8f8f8;
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
    &-cancel-button:hover {
      background-color: #d95450;
      color: #fff;
      border-color: transparent;
    }
    &-save-button:hover {
      background-color: #17da98;
      color: #fff;
      border-color: transparent;
    }
    &-submit-button:hover,
    &-release-button:hover {
      background-color: #6291c1;
      color: #fff;
      border-color: transparent;
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
<style lang="scss">
@media (max-width: 768px) {
  .package-editor-header {
    &-header {
      display: block;
      padding: 0 16px;
      &-operations {
        text-align: right;
        margin-top: 8px;
        .el-button {
          padding: 8px 24px;
          width: auto;
        }
      }
    }
    &-tabs {
      margin: 16px;
      .el-button + .el-button {
        margin-left: 16px;
      }
    }
  }
}
</style>
