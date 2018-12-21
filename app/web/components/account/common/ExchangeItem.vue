<template>
  <div
    :class="['exchange-item', { 'exchange-item-hover': isHover }]"
    @mouseover="handleShowButton"
    @mouseout="handleHideButton"
  >
    <img
      class="exchange-item-image"
      :src="image"
    >
    <div class="exchange-item-info">
      <div class="exchange-item-info-subject">
        {{subject}}
      </div>
      <div class="exchange-item-info-price">
        单价:
        <span class="exchange-item-info-price-number">{{ priceByUnit }}</span>
      </div>
      <el-button
        v-show="isHover"
        type="primary"
        class="exchange-item-info-button"
        @click="toExchangePage"
      >兑换</el-button>
    </div>
  </div>
</template>

<script>
import { locale } from "@/lib/utils/i18n";
export default {
  name: 'ExchangeItem',
  props: {
    data: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      isHover: false
    }
  },
  computed: {
    image() {
      return this.data.thumbnail
    },
    subject() {
      return this.data.subject
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
      return this.isRmb ? `${this.unitTable[this.priceUnit]} ${this.price}` : `${this.price} ${this.unitTable[this.priceUnit]}`
    },
    unitTable() {
      return this.isEn ? {
        rmb: '￥',
        coin: 'coin',
        bean: 'bean'
      } : {
          rmb: '￥',
          coin: '知识币',
          bean: '知识豆'
        }
    },
    isEn() {
      return locale === 'en-US'
    },
  },
  methods: {
    toExchangePage() {
      this.$message({
        type: 'success',
        message: '跳转订单确认页面'
      })
    },
    handleShowButton() {
      this.isHover = true
    },
    handleHideButton() {
      this.isHover = false
    }
  }
}

</script>

<style lang="scss">
.exchange-item {
  display: flex;
  align-items: center;
  max-width: 274px;
  min-width: 200px;
  height: 115px;
  border: 1px solid #e5e5e5;
  padding-left: 20px;
  box-sizing: border-box;
  &.exchange-item-hover {
    box-shadow: 0px 4px 10px 0px rgba(84, 143, 240, 0.28);
    border: solid 1px #409efe;
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
      color: #333;
    }
    &-price {
      font-size: 14px;
      margin-top: 5px;
      color: #999;
      &-number {
        color: #ff721e;
      }
    }

    &-button {
      margin-top: 6px;
      font-size: 12px;
      padding: 6px 16px;
      border-radius: 2px;
    }
  }
}
</style>


