<template>
  <div class="exchange-item">
    <img class="exchange-item-image" :src="image">
    <div class="exchange-item-info">
      <div class="exchange-item-info-subject">
        {{subject}}
      </div>
      <div class="exchange-item-info-price">
        {{$t('account.price')}}
        <span class="exchange-item-info-price-number">{{ priceByUnit }}</span>
      </div>
      <el-button type="primary" class="exchange-item-info-button" @click="toExchangePage">{{$t('account.conversion')}}</el-button>
    </div>
  </div>
</template>

<script>
import UnitMixin from './UnitMixin'
import _ from 'lodash'
export default {
  name: 'ExchangeMallItem',
  mixins: [UnitMixin],
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    image() {
      return this.data.thumbnail
    },
    id() {
      return this.data.id
    },
    goodsId() {
      return this.data.goodsId
    },
    subject() {
      return this.isEn
        ? _.get(this.data, 'extra.enSubject', '')
        : _.get(this.data, 'subject', '')
    },
    price() {
      return this.data.rmb || this.data.coin || this.data.bean
    },
    isRmb() {
      return this.data.rmb > 0
    },
    isBean() {
      return this.data.bean > 0
    },
    isCoin() {
      return this.data.coin > 0
    },
    priceUnit() {
      if (this.isRmb) {
        return 'rmb'
      }
      if (this.isBean) {
        return 'bean'
      }
      if (this.isCoin) {
        return 'coin'
      }
    },
    priceByUnit() {
      return this.isRmb
        ? `${this.unitTable[this.priceUnit]} ${this.price}`
        : `${this.price} ${this.unitTable[this.priceUnit]}`
    }
  },
  methods: {
    toExchangePage() {
      let query = { goodsId: this.goodsId, type: 1, payment: this.priceUnit }
      if (this.goodsId === 984) {
        query['price'] = 30
      }
      this.$router.push({
        name: 'OrderConfirm',
        query
      })
    }
  }
}
</script>

<style lang="scss">
.exchange-item {
  display: flex;
  max-width: 274px;
  min-width: 200px;
  height: 115px;
  border: 1px solid #e5e5e5;
  padding-left: 24px;
  padding-top: 20px;
  box-sizing: border-box;
  &:hover {
    box-shadow: 0px 4px 10px 0px rgba(84, 143, 240, 0.28);
    border: solid 1px #409efe;
    .exchange-item-info-button {
      display: inline;
    }
  }
  &-image {
    width: 60px;
    height: 60px;
    margin-right: 15px;
  }
  &-info {
    height: 80px;
    &-subject {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    &-price {
      font-size: 14px;
      margin-top: 5px;
      color: #999;
      &-number {
        color: #ff721e;
        font-weight: bold;
      }
    }

    &-button {
      margin-top: 6px;
      font-size: 12px;
      padding: 6px 16px;
      border-radius: 2px;
      display: none;
    }
  }
}
</style>
