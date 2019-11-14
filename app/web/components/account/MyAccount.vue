<template>
  <div class="account-detail">
    <div class="account-detail-header">{{$t('account.myAccount')}}</div>
    <div class="account-detail-item">
      <div class="account-detail-item-name">{{$t('account.userRmb')}}</div>
      <div class="account-detail-item-count">{{rmb}}</div>
      <el-button type="primary" class="account-detail-item-button" @click="toRechargeConfirm">{{$t('account.topUp')}}</el-button>
    </div>
    <div class="account-detail-item">
      <div class="account-detail-item-name">{{$t('account.userCoin')}}</div>
      <div class="account-detail-item-count">{{coin}}</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'MyAccount',
  mounted() {
    this.getBalance()
  },
  computed: {
    ...mapGetters({
      balance: 'account/balance'
    }),
    _rmb() {
      return this.balance.rmb || 0
    },
    rmb() {
      return this._rmb.toFixed(2)
    },
    coin() {
      return this.balance.coin || 0
    }
  },
  methods: {
    ...mapActions({
      getBalance: 'account/getBalance'
    }),
    toRechargeConfirm() {
      this.$router.push({ name: 'RechargeConfirm' })
    }
  }
}
</script>

<style lang="scss">
.account-detail {
  flex: 1;
  background: #fff;
  padding-bottom: 77px;
  &-header {
    height: 61px;
    line-height: 61px;
    color: #303133;
    padding: 0 28px;
    border-bottom: 1px solid #e8e8e8;
  }

  &-item {
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 28px;
    padding: 20px 0;
    &-name {
      width: 390px;
      color: #808080;
      font-size: 15px;
    }
    &-count {
      flex: 1;
      font-size: 24px;
      color: #404144;
    }
    &-button {
      padding: 10px 20px;
      width: 100px;
    }
  }
}
</style>


