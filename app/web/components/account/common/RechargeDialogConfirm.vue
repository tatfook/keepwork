<template>
  <div class="recharge-dialog-confirm">
    <div class="recharge-dialog-confirm-username">
      充值账号: <span class="bold-username">{{ username }}</span>
    </div>
    <div class="recharge-dialog-confirm-money">
      充值金额:
      <div class="recharge-dialog-confirm-money-tips">完成上笔支付还需: {{needRechargeMoney | formatMoney}}</div>
      <div class="recharge-dialog-confirm-money-input">
        ¥ <input
          class="recharge-dialog-confirm-money-input-inner"
          type="number"
          min="1"
          ref="inputMoney"
          autofocus="autofocus"
          v-model="inputMoney"
        >
      </div>
    </div>
    <payment-way
      size="mini"
      :handleCallback="confirmOrder"
    ></payment-way>
  </div>
</template>

<script>
import PaymentWay from './PaymentWay'
import { mapActions, mapGetters } from 'vuex'
const MONEY_REG = /^[0-9]*[1-9][0-9]*$/
const MAX_MONEY = 1000000
export default {
  name: 'RechargeDialogConfirm',
  props: {
    needRechargeMoney: Number,
  },
  data() {
    return {
      inputMoney: 50,
    }
  },
  filters: {
    formatMoney(value) {
      return `${value}.00`
    }
  },
  components: {
    PaymentWay
  },
  mounted() {
    this.inputMoney = this.needRechargeMoney
  },
  methods: {
    ...mapActions({
      createRechargeOrder: 'account/createRechargeOrder',
    }),
    async confirmOrder(channel) {
      if (!MONEY_REG.test(this.inputMoney)) {
        return this.$message.error('充值金额必须为正整数')
      }
      if (this.inputMoney > MAX_MONEY) {
        return this.$message.error('充值金额不能大于100万')
      }
      try {
        await this.createRechargeOrder({ amount: this.inputMoney, channel })
        this.$emit('handleCallback')
      } catch (error) {
        console.error(error)
        this.$message.error('创建订单失败')
      }
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
    }),
    username() {
      return this.userProfile.username || ''
    },
    CONF() {
      return {
        MAX_MONEY: 1000000
      }
    }
  }
}
</script>

<style lang="scss">
.recharge-dialog-confirm {
  &-username {
    font-size: 16px;
    color: #808080;
    .bold-username {
      color: #333;
    }
  }

  &-money {
    border-bottom: 1px solid #f3f3f3;
    margin-top: 22px;
    color: #808080;
    padding-bottom: 30px;
    margin-bottom: 26px;
    &-tips {
      color: #999;
      font-size: 14px;
      margin-top: 14px;
    }
    &-input {
      width: 145px;
      height: 80px;
      margin-top: 18px;
      line-height: 80px;
      font-size: 20px;
      text-align: center;
      border-radius: 4px;
      background: #f3f5f7;
      &-inner {
        border: none;
        border-bottom: 1px solid #333;
        background: none;
        font-size: 22px;
        width: 95px;
        text-align: center;
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
</style>


