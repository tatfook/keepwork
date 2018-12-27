<template>
  <div class="order-pay">
    <div class="order-pay-header">
      <div class="order-pay-header-back" @click="handleBack"> <i class="el-icon-arrow-left"></i>{{$t('account.back')}}</div>
      <div class="order-pay-header-cost">
       {{$t('account.needPay')}}<span class="order-pay-header-cost-money">{{finalCostByUnit}}</span>
      </div>
    </div>
    <div class="order-pay-main">
     {{$t('account.useBalanceToPay')}} 
      <div class="order-pay-main-balance">
        <span class="order-pay-main-balance-title">{{$t('account.myBalance')}} </span>
        <span class="order-pay-main-balance-count">
          {{userBalanceByUnit}}
        </span>
      </div>
      <div class="order-pay-main-tips" v-if="isNeedRecharge">
        <i class="order-pay-main-tips-icon el-icon-warning"></i>
        <span class="order-pay-main-tips-text">
          {{$t('account.lackMoney', { money: needRechargeNumberByUnit})}}
        </span>
      </div>
      <div v-if="isNeedVerify" class="order-pay-main-verify">
        <div class="order-pay-main-verify-cellphone">
         {{$t('account.phoneNumber')}} 
          <span class="order-pay-main-verify-cellphone-binding" v-if="isBinding">
            {{ cellphone }}
          </span>
          <span class="order-pay-main-verify-cellphone-unbound" v-else>
          {{$t('user.phoneNotBound')}} ，<span class="link" @click="handleToBindPage">{{$t('account.toBind')}}</span>
          </span>
        </div>
        <div v-if="isRmbPayment" class="order-pay-main-verify-code">
          <el-input :class="['order-pay-main-verify-code-input', { 'error': isCodeError }]" :placeholder="$t('account.enterCode')" v-model="captcha" @focus="resetError"></el-input>
          <span v-if="isWaiting" class="order-pay-main-verify-code-wait">{{waitingTime}}{{$t('user.countResend')}}</span>
          <span v-else @click="handleSendCode" :class="['order-pay-main-verify-code-send', { 'disabled': isDisabled }]"> {{$t('account.sendCode')}}</span>
        </div>
        <div v-if="isCodeError" class="order-pay-main-verify-code-error">
          <span v-if="isCodeEmpty">{{$t('account.enterCode')}} </span>
          <span v-if="isCodeWrong">{{$t('account.codeError')}} </span>
        </div>
      </div>
      <el-button v-if="isNeedRecharge" type="primary" class="order-pay-main-confirm-button" @click="handleShowRechargeDialog"> {{$t('account.topUp')}}</el-button>
      <el-button v-else :loading="isLoading" :disabled="isDisabled" type="primary" :class="['order-pay-main-confirm-button', { 'disabled': isDisabled }]" @click="handleConfirmToPay">{{$t('account.payNow')}}</el-button>
    </div>
    <el-dialog class="order-pay-main-dialog" :visible.sync="isShowRechargeDialog">
      <div class="order-pay-main-dialog-title" slot="title"> {{$t('account.recharge')}}</div>
      <recharge-dialog :needRechargeMoney="needRechargeNumber" v-if="isShowRechargeDialog" @handleCallback="handleHideRechargeDialog"></recharge-dialog>
    </el-dialog>
  </div>
</template>

