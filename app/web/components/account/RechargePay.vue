<template>
  <div class="recharge-pay">
    <div class="recharge-pay-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Account' }">{{$t('account.myAccount')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('account.recharge')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <recharge-qr></recharge-qr>
  </div>
</template>

<script>
import RechargeQr from './common/RechargeQr'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'RechargePay',
  components: {
    RechargeQr
  },
  data() {
    return {
      _interval: null
    }
  },
  mounted() {
    if (!this.orderId) {
      this.$message.error('找不到订单号')
      setTimeout(() => {
        this.$router.push({ name: 'RechargeConfirm' })
      }, 1500)
      return
    }
    this.intervalCheckOrder()
  },
  destroyed() {
    clearTimeout(this._interval)
  },
  computed: {
    ...mapGetters({
      order: 'account/rechargeOrder'
    }),
    orderId() {
      return this.order.id || ''
    }
  },
  methods: {
    ...mapActions({
      getRechargeOrderState: 'account/getRechargeOrderState',
      getBalance: 'account/getBalance'
    }),
    intervalCheckOrder() {
      clearTimeout(this._interval)
      this._interval = setTimeout(async () => {
        const order = await this.getRechargeOrderState({ id: this.orderId })
        if (order.state === 256) {
          await this.getBalance().catch(e => console.error(e))
          this.$router.push({ name: 'RechargeSuccess' })
          return
        }
        this.intervalCheckOrder()
      }, 2000)
    }
  }
}
</script>

<style lang="scss">
.recharge-pay {
  max-width: 1230px;
  margin: 0 auto;
  &-breadcrumb {
    margin: 22px 0;
  }
}
</style>


