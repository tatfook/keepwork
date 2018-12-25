<template>
  <div class="order-success">
    <img class="order-success-icon" src="../../assets/account/order-success.png" alt="order-success-icon">
    <div class="order-success-title">支付成功</div>
    <div class="order-success-cost">{{finalCostByUnit}}</div>
    <div class="order-success-discount">
      返{{totalCost}}知识币
      <sapn v-if="hasDiscounts">{{discount}}</sapn>
      <router-link v-if="hasDiscounts" class="order-success-discount-link" :to="{ name: 'DiscountCoupon'}">点击查看</router-link>
    </div>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'OrderSuccess',
  mounted() {
    document.title = '订单完成'
  },
  computed: {
    ...mapGetters({
      tradeOrder: 'account/tradeOrder'
    }),
    finalCostByUnit() {
      return this.tradeOrder.finalCostByUnit
    },
    totalCost() {
      return this.tradeOrder.totalCost
    },
    discount() {
      return this.hasDiscounts ? this.tradeOrder.discounts.title : ''
    },
    hasDiscounts() {
      return this.tradeOrder.discounts
    }
  },
}
</script>

<style lang="scss">
.order-success {
  max-width: 1200px;
  min-height: 330px;
  margin: 20px auto;
  background: #fff;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &-icon {
    width: 104px;
    height: 104px;
  }

  &-title {
    font-size: 18px;
    color: #333;
  }

  &-cost {
    font-size: 26px;
    line-height: 24px;
    color: #f20d0d;
    margin-top: 24px;
  }

  &-discount {
    font-size: 16px;
    color: #666;
    margin-top: 24px;
    &-link {
      color: #409efe;
    }
  }
}
</style>