<script>
import RechargeDialog from './common/RechargeDialog'
import { mapActions, mapGetters } from 'vuex'
import OrderMixin from './common/OrderMixin'
import { keepwork } from '@/api'
import _ from 'lodash'
export default {
  name: 'OrderPay',
  mixins: [OrderMixin],
  components: {
    RechargeDialog
  },
  data() {
    return {
      isShowRechargeDialog: false,
      timer: null,
      waitingTime: 0,
      isCodeEmpty: false,
      isCodeWrong: false,
      captcha: '',
      isLoading: false
    }
  },
  mounted() {
    if (_.isEmpty(this.tradeOrder)) {
      return this.$router.push({ name: 'MyAccount' })
    }
  },
  computed: {
    ...mapGetters({
      tradeOrder: 'account/tradeOrder',
      balance: 'account/balance',
      userProfile: 'user/profile'
    }),
    isCodeError() {
      return this.isCodeEmpty || this.isCodeWrong
    },
    cellphone() {
      return this.userProfile.cellphone
    },
    isBinding() {
      return Boolean(this.cellphone)
    },
    isDisabled() {
      return !this.isBinding && this.finalCost > 200
    },
    finalCost() {
      return this.tradeOrder.finalCost
    },
    finalCostByUnit() {
      return this.isRmbPayment
        ? `${this.costUnit}${this.finalCost}`
        : `${this.finalCost}${this.costUnit}`
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
    userBalance() {
      return this.balance[this.payment]
    },
    userBalanceByUnit() {
      return this.isRmbPayment
        ? ` ${this.costUnit}${this.userBalance}`
        : ` ${this.userBalance}${this.costUnit}`
    },
    isNeedRecharge() {
      return this.finalCost > this.userBalance
    },
    needRechargeNumber() {
      return this.finalCost - this.userBalance
    },
    needRechargeNumberByUnit() {
      return this.isRmbPayment
        ? ` ${this.costUnit}${this.needRechargeNumber}`
        : ` ${this.needRechargeNumber}${this.costUnit}`
    },
    isWaiting() {
      return this.waitingTime > 0
    },
    isNeedVerify() {
      return this.isRmbPayment && !this.isNeedRecharge && this.finalCost > 200
    }
  },
  methods: {
    ...mapActions({
      payTradeOrder: 'account/payTradeOrder',
      getBalance: 'account/getBalance',
    }),
    resetError() {
      this.isCodeWrong = false
      this.isCodeEmpty = false
    },
    handleBack() {
      this.$router.back(-1)
    },
    handleShowRechargeDialog() {
      this.isShowRechargeDialog = true
    },
    handleHideRechargeDialog() {
      this.isShowRechargeDialog = false
    },
    waitAMiniute() {
      clearInterval(this.timer)
      this.waitingTime = 60
      this.timer = setInterval(() => {
        if (--this.waitingTime <= 0) {
          clearInterval(this.timer)
          this.waitingTime = 0
        }
      }, 1000)
    },
    async handleSendCode() {
      if (this.isBinding && this.waitingTime === 0) {
        try {
          await keepwork.user.verifyCellphoneOne({ cellphone: this.cellphone })
          this.waitAMiniute()
          this.$message({
            type: 'success',
            message: '发送成功'
          })
        } catch (error) {
          console.error(error)
          this.$message.error('发送验证码失败')
        }
      }
    },
    handleToBindPage() {
      window.location.href = `${window.location.origin}/u/p/thirdPartyAccountBinding`
    },
    async handleConfirmToPay() {
      if (this.isNeedVerify && !this.captcha) {
        return (this.isCodeEmpty = true)
      }
      const { id, finalCost, payment, count, type = 0, goodsDetail, subject = '', user_nid = '' } = this.tradeOrder
      let payload = {
        type,
        rmb: 0,
        bean: 0,
        coin: 0,
        count,
        catch: this.captcha,
        [this.payment]: goodsDetail[this.payment],
        finalCostByUnit: this.finalCostByUnit
      }
      if (type === 2) {
        // package
        payload = {
          ...payload,
          goodsId: 1,
          subject,
          extra: {
            packageId: id
          }
        }
      }
      if (type === 1) {
        // exchange
        payload = {
          goodsId: id,
          ...payload,
          extra: {
            user_nid
          }
        }
      }
      this.isLoading = true
      this.payTradeOrder(payload)
        .then(res => {
          this.$router.push({ name: 'OrderSuccess' })
          this.$message({
            type: 'success',
            message: this.$t('account.successfullyPaid')
          })
          this.isLoading = false
        })
        .catch(e => {
          const code = _.get(e, 'response.data.code', '')
          if (code === 5) {
            this.isCodeWrong = true
          }else {
            this.$message.error(this.$t('account.failPaid'))
          }
          this.isLoading = false
        })
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
      &-money {
        margin-left: 20px;
        font-size: 24px;
        color: #f20d0d;
      }
    }
  }

  &-main {
    margin-top: 10px;
    background: #fff;
    padding: 30px 50px 250px;
    color: #808080;
    box-sizing: border-box;
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
      margin-bottom: 24px;
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

    &-verify {
      margin-top: 42px;
      height: 130px;
      &-cellphone {
        &-binding {
          color: #808080;
        }
        &-unbound {
          color: #fe628f;
          .link {
            display: inline-block;
            border-bottom: 1px solid #fe628f;
            cursor: pointer;
          }
        }
      }
      &-code {
        margin-top: 16px;
        box-sizing: border-box;
        &-input {
          box-sizing: border-box;
          width: 305px;
          height: 31px;
          &.error {
            .el-input__inner {
              border-color: #f56c6c;
            }
          }
        }
        &-send {
          margin-left: 20px;
          color: #409efe;
          cursor: pointer;
          &.disabled {
            color: #d2d2d2;
            cursor: not-allowed;
          }
        }
        &-wait {
          margin-left: 20px;
          cursor: not-allowed;
          color: #d2d2d2;
        }

        &-error {
          margin-top: 10px;
          color: #f56c6c;
        }
      }
    }

    &-confirm-button {
      width: 306px;
      margin-top: 30px;
      &.disabled {
        background: #eeeeee;
        color: #bfbfbf;
        border-color: #eeeeee;
        &:hover {
          background: #eeeeee;
          color: #bfbfbf;
          border-color: #eeeeee;
        }
      }
    }

    &-dialog {
      .el-dialog {
        width: 737px;
        margin-top: 10vh;
      }
      .el-dialog__header {
        padding: 0;
      }
      .el-dialog__body {
        padding: 35px 50px;
        box-sizing: border-box;
      }
      &-title {
        border-bottom: 1px solid #f7f7f7;
        text-align: center;
        height: 73px;
        line-height: 73px;
        font-size: 20px;
        color: #333;
      }
    }
  }
}
</style>


