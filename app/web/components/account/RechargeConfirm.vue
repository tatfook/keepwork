<template>
  <div class="recharge-confirm">
    <div class="recharge-confirm-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Account' }">我的账户</el-breadcrumb-item>
        <el-breadcrumb-item>充值</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="recharge-confirm-header">
      充值账号: {{username}}
    </div>
    <div class="recharge-confirm-money">
      充值金额:
      <div class="recharge-confirm-money-options">
        <div
          :class="['recharge-confirm-money-options-card', { 'selected': isCard50 } ]"
          @click="handleSelectMoneyCard(CONF.CARD_50)"
        >
          50元
        </div>
        <div
          :class="['recharge-confirm-money-options-card', { 'selected': isCard100 } ]"
          @click="handleSelectMoneyCard(CONF.CARD_100)"
        >
          100元
        </div>
        <div
          :class="['recharge-confirm-money-options-card', { 'selected': isCard500 } ]"
          @click="handleSelectMoneyCard(CONF.CARD_500)"
        >
          500元
        </div>
        <div
          :class="['recharge-confirm-money-options-card', { 'selected': isCardOther } ]"
          @click="handleSelectMoneyCard(CONF.CARD_OTHER)"
        >
          <div
            class="recharge-confirm-money-options-card-input"
            v-show="isCardOther"
          >
            <input
              class="recharge-confirm-money-options-card-input-inner"
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
      <div class="recharge-confirm-money-tips">
        <i class="el-icon-warning"></i>
        充值金额必须为正整数，单次最多不超过100万元。
      </div>
    </div>
    <payment-way
      class="recharge-confirm-payment"
      :handleCallback="toComfirmPayPage"
    ></payment-way>
  </div>
</template>

<script>
import PaymentWay from './common/PaymentWay'
import { mapGetters, mapActions } from 'vuex'
const MONEY_REG = /^[0-9]*[1-9][0-9]*$/
export default {
  name: 'RechargeConfirm',
  components: {
    PaymentWay
  },
  data() {
    return {
      rechargeMoney: 0,
      inputMoney: '',
      moneyCard: '50',
      payWay: 'weixin',
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
      createRechargeOrder: 'account/createRechargeOrder'
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
    async toComfirmPayPage(channel) {
      if (this.isCardOther && !MONEY_REG.test(this.inputMoney)) {
        return this.$message.error('充值金额必须为正整数')
      }
      const amount = this.getRechargeMoney()
      if (amount > this.CONF.MAX_MONEY) {
        return this.$message.error('充值金额不能大于100万')
      }
      try {
        await this.createRechargeOrder({ amount, channel })
        this.$router.push({ name: 'RechargePay' })
      } catch (error) {
        console.error(error)
        this.$message.error('创建订单失败')
      }
    }
  }
}
</script>

<style lang="scss">
.recharge-confirm {
  max-width: 1230px;
  margin: 0 auto;
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
            max-width: 50%;
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

  &-payment {
    padding: 22px 49px 20px;
    min-height: 400px;
  }
}
</style>


