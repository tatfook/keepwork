<template>
  <div class="account-detail">
    <div class="account-detail-header">
      <span class="account-detail-header-title">
        {{$t('account.myAccount')}}
      </span>
      <el-popover placement="bottom" trigger="hover" width="450px" popper-class="account-detail-header-popover">
        <span slot="reference" class="account-detail-header-tips">
          <i class="account-detail-header-tips-icon el-icon-question"></i>
          {{$t('account.coinsTips')}}
        </span>
        <p>{{$t('account.coinsTips-1-title')}}</p>
        <p>{{$t('account.coinsTips-1-message')}}</p>
        <p>{{$t('account.coinsTips-2-title')}}</p>
        <p>{{$t('account.coinsTips-2-message')}}</p>
      </el-popover>
    </div>
    <div class="account-detail-item">
      <div class="account-detail-item-row">
        <div class="account-detail-item-row-col-name">{{$t('account.userRmb')}}</div>
        <div class="account-detail-item-row-col-count">{{rmb}}</div>
        <div class="account-detail-item-row-button">
          <el-button type="primary" class="account-item-button" @click="toRechargeConfirm">{{$t('account.topUp')}}</el-button>
        </div>
      </div>
    </div>

    <div class="account-detail-item">
      <div class="account-detail-item-row-top">
        <div class="account-detail-item-row-top-col-name">{{$t('account.userCoin')}}</div>
        <div class="account-detail-item-row-top-col-count">
          <span class="account-detail-item-row-top-col-count-number">{{coin}}</span>
          <span class="account-detail-item-row-top-col-count-lock">{{lockCoin}}<span class="account-detail-item-row-top-col-count-lock-tips">({{$t('account.locked')}})</span></span>
        </div>
        <div class="account-detail-item-row-button">
          <el-button type="primary" class="account-item-button" @click="toExchangeMall">{{$t('account.exchange')}}</el-button>
        </div>
      </div>
    </div>

    <div class="account-detail-item">
      <div class="account-detail-item-row">
        <div class="account-detail-item-row-col-name">{{$t('account.userBean')}}</div>
        <div class="account-detail-item-row-col-count">{{bean}}</div>
        <div class="account-detail-item-row-button">
          <el-button type="primary" class="account-item-button" @click="toExchangeMall">{{$t('account.exchange')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'MyAccount',
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
    },
    lockCoin() {
      return this.balance.lockCoin || 0
    },
    bean() {
      return this.balance.bean
    }
  },
  methods: {
    toRechargeConfirm() {
      this.$router.push({ name: 'RechargeConfirm' })
    },
    toExchangeMall() {
      this.$router.push({ name: 'ExchangeMall' })
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-tips {
      font-size: 13px;
      color: #55a7e8;
      cursor: pointer;
      &-icon {
        font-size: 16px;
        color: #ff9307;
      }
    }
    &-popover {
      width: 500px;
      padding: 20px 36px;
      font-size: 14px;
      color: #808080;
      &-title {
        color: #000;
      }
    }
  }

  &-item {
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 28px;
    padding: 20px 0;
    &-row {
      width: 100%;
      display: flex;
      align-items: center;
      &-col {
        &-name {
          flex: 1;
          color: #808080;
          font-size: 15px;
        }
        &-count {
          flex: 1;
          font-size: 24px;
          color: #404144;
        }
        &-lock {
          flex: 1;
          font-size: 24px;
          color: #bec1c6;
          margin-top: 10px;
          margin-bottom: 20px;
          &-tips {
            font-size: 14px;
            color: #bec1c6;
          }
        }
      }

      &-button {
        .account-item-button {
          padding: 10px 20px;
          width: 100px;
        }
      }
    }

    &-row-top {
      width: 100%;
      display: flex;
      &-col {
        &-name {
          flex: 1;
          color: #808080;
          font-size: 15px;
        }
        &-count {
          flex: 1;
          font-size: 24px;
          color: #404144;
          display: flex;
          flex-direction: column;
          &-lock {
            flex: 1;
            font-size: 24px;
            color: #bec1c6;
            margin-top: 10px;
            margin-bottom: 20px;
            &-tips {
              font-size: 14px;
              color: #bec1c6;
            }
          }
        }
      }
    }
  }
}
</style>


