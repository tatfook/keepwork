<template>
  <div class="recharge-dialog-pay">
    <recharge-qr size="mini"></recharge-qr>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import RechargeQr from './RechargeQr'
export default {
  name: 'RechargeDialogPay',
  components: {
    RechargeQr
  },
  data() {
    return {
      _interval: null
    }
  },
  mounted() {
    this.orderId && this.intervalCheckOrder()
  },
  destroyed() {
    clearTimeout(this._interval)
  },
  computed: {
    ...mapGetters({
      rechargeOrder: 'account/rechargeOrder',
      userProfile: 'user/profile'
    }),
    username() {
      return this.userProfile.username || ''
    },
    rechargeMoney() {
      return this.rechargeOrder.amount
    },
    orderId() {
      return this.rechargeOrder.id || ''
    }
  },
  methods: {
    ...mapActions({
      getRechargeOrderState: 'account/getRechargeOrderState',
      clearRechargeOrderRecord: 'account/clearRechargeOrderRecord',
      getBalance: 'account/getBalance'
    }),
    intervalCheckOrder() {
      clearTimeout(this._interval)
      this._interval = setTimeout(async () => {
        const order = await this.getRechargeOrderState({ id: this.orderId })
        if (order.state === 256) {
          await this.getBalance().catch(e => console.error(e))
          this.$message({
            type: 'success',
            message: '支付成功'
          })
          setTimeout(() => {
            this.$emit('handleCallback')
          }, 1500)
          return
        }
        this.intervalCheckOrder()
      }, 2000)
    }
  }
}
</script>

<style lang="scss">
</style>

