<template>
  <div class="package-detail">
    <img class="package-detail-cover" :src="packageCoverUrl" alt="">
    <div class="package-detail-text-desc">
      <h1>{{packageDetail.packageName}}</h1>
      <div class="package-detail-content">
        <div class="package-detail-content-item">
          <span class="package-detail-label">{{$t('lesson.include')}}:</span>
          <span class="package-detail-lessons-count">{{packageLessonsCount}}</span>
          <span class="package-detail-info">{{$t('lesson.lessonsCount')}}</span>
        </div>
        <div class="package-detail-content-item">
          <span class="package-detail-label">{{$t('lesson.ages')}}:</span>
          <span class="package-detail-info">{{packageDetail.minAge}}-{{packageDetail.maxAge}}</span>
        </div>
      </div>
      <div class="package-detail-skills">
        <div class="package-detail-label">{{$t('lesson.intro')}}:</div>
        <el-scrollbar class="package-detail-skills-detail">{{packageDetail.intro}}</el-scrollbar>
      </div>
      <div class="package-detail-operations">
        <div class="package-detail-operate-item">
          <span class="package-detail-price-count">{{packageDetail.cost}}</span>
          <span class="package-detail-label">{{$t('lesson.coins')}}</span>
        </div>
        <el-button type="primary" class="package-detail-operate-item" @click="addPackage">{{$t('lesson.add')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PackagBasiceDetail',
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
        `${this.$t('lesson.buyPackageInfo')}${this.packageDetail.cost}${this.$t('lesson.coins')}`,
        this.$t('lesson.infoTitle'),
        {
          confirmButtonText: this.$t('common.Sure'),
          cancelButtonText: this.$t('common.Cancel'),
          type: 'warning'
        }
      ).then(() => {
        this.sendAddPackageReqToBack()
      })
    },
    async sendAddPackageReqToBack() {
      await this.studentSubscribePackage({ packageId: this.packageId })
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
