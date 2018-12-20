<template>
  <div class="recharge-dialog">
    <recharge-dialog-pay @handleCallback="handleCallback" v-if="hasRechargeOrder"></recharge-dialog-pay>
    <recharge-dialog-confirm
      v-else
      :needRechargeMoney="needRechargeMoney"
    ></recharge-dialog-confirm>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import RechargeDialogConfirm from './RechargeDialogConfirm'
import RechargeDialogPay from './RechargeDialogPay'
import _ from 'lodash'
export default {
  name: 'RechargeDialog',
  props: {
    needRechargeMoney: {
      type: Number,
      required: true
    }
  },
  components: {
    RechargeDialogConfirm,
    RechargeDialogPay
  },
  destroyed() {
    this.clearRechargeOrderRecord()
  },
  methods: {
    ...mapActions({
      clearRechargeOrderRecord: 'account/clearRechargeOrderRecord'
    }),
    handleCallback() {
      this.$emit('handleCallback')
    }
  },
  computed: {
    ...mapGetters({
      rechargeOrder: 'account/rechargeOrder'
    }),
    hasRechargeOrder() {
      return !_.isEmpty(this.rechargeOrder)
    }
  },
}
</script>

<style lang="scss">
</style>


