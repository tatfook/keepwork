<template>
  <div class="discount-coupon">
    <div class="discount-coupon-header">
      优惠卷
    </div>
    <div class="discount-coupon-tab">

    </div>
    <div class="discount-coupon-sum">
      共6个
    </div>

    <div class="discount-coupon-main">

      <div class="discount-coupon-main-tickets">
        <div
          class="discount-coupon-main-tickets-item"
          v-for="(item, index) in tickets"
          :key="index"
        >
          <coupon></coupon>
        </div>
      </div>
    </div>
    <div class="discount-coupon-explain">
      <div class="discount-coupon-explain-title">优惠卷使用说明:</div>
      <p class="discount-coupon-explain-item">请在券面所示有效期内使用，逾期失效。</p>
      <p class="discount-coupon-explain-item">用券应满足券面所示使用范围、满减金额。通用券可全平台通用，课程券仅限指定课程使用。</p>
      <p class="discount-coupon-explain-item">如您的订单在用券后未最终支付，则订单失效，优惠券自动返还。</p>
      <p class="discount-coupon-explain-item">一笔订单只能使用一张优惠券。</p>
      <p class="discount-coupon-explain-item">在个别特殊促销活动中，优惠券无法与其他优惠（如拼团、秒杀等）叠加使用。请以具体的活动规则为准。</p>
    </div>
  </div>
</template>

<script>
import Coupon from './common/Coupon'
export default {
  name: 'DiscountCoupon',
  components: {
    Coupon
  },
  data() {
    return {
      tickets: [1, 2, 3, 4, 5, 6]
    }
  }
}
</script>

<style lang="scss">
.discount-coupon {
  background: #fff;
  padding-bottom: 77px;
  &-header {
    height: 61px;
    line-height: 61px;
    padding-left: 28px;
    font-size: 16px;
    padding-left: -28px;
    border-bottom: 1px solid #e8e8e8;
  }

  &-tab {
    margin: 0 28px;
  }

  &-sum {
    margin: 0 28px;
    font-size: 14px;
    color: #808080;
  }

  &-main {
    margin: 0 28px;
    &-tickets {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      &-item {
        flex: 1;
        display: flex;
        justify-content: center;
        margin-top: 22px;
      }
    }
  }

  &-explain {
    margin: 28px 28px 0;
    &-title {
      color: #666666;
      font-size: 16px;
      margin-bottom: 24px;
    }
    &-item {
      color: #808080;
      font-size: 14px;
      line-height: 14px;
      margin-top: 10px;
      &::before {
        content: "•";
        margin-right: 11px;
      }
    }
  }
}
</style>


