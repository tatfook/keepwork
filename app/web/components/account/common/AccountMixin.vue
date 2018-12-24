<script>
import UnitMixin from './UnitMixin'
export default {
  mixins: [UnitMixin],
  computed: {
    finalCost() {
      return this.tradeOrder.finalCost
    },
    finalCostByUnit() {
      return this.isRmbPayment
        ? `${this.costUnit} ${this.finalCost}`
        : `${this.finalCost} ${this.costUnit}`
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
    payment() {
      return this.tradeOrder.payment
    },
    isRmbPayment() {
      return this.payment === 'rmb'
    },
    isCoinPayment() {
      return this.payment === 'coin'
    },
    isBeanPayment() {
      return this.payment === 'bean'
    },
    userBalance() {
      return this.balance[this.payment]
    },
    userBalanceByUnit() {
      return this.isRmbPayment
        ? `${this.costUnit} ${this.userBalance}`
        : `${this.userBalance} ${this.costUnit}`
    },
    isNeedRecharge() {
      return this.finalCost > this.userBalance
    },
    needRechargeNumber() {
      return this.finalCost - this.userBalance
    }
  }
}
</script>
