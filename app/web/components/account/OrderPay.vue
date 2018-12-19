<template>
  <div class="order-pay">
    <div class="order-pay-header">
      <div
        class="order-pay-header-back"
        @click="handleBack"
      > <i class="el-icon-arrow-left"></i>返回</div>
      <div class="order-pay-header-cost">
        待支付: <span class="money">{{finalCostByUnit}}</span>
      </div>
    </div>
    <div class="order-pay-main">
      使用账户余额支付：
      <div class="order-pay-main-balance">
        <span class="order-pay-main-balance-title">我的账户余额:</span>
        <span class="order-pay-main-balance-count">
          {{userBalanceByUnit}}
        </span>
      </div>
      <div class="order-pay-main-tips">
        <i class="order-pay-main-tips-icon el-icon-warning"></i>
        <span class="order-pay-main-tips-text">人民币余额不足，还需要
          {{needRechargeNumberByUnit}}
          ，请先去充值。</span>
      </div>
      <el-button
        v-if="!isNeedRecharge"
        type="primary"
        class="order-pay-main-confirm-button"
      >确认支付</el-button>
      <el-button
        v-if="isNeedRecharge"
        type="primary"
        class="order-pay-main-confirm-button"
      >去充值</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { locale } from "@/lib/utils/i18n";
export default {
  name: 'OrderPay',
  mounted() {
    document.title = '支付页面'
  },
  computed: {
    ...mapGetters({
      tradeOrder: 'account/tradeOrder',
      balance: 'account/balance'
    }),
    isEn() {
      return locale === 'en-US'
    },
    finalCost() {
      return this.tradeOrder.finalCost
    },
    finalCostByUnit() {
      return this.isRmbPayment ? `${this.costUnit}${this.finalCost}` : `${this.finalCost}${this.costUnit}`
    },
    userRmb() {
      return this.balance.rmb
    },
    userCoin() {
      return this.balance.coin
    },
    userBean() {
      return this.balance.bean
    },
    unitTable() {
      return this.isEn ? {
        rmb: 'rmb',
        coin: 'coin',
        bean: 'bean'
      } : {
          rmb: '￥',
          coin: '知识币',
          bean: '知识豆'
        }
    },
    costUnit() {
      return this.unitTable[this.paymentWay]
    },
    paymentWay() {
      return this.tradeOrder.paymentWay || 'rmb'
    },
    isRmbPayment() {
      return this.paymentWay === 'rmb'
    },
    userBalance() {
      return this.balance[this.paymentWay]
    },
    userBalanceByUnit() {
      return this.isRmbPayment ? `${this.costUnit}${this.userBalance}` : `${this.userBalance}${this.costUnit}`
    },
    isNeedRecharge() {
      return this.finalCost > this.userBalance
    },
    needRechargeNumber() {
      return this.finalCost - this.userBalance
    },
    needRechargeNumberByUnit() {
      return this.isRmbPayment ? `${this.costUnit}${this.needRechargeNumber}` : `${this.needRechargeNumber}${this.costUnit}`
    }
  },
  methods: {
    ...mapActions({
      payTradeOrder: 'account/payTradeOrder',
      getBalance: 'account/getBalance'
    }),
    handleBack() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss">
.order-pay {
  max-width: 1230px;
  margin: 20px auto;

  &-header {
    height: 123px;
    background: #fff;
    padding-left: 50px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #808080;
    font-size: 16px;
    &-back {
      cursor: pointer;
    }
    &-cost {
      margin-top: 14px;
      .money {
        font-size: 24px;
        color: #f20d0d;
      }
    }
  }

  &-main {
    margin-top: 10px;
    background: #fff;
    padding: 30px 50px;
    color: #808080;

    &-balance {
      width: 306px;
      min-height: 65px;
      line-height: 65px;
      box-sizing: border-box;
      margin-top: 20px;
      padding-left: 20px;
      background: #f6f6f6;
      color: #333;
      &-title {
        margin-right: 10px;
      }
      &-count {
        color: #409efe;
      }
    }

    &-tips {
      margin-top: 24px;
      &-icon {
        color: #fe8d00;
      }
      &-text {
        color: #fe628f;
        font-size: 14px;
      }
    }

    &-cost {
      line-height: 182px;
      margin-top: 20px;
      box-sizing: border-box;
      text-align: center;
      vertical-align: middle;
      border-radius: 4px;
      border: 8px solid #f2f4f4;
      &.error {
        border-color: #ff5786;
      }
      &-money {
        color: #3a3e43;
        font-size: 40px;
      }
      &-unit {
        color: #3a3e43;
        font-size: 18px;
        vertical-align: bottom;
      }
    }

    &-confirm-button {
      width: 306px;
      margin-top: 50px;
    }
  }
}
</style>


