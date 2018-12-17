<template>
  <div class="account-detail">
    <div class="account-detail-header">
      <span class="account-detail-header-title">
        我的账户
      </span>
      <el-popover
        placement="bottom"
        trigger="hover"
        content="假装有知识币说明"
      >
        <span
          slot="reference"
          class="account-detail-header-tips"
        >
          <i class="account-detail-header-tips-icon el-icon-question"></i>
          了解知识币、知识豆
        </span>
      </el-popover>
    </div>
    <div class="account-detail-item">
      <div class="account-detail-item-row">
        <div class="account-detail-item-row-col name">余额(元)</div>
        <div class="account-detail-item-row-col count">{{rmb}}</div>
        <div class="account-detail-item-row-button">
          <el-button
            type="primary"
            class="account-item-button"
            @click="toRechargePage"
          >去充值</el-button>
        </div>
      </div>
    </div>

    <div class="account-detail-item">
      <div class="account-detail-item-row">
        <div class="account-detail-item-row-col name">知识币(个)</div>
        <div class="account-detail-item-row-col count">{{coin}}</div>
        <div class="account-detail-item-row-button">
          <el-button
            type="primary"
            class="account-item-button"
          >去兑换</el-button>
        </div>
      </div>
      <div class="account-detail-item-row">
        <div class="account-detail-item-row-col"></div>
        <div class="account-detail-item-row-col lock">{{lockCoin}}<span class="lock-tips">(待解锁)</span></div>
        <div class="account-detail-item-row-button lock">
          <el-button
            type="primary"
            class="account-item-button"
          >去兑换</el-button>
        </div>
      </div>
    </div>

    <div class="account-detail-item">
      <div class="account-detail-item-row">
        <div class="account-detail-item-row-col name">知识豆(个)</div>
        <div class="account-detail-item-row-col count">{{bean}}</div>
        <div class="account-detail-item-row-button">
          <el-button
            type="primary"
            class="account-item-button"
          >去兑换</el-button>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import AccountTab from '@/components/account/common/AccountTab'
import { mapGetters } from 'vuex'
export default {
  name: 'MyAccount',
  components: {
    AccountTab
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
    },
    lockCoin() {
      return this.balance.lockCoin || 0
    },
    bean() {
      return this.balance.bean
    }
  },
  methods: {
    toRechargePage() {
      this.$router.push({ name: 'Recharge' })
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
  }

  &-item {
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // min-height: 80px;
    margin: 0 28px;
    padding: 20px 0;
    &-row {
      width: 100%;
      display: flex;
      align-items: center;
      &-col {
        flex: 1;
        &.name {
          color: #808080;
          font-size: 15px;
        }
        &.count {
          font-size: 24px;
          color: #404144;
        }
        &.lock {
          // text-align: center;
          font-size: 24px;
          color: #bec1c6;
          margin-top: 10px;
          margin-bottom: 20px;
        }
        .lock-tips {
          font-size: 14px;
          color: #bec1c6;
        }
      }

      &-button {
        .account-item-button {
          padding: 10px 20px;
        }

        &.lock {
          visibility: hidden;
        }
      }
    }
  }
}
</style>


