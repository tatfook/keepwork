<template>
  <div class="recharge-page">
    <div class="recharge-page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Account' }">我的账户</el-breadcrumb-item>
        <el-breadcrumb-item>充值</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="recharge-page-header">
      充值账号: {{username}}
    </div>
    <div class="recharge-page-money">
      充值金额:
      <div class="recharge-page-money-options">
        <div
          :class="['recharge-page-money-options-card', { 'selected': isCard50 } ]"
          @click="handleSelectMoneyCard(CONF.CARD_50)"
        >
          50元
        </div>
        <div
          :class="['recharge-page-money-options-card', { 'selected': isCard100 } ]"
          @click="handleSelectMoneyCard(CONF.CARD_100)"
        >
          100元
        </div>
        <div
          :class="['recharge-page-money-options-card', { 'selected': isCard500 } ]"
          @click="handleSelectMoneyCard(CONF.CARD_500)"
        >
          500元
        </div>
        <div
          :class="['recharge-page-money-options-card', { 'selected': isCardOther } ]"
          @click="handleSelectMoneyCard(CONF.CARD_OTHER)"
        >
          <div
            class="recharge-page-money-options-card-input"
            v-show="isCardOther"
          >
            <input
              class="recharge-page-money-options-card-input-inner"
              type="number"
              min="1"
              ref="inputMoney"
              autofocus="autofocus"
              v-model="inputMoney"
            >
            元
          </div>
          <span v-show="!isCardOther">其他金额</span>
        </div>
      </div>
      <div class="recharge-page-money-tips">
        <i class="el-icon-warning"></i>
        充值金额必须为正整数，单次最多不超过100万元。
      </div>
    </div>
    <div class="recharge-page-way">
      支付方式:
      <div class="recharge-page-way-options">
        <span
          :class="['recharge-page-way-options-card', { 'selected': isWeixinPay }]"
          @click="handleSelectPayWay(CONF.WEIXIN_PAY)"
        >
          <span class="recharge-page-way-options-card-icon weixin-icon"></span>
          <span class="recharge-page-way-options-card-name">微信支付</span>
          <span
            class="recharge-page-way-options-card-selected-label"
            v-show="isWeixinPay"
          >
          </span>
        </span>
        <span
          :class="['recharge-page-way-options-card', { 'selected': isZhifubaoPay }]"
          @click="handleSelectPayWay(CONF.ZHIFUBAO_PAY)"
        >
          <span class="recharge-page-way-options-card-icon zhifubao-icon"></span>
          <span class="recharge-page-way-options-card-name">支付宝</span>
          <span
            class="recharge-page-way-options-card-selected-label"
            v-show="isZhifubaoPay"
          ></span>
        </span>
      </div>

      <div class="recharge-page-confirm">
        <el-button
          type="primary"
          class="recharge-page-confirm-button"
          @click="toComfirmPayPage"
          :loading="isCreateLoading"
        >立即充值</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
