<template>
  <div class="package-detail">
    <img class="package-detail-cover" :src="packageCoverUrl" alt="">
    <div class="package-detail-text-desc">
      <h1>{{packageDetail.packageName}}</h1>
      <div class="package-detail-content">
        <div class="package-detail-content-item">
          <span class="package-detail-label">包含:</span>
          <span class="package-detail-lessons-count">{{packageLessonsCount}}</span>
          <span class="package-detail-info">门课程</span>
        </div>
        <div class="package-detail-content-item">
          <span class="package-detail-label">年龄:</span>
          <span class="package-detail-info">{{packageDetail.minAge}}-{{packageDetail.maxAge}}</span>
        </div>
      </div>
      <div class="package-detail-skills">
        <div class="package-detail-label">技能:</div>
        <el-scrollbar class="package-detail-skills-detail">{{packageDetail.intro}}</el-scrollbar>
      </div>
      <div class="package-detail-operations">
        <div class="package-detail-operate-item">
          <span class="package-detail-price-count">{{packageDetail.cost}}</span>
          <span class="package-detail-label">知识币</span>
        </div>
        <el-button type="primary" class="package-detail-operate-item" @click="addPackage">增加</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PackageDetail',
  props: {
    packageDetail: Object
  },
  computed: {
    packageLessonsCount() {
      return _.get(this.packageDetail, 'lessons', []).length
    },
    packageCoverUrl() {
      return _.get(this.packageDetail, 'extra.coverUrl', '')
    }
  },
  data() {
    return {
      packageId: '10'
    }
  },
  methods: {
    ...mapActions({
      studentSubscribePackage: 'lesson/student/subscribePackage'
    }),
    addPackage() {
      this.$confirm(
        `学习本课程包的课程，将花费${this.packageDetail.cost}知识币。`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.sendAddPackageReqToBack()
      })
    },
    async sendAddPackageReqToBack() {
      await this.studentSubscribePackage({ packageId: this.packageId })
      this.$message({
        message: '恭喜你，课程包添加成功',
        showClose: true,
        type: 'success',
        confirmButtonText: '确定',
        callback: action => {}
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.package-detail {
  display: flex;
  &-cover {
    width: 470px;
    height: 310px;
    object-fit: cover;
  }
  &-text-desc {
    flex: 1;
    margin-left: 55px;
    color: #4c4c4c;
    min-width: 0;
  }
  &-content {
    margin: 15px 0;
    &-item {
      display: inline-block;
      margin-right: 30px;
      font-size: 18px;
    }
  }
  h1 {
    margin: 0;
    font-size: 18px;
    color: #111;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &-label {
    font-size: 18px;
    margin-right: 3px;
  }
  &-info {
    color: #818181;
  }
  &-lessons-count {
    color: #ff414a;
  }
  &-skills-detail {
    margin: 20px 0;
    height: 110px;
    white-space: pre-line;
    font-size: 16px;
    line-height: 30px;
  }
  &-operate-item {
    display: inline-block;
  }
  &-price-count {
    font-size: 24px;
    color: #ff4c4c;
  }
  .el-button--primary {
    font-size: 18px;
    margin-left: 30px;
    width: 140px;
  }
}
</style>
<style lang="scss">
.el-scrollbar__wrap {
  overflow-x: auto;
}
</style>
