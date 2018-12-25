<template>
  <div class="discount-coupon">
    <div class="discount-coupon-header">
      {{$t('account.coupons')}}
    </div>
    <div class="discount-coupon-tab" v-if="hasDiscounts">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('account.available')" name="useable">
          <coupon-list :data="discountsUseable"></coupon-list>
        </el-tab-pane>
        <el-tab-pane :label="$t('account.used')" name="used">
          <coupon-list :data="discountsUsed"></coupon-list>
        </el-tab-pane>
        <el-tab-pane :label="$t('account.expired')" name="expire">
          <!-- <coupon-list></coupon-list> -->
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="discount-coupon-explain">
      <div class="discount-coupon-explain-title">{{$t('account.couponDescription')}}</div>
      <p class="discount-coupon-explain-item">{{$t('account.couponDescription1')}}</p>
      <p class="discount-coupon-explain-item">{{$t('account.couponDescription2')}}</p>
      <p class="discount-coupon-explain-item">{{$t('account.couponDescription3')}}</p>
      <p class="discount-coupon-explain-item">{{$t('account.couponDescription4')}}</p>
      <p class="discount-coupon-explain-item">{{$t('account.couponDescription5')}}</p>
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
    console.warn(this._discounts)
  },
  computed: {
    ...mapGetters({
      discounts: 'account/discounts'
    }),
    hasDiscounts() {
      return this.discounts.length > 0
    },
    _discounts() {
      return this.discounts.filter(i => i.title)
    },
    discountsUseable() {
      return this._discounts.filter(item => item.state === 0)
    },
    discountsUsed() {
      return this.discounts.filter(item => item.state === 1)
    }
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
        content: '•';
        margin-right: 11px;
      }
    }
  }
}
</style>


