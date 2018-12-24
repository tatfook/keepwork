<template>
  <div class="order-completion">
    <img
      class="order-completion-icon"
      src="../../assets/account/order-completion.png"
      alt="order-completion-icon"
    >
    <div class="order-completion-title">支付成功</div>
    <div class="order-completion-cost"></div>
    <div class="order-completion-discount">
      使用了XX优惠卷
      <span>点击查看</span>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'OrderCompletion',
  mounted() {
    document.title = '订单完成'
  },
  computed: {
    ...mapGetters({
      tradeOrder: 'account/tradeOrder'
    }),
    finalCostByUnit() {
      return this.tradeOrder.finalCostByUnit
    }
  }
}
</script>

<style lang="scss">
</style>


