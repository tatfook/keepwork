<template>
  <div class="discount-coupon">
    <div class="discount-coupon-header">
      优惠卷
    </div>
    <div class="discount-coupon-tab">
      <el-tabs
        v-model="activeName"
      >
        <el-tab-pane
          label="可使用"
          name="useable"
        >
          <!-- <coupon-list></coupon-list> -->
        </el-tab-pane>
        <el-tab-pane
          label="已使用"
          name="used"
        >
          <!-- <coupon-list></coupon-list> -->
        </el-tab-pane>
        <el-tab-pane
          label="已过期"
          name="past"
        >
          <!-- <coupon-list></coupon-list> -->
        </el-tab-pane>
      </el-tabs>
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
import { mapGetters, mapActions } from 'vuex'
import CouponList from './common/CouponList'
export default {
  name: 'DiscountCoupon',
  components: {
    CouponList
  },
  data() {
    return {
      activeName: 'useable',
      tickets: [1, 2, 3, 4, 5, 6]
    }
  },
  async mounted() {
    await this.getDiscounts()
  },
  computed: {
    ...mapGetters({
      discounts: 'account/discounts'
    })
  },
  methods: {
    ...mapActions({
      getDiscounts: 'account/getDiscounts'
    })
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
    margin: 20px 28px 10px;
    .el-tabs__nav-scroll {
      padding-left: 20px;
      background: #f5f5f5;
    }
  }

  &-explain {
    margin: 60px 28px 0;
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


