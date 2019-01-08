<template>
  <div class="recharge-success">
    <img class="recharge-success-icon" src="../../assets/account/order-success.png" alt="recharge-success-icon">
    <div class="recharge-success-title">{{$t('account.rechargeSuccessfully')}}</div>
    <div class="recharge-success-cost">{{rechargeMoney}}</div>
    <div class="recharge-success-message">
      <sapn v-if="discountTitle"> {{$t('account.returnCoupon', { title: discountTitle })}}</sapn>
      <router-link class="recharge-success-message-link" :to="{ name: 'MyAccount'}">{{$t('account.viewMore')}}</router-link>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import { locale } from '@/lib/utils/i18n'
export default {
  name: 'RechargeSuccess',
  mounted() {
    if (_.isEmpty(this.rechargeOrder)) {
      return this.$router.push({ name: 'MyAccount' })
    }
  },
  destroyed() {
    this.clearRechargeOrderRecord()
  },
  computed: {
    ...mapGetters({
      rechargeOrder: 'account/rechargeOrder'
    }),
    isEn() {
      return locale === 'en-US'
    },
    rechargeMoney() {
      return `¥ ${_.get(this.rechargeOrder, 'amount', 0)}`
    },
    discountTitle() {
      return this.isEn
        ? _.get(this.rechargeOrder, 'discount.extra.enTitle', '')
        : _.get(this.rechargeOrder, 'discount.title', '')
    }
  },
  methods: {
    ...mapActions({
      clearRechargeOrderRecord: 'account/clearRechargeOrderRecord'
    })
  }
}
</script>

<style lang="scss">
.recharge-success {
  max-width: 1200px;
  min-height: 330px;
  margin: 20px auto;
  background: #fff;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &-icon {
    width: 104px;
    height: 104px;
  }

  &-title {
    font-size: 18px;
    color: #333;
  }

  &-cost {
    font-size: 26px;
    line-height: 24px;
    color: #f20d0d;
    margin-top: 24px;
  }
  &-message {
    margin-top: 10px;
    &-link {
      color: #409efe;
    }
  }
}
</style>


