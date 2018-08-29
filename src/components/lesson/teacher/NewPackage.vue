<template>
  <div class="new-package">
    <div class="new-package-header">
      <el-breadcrumb class="new-package-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>课程包</el-breadcrumb-item>
        <el-breadcrumb-item>新建课程包</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="new-package-header-operations">
        <el-button round @click="cancelAddPackage">取消</el-button>
        <el-button round @click="savePackage" :class="{'is-disabled': isPackageNameEmpty}">保存</el-button>
        <el-button round type="primary" :class="{'is-disabled': !isPackageInfoComplete}" @click="submitPackage">提交</el-button>
      </div>
    </div>
    <div class="new-package-tabs">
      <el-button @click="setActiveTab('basic')" class="new-package-tabs-item" :class="{'active': activeTab === 'basic'}">基本信息</el-button>
      <el-button @click="setActiveTab('catalogue')" class="new-package-tabs-item" :class="{'active': activeTab === 'catalogue'}">目录</el-button>
    </div>
    <PackageBasicInfo ref="basicInfoComponent" v-show="activeTab === 'basic'"></PackageBasicInfo>
    <CoverMediaSetter ref="coverUrlComponent" v-show="activeTab === 'basic'" class="new-package-media-setter"></CoverMediaSetter>
    <CatalogueManager ref="lessonListComponent" v-show="activeTab === 'catalogue'"></CatalogueManager>
  </div>
</template>
<script>
import PackageBasicInfo from './PackageBasicInfo'
import CoverMediaSetter from './CoverMediaSetter'
import CatalogueManager from './CatalogueManager'
import { mapActions } from 'vuex'
export default {
  name: 'NewPackage',
  mounted() {
    this.isMounted = true
  },
  data() {
    return {
      isMounted: false,
      activeTab: 'catalogue' //basic or catalogue
    }
  },
  computed: {
    newPackageBasicInfo() {
      return this.$refs.basicInfoComponent.newPackageDetail
    },
    newPackageCoverUrl() {
      return this.$refs.coverUrlComponent.newPackageCoverUrl
    },
    newPackageLessons() {
      let lessons = this.$refs.lessonListComponent.catalogues
      let lessonsId = []
      _.forEach(lessons, lesson => {
        lessonsId.push(lesson.id)
      })
      return lessonsId
    },
    newPackageData() {
      return _.assign(
        this.newPackageBasicInfo,
        {
          extra: { coverUrl: this.newPackageCoverUrl }
        },
        { lessons: this.newPackageLessons }
      )
    },
    isPackageNameEmpty() {
      if (!this.isMounted) {
        return true
      }
      let packageName = this.newPackageData && this.newPackageData.packageName
      return !packageName || packageName == ''
    },
    isPackageInfoComplete() {
      if (!this.isMounted) {
        return false
      }
      let {
        subjectId,
        minAge,
        maxAge,
        intro,
        rmb,
        extra,
        lessons
      } = this.newPackageData
      if (
        typeof subjectId !== 'number' ||
        typeof minAge !== 'number' ||
        typeof maxAge !== 'number' ||
        typeof rmb !== 'number' ||
        !intro ||
        !extra.coverUrl ||
        !lessons ||
        lessons.length <= 0
      ) {
        return false
      }
      return true
    }
  },
  methods: {
    ...mapActions({
      createNewPackage: 'lesson/teacher/createNewPackage'
    }),
    setActiveTab(type) {
      if (type === this.activeTab) {
        return
      }
      this.activeTab = type
    },
    cancelAddPackage() {
      this.$router.push('/teacher/packageManager')
    },
    async savePackage() {
      if (this.isPackageNameEmpty) {
        this.$message({
          message: '填写名称后才能保存',
          type: 'warning'
        })
        return
      }
      let newPackageData = this.newPackageData
      await this.createNewPackage({ newPackageData })
      this.$message({
        message: '保存成功',
        type: 'success'
      })
    },
    submitPackage() {
      if (!this.isPackageInfoComplete) {
        this.$message({
          message: '信息填写完整后才能提交',
          type: 'warning'
        })
        return
      }
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