const MONEY_REG = /^[0-9]*[1-9][0-9]*$/
export default {
  name: 'RechargePage',
  data() {
    return {
      rechargeMoney: 0,
      inputMoney: '',
      moneyCard: '50',
      payWay: 'weixin',
      isCreateLoading: false
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile'
    }),
    username() {
      return this.userProfile.username || ''
    },
    isCard50() {
      return this.moneyCard === this.CONF.CARD_50
    },
    isCard100() {
      return this.moneyCard === this.CONF.CARD_100
    },
    isCard500() {
      return this.moneyCard === this.CONF.CARD_500
    },
    isCardOther() {
      return this.moneyCard === this.CONF.CARD_OTHER
    },
    isWeixinPay() {
      return this.payWay === this.CONF.WEIXIN_PAY
    },
    isZhifubaoPay() {
      return this.payWay === this.CONF.ZHIFUBAO_PAY
    },
    CONF() {
      return {
        WEIXIN_PAY: 'weixin',
        ZHIFUBAO_PAY: 'zhifubao',
        CARD_50: '50',
        CARD_100: '100',
        CARD_500: '500',
        CARD_OTHER: 'other',
        MAX_MONEY: 1000000
      }
    }
  },
  methods: {
    ...mapActions({
      createOrder: 'account/createOrder'
    }),
    handleSelectMoneyCard(type) {
      if (type !== this.moneyCard) {
        this.moneyCard = type
        this.inputMoney = ''
      }
      if (type === this.CONF.CARD_OTHER) {
        this.$nextTick(() => {
          this.$refs.inputMoney.focus()
        })
      }
    },
    handleSelectPayWay(way) {
      this.payWay = way
    },
    getRechargeMoney() {
      if (this.isCardOther) {
        return +this.inputMoney
      }
      return +this.CONF[`CARD_${this.moneyCard}`]
    },
    async toComfirmPayPage() {
      if (this.isCardOther && !MONEY_REG.test(this.inputMoney)) {
        return this.$message.error('充值金额必须为正整数')
      }
      const amount = this.getRechargeMoney()
      if (amount > this.CONF.MAX_MONEY) {
        return this.$message.error('充值金额不能大于100万')
      }
      const channel = this.isWeixinPay ? 'wx_pub_qr' : 'alipay_qr'
      try {
        this.isCreateLoading = true
        await this.createOrder({ amount, channel })
        this.$router.push({ name: 'RechargeConfirm' })
        this.isCreateLoading = false
      } catch (error) {
        this.isCreateLoading = false
        this.$message.error('创建订单失败')
      }

    }
  }
}
</script>

<style lang="scss">
.recharge-page {
  &-breadcrumb {
    margin: 22px 0;
  }
  &-header {
    height: 61px;
    line-height: 61px;
    font-size: 16px;
    color: #808080;
    background: #fff;
    border-bottom: 1px solid #f3f3f3;
    padding-left: 49px;
  }

  &-money {
    background: #fff;
    border-bottom: 1px solid #f3f3f3;
    padding: 25px 0 19px 49px;
    color: #808080;
    border-bottom: 1px solid #f3f3f3;
    &-options {
      display: flex;
      margin-top: 18px;
      &-card {
        height: 141px;
        width: 255px;
        min-width: 141px;
        box-sizing: border-box;
        border: 2px solid #c1c1c1;
        border-radius: 6px;
        font-size: 30px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        margin-right: 31px;
        cursor: pointer;
        &.selected {
          background: #65cad9;
          color: #fff;
          border: none;
        }
        &-input {
          width: 100%;
          text-align: center;
          &-inner {
            border: none;
            border-bottom: 3px solid #fff;
            background: none;
            font-size: 30px;
            max-width: 40%;
            text-align: center;
            color: #fff;
            display: inline-block;
            outline: none;
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
          }
        }
      }
    }
    &-tips {
      margin-top: 42px;
      font-size: 16px;
    }
  }

  &-way {
    background: #fff;
    padding: 22px 49px 20px;
    min-height: 400px;
    color: #808080;
    &-options {
      margin-top: 20px;
      &-card {
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
        height: 54px;
        width: 151px;
        margin-right: 46px;
        background: #f3f5f7;
        border-radius: 6px;
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        &.selected {
          border: 2px solid #409efe;
        }
        &-icon {
          display: inline-block;
          height: 30px;
          width: 30px;
          margin: 8px;
          &.zhifubao-icon {
            background: url("../../assets/account/zhifubao.png") no-repeat;
          }
          &.weixin-icon {
            background: url("../../assets/account/weixin.png") no-repeat;
          }
        }
        &-name {
          font-size: 16px;
          color: #333;
        }
        &-selected-label {
          display: block;
          height: 23px;
          width: 66px;
          transform: rotate(45deg);
          position: absolute;
          top: -9px;
          right: -28px;
          background: #409efe;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          &::after {
            content: " ";
            display: inline-block;
            border-right: 3px solid #fff;
            border-bottom: 3px solid #fff;
            border-radius: 2px;
            height: 16px;
            width: 5px;
          }
        }
      }
    }
  }

  &-confirm {
    margin-top: 38px;
    &-button {
      width: 329px;
      height: 43px;
      font-size: 18px;
    }
  }
}
</style>


