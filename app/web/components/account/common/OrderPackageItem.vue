<template>
  <div class="order-package-item">
    <div class="order-package-item-cover">
      <img
        class="order-package-item-cover-image"
        :src="coverUrl"
        :alt="packageName"
      >
    </div>
    <div class="order-package-item-info">
      <div class="order-package-item-info-row name">
        {{packageName}}
      </div>
      <div class="order-package-item-info-row">
        <span class="includes">
          <span class="row-bold">包含:</span>{{includesLessonCount}} 个课程
        </span>
        <span class="age">
          年龄:
        </span>
      </div>
      <div class="order-package-item-info-row intro">
        简介: {{ packageIntro }}
      </div>
      <div class="order-package-item-info-row return">
        购买后返还XXX知识币
      </div>
    </div>
    <div class="order-package-item-cost"></div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'OrderPackageItem',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    console.warn(this.data)
  },
  computed: {
    coverUrl() {
      return _.get(this.data, 'extra.coverUrl', '')
    },
    packageName() {
      return _.get(this.data, 'packageName', '')
    },
    packageIntro() {
      return _.get(this.data, 'intro', '')
    },
    packageMinAge() {
      return _.get(this.data, 'minAge', 0)
    },
    pakcageMaxAge() {
      return _.get(this.data, 'maxAge', 0)
    },
    packageCostRmb() {
      return _.get(this.data, 'rmb', 0)
    },
    packageCostCoin() {
      return _.get(this.data, 'coin', 0)
    },
    includesLessonCount() {
      return _.get(this.data, 'lessons', []).length
    }
  }
}
</script>

<style lang="scss">
.order-package-item {
  background: #f8f7f7;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  &-cover {
    width: 179px;
    height: 104px;
    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-info {
    flex: 1;
    padding-left: 22px;
    position: relative;
    &-row {
      color: #999;
      font-size: 12px;
      line-height: 18px;
      &.row-bold {
        color: #5e5e5e;
      }
      &.name {
        font-size: 18px;
        color: #333;
        margin-bottom: 10px;
      }
      &.return {
        color: #55a7e8;
        position: absolute;
        bottom: 0;
      }
    }
  }

  &-cost {
    min-width: 100px;
  }
}
</style>


