<template>
  <div class="project-grade">
    <div class="project-grade-summary">
      <div class="project-grade-score" :title="projectRate | rateInfoFilter(rateDetail.count)">{{projectRate | rateShowFilter(rateDetail.count)}}</div>
      <div class="project-grade-stars">
        <el-rate v-model="startRate" disabled text-color="#ff9900">
        </el-rate>
        <p class="project-grade-stars-info">已有<span class="project-grade-stars-warning">{{rateDetail.count}}</span>人评分</p>
      </div>
    </div>
    <div class="project-grade-detail">
      <div class="project-grade-item" v-for="index in [5,4,3,2,1]" :key="index">
        <span>{{index}}星</span>
        <el-progress :percentage="rateDetail[index] | percentFilter(rateDetail.count)"></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectGrade',
  props: {
    projectDetail: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.startRate = this.projectRate / 20
  },
  data() {
    return {
      startRate: 0
    }
  },
  computed: {
    projectRate: {
      get() {
        return _.get(this.projectDetail, 'rate', 0)
      },
      set(rate) {
        this.startRate = rate / 20
      }
    },
    rateDetail() {
      return _.get(this.projectDetail, 'extra.rate', {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        count: 0
      })
    }
  },
  filters: {
    percentFilter(count, total) {
      count = count || 0
      return total == 0 ? 0 : _.round((count / total) * 100)
    },
    rateShowFilter(rate, markCount) {
      return markCount < 8 ? 'N/A' : _.ceil(rate, 1)
    },
    rateInfoFilter(rate, markCount) {
      return markCount < 8 ? '尚未收集到足够的评价' : ''
    }
  }
}
</script>
<style lang="scss">
.project-grade {
  &-summary {
    display: flex;
    align-items: center;
    margin: 14px 0 6px;
  }
  &-score {
    font-size: 44px;
    margin-right: 10px;
    line-height: 1;
  }
  &-stars {
    &-info {
      margin: 4px 0 0;
      font-size: 12px;
      color: #bbb;
    }
    &-warning {
      color: #2397f3;
    }
    .el-rate__icon {
      margin-right: 2px;
    }
  }
  &-item {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #ccc;
    .el-progress {
      width: 150px;
      margin-left: 12px;
    }
    .el-progress__text {
      font-size: 12px !important;
      color: #555;
    }
  }
}
</style>
