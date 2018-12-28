<template>
  <div class="order-goods-item">
    <div class="order-goods-item-cover">
      <img class="order-goods-item-cover-image" :src="coverUrl" :alt="subject">
    </div>
    <div class="order-goods-item-info">
      <div class="order-goods-item-info-subject">
        {{ subject }}
      </div>
    </div>
    <div class="order-goods-item-cost">
      {{ goodsCostByUnit }}
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import UnitMixin from './UnitMixin'
export default {
  name: 'OrderGoodsItem',
  mixins: [UnitMixin],
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    coverUrl() {
      return _.get(this.data, 'thumbnail', '')
    },
    subject() {
      return _.get(this.data, 'subject', '')
    },
    payment() {
      return _.get(this.data, 'payment', '')
    },
    isRmbPayment() {
      return this.payment === 'rmb'
    },
    goodsCost() {
      return _.get(this.data, [this.payment], 0)
    },
    goodsCostByUnit() {
      return this.isRmbPayment
        ? `${this.costUnit}${this.goodsCost}`
        : `${this.goodsCost}${this.costUnit}`
    }
  }
}
</script>

<style lang="scss">
.order-goods-item {
  background: #f8f7f7;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  &-cover {
    width: 180px;
    height: 100px;
    &-image {
      height: 100%;
      width: 100%;
      object-fit: scale-down;
    }
    
  }

  &-info {
    flex: 1;
    padding-left: 22px;
  }

  &-cost {
    min-width: 100px;
    height: 100%;
    line-height: 100%;
    color: #f20d0d;
    margin-right: 120px;
  }
}
</style>


