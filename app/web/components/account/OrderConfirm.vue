<template>
  <div class="order-confirm">
    <div class="order-confirm-header">
      <div class="order-confirm-header-center">
        <div class="order-confirm-header-center-title">购买账号</div>
        <div class="order-confirm-header-center-username">Keepwork账号: {{username}}</div>
      </div>
    </div>
    <div
      class="order-confirm-main"
      v-loading="isLoading"
    >
      <div class="order-confirm-main-title">
        确认订单信息
      </div>
      <div class="order-confirm-main-item">
        <package-item
          v-if="!isLoading && isPackageType"
          :data="goodsDetail"
        ></package-item>
      </div>
      <div class="order-confirm-main-count">
        <div class="order-confirm-main-count-title">
          数量:
        </div>
        <div class="order-confirm-main-count-input">
          <el-input-number
            class="input-number-counter"
            v-model="count"
            :min="1"
            :max="1000000"
            size="small"
          ></el-input-number>
        </div>
        <div class="order-confirm-main-count-total">
          总价: 1000 人民币
        </div>
      </div>
      <div class="order-confirm-main-discounts">
        <div class="order-confirm-main-discounts-title">
          优惠券
        </div>
        <div class="order-confirm-main-discounts-checked">
          无优惠券
        </div>
        <div class="order-confirm-main-discounts-all">
          查看详情 <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="order-confirm-main-submit">
        <div class="order-confirm-main-submit-total">
          <span class="order-confirm-main-submit-total-title">需支付: </span>
          <span class="order-confirm-main-submit-total-cost">10000 人民币</span>
        </div>
        <el-button
          type="danger"
          class="order-confirm-main-submit-button"
          :loading="isSubmiLoading"
          round
        >提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import PackageItem from './common/OrderPackageItem'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
const COUNT_REG = /^[0-9]*[1-9][0-9]*$/
export default {
  name: 'OrderConfirm',
  components: {
    PackageItem
  },
  data() {
    return {
      isLoading: true,
      count: 1,
      isSubmiLoading: false
    }
  },
  methods: {
    ...mapActions({
      createTradeOrder: 'account/createTradeOrder',
      getDiscounts: 'account/getDiscounts'
    })
  },
  async mounted() {
    document.title = '确认订单'
    const { type, count = 1, id } = this.$route.query
    console.warn(`type: ${type}, count: ${count}, goodsId: ${id}`)
    if (_.isNumber(count) && count > 1 && COUNT_REG.test(count)) {
      this.count = count
    }
    if (!type || !id) {
      return this.$message.error('缺少必要参数')
    }
    await Promise.all([
      this.getDiscounts(),
      this.createTradeOrder({ type, count, goodsId: id })
    ])
    this.isLoading = false
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      tradeOrder: 'account/tradeOrder'
    }),
    username() {
      return _.get(this.userProfile, 'username', '')
    },
    goodsType() {
      return _.get(this.tradeOrder, 'type', '')
    },
    goodsDetail() {
      return _.get(this.tradeOrder, 'goodsDetail', {})
    },
    isPackageType() {
      return this.goodsType === 'package'
    },
    isExchangeType() {
      return this.goodsType === 'exchange'
    },
    isDisabledCount() {
      return false
    }
  },
}
</script>



<style lang="scss">
.order-confirm {
  &-header {
    background: url("../../assets/account/confirm-bg.jpg");
    background-repeat: repeat-x;
    height: 170px;
    &-center {
      max-width: 1145px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      padding-left: 40px;
      &-title {
        font-size: 20px;
        color: #333;
      }
      &-username {
        margin-top: 14px;
        margin-bottom: 25px;
        font-size: 14px;
        color: #666;
      }
    }
  }

  &-main {
    background: #fff;
    box-shadow: 0px 10px 12px 0px rgba(1, 32, 45, 0.08);
    width: 1145px;
    min-height: 577px;
    border-radius: 8px;
    margin: -46px auto 0;
    box-sizing: border-box;
    padding: 0 40px;
    overflow: hidden;
    &-title {
      height: 74px;
      line-height: 74px;
    }
    &-item {
      min-width: 140px;
    }
    &-count {
      min-height: 93px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      &-title {
        min-width: 60px;
        color: #666;
      }
      &-input {
        flex: 1;
      }
      &-total {
        min-width: 100px;
      }
    }
    &-discounts {
      min-height: 93px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      &-title {
        color: #333;
        min-width: 100px;
      }
      &-checked {
        color: #999;
        flex: 1;
      }
      &-all {
        min-width: 100px;
        color: #999;
        cursor: pointer;
      }
    }
    &-submit {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      min-height: 188px;
      &-total {
        &-title {
          font-size: 14px;
          color: #666;
          margin-right: 2em;
        }
        &-cost {
          font-size: 24px;
          color: #f20d0d;
        }
      }
      &-button {
        margin-top: 30px;
        background-color: #f20d0d;
        border-color: #f20d0d;
        padding: 12px 44px;
      }
    }
  }
}
</style>

