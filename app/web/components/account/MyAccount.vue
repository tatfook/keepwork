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
    <div class="account-detail-row">
      <span class="account-detail-row-name">
        余额(元)
      </span>
      <span class="account-detail-row-count">
        200.0
      </span>
      <el-button>去冲值</el-button>
    </div>
    <div class="account-detail-row">
      <span class="account-detail-row-name">
        知识币(个)
      </span>
      <span class="account-detail-row-count">
        200.0
      </span>
      <el-button>去兑换</el-button>
    </div>
    <div class="account-detail-row">
      <span class="account-detail-row-name">
        知识豆(个)
      </span>
      <span class="account-detail-row-count">
        200.0
      </span>
      <el-button>去兑换</el-button>
    </div>
  </div>
</template>


<script>
import AccountTab from '@/components/account/common/AccountTab'
export default {
  name: 'MyAccount',
  components: {
    AccountTab
  }

}
</script>

<style lang="scss">
.account-container {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
  display: flex;
  .account-tab {
    width: 260px;
  }
  .account-detail {
    flex: 1;
    margin-left: 20px;
    background: #fff;
    &-header {
      height: 61px;
      line-height: 61px;
      color: #303133;
      padding: 0 2em;
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

    &-row {
      min-height: 80px;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      padding: 0 2em;
      align-items: center;
      &-name {
        flex:1
      }
      &-count {
        flex:1;
      }

    }
  }
}
</style>


