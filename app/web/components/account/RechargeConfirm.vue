<template>
  <div class="recharge-confirm">
    <div class="recharge-confirm-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Account' }">我的账户</el-breadcrumb-item>
        <el-breadcrumb-item>充值</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="recharge-confirm-header">
      请确认
    </div>
    <div class="recharge-confirm-message">
      <div class="recharge-confirm-message-row">充值账号: <span class="message-bold">{{ username }}</span> </div>
      <div class="recharge-confirm-message-row">充值金额: <span class="message-bold">50元</span> </div>
    </div>
    <div class="recharge-confirm-line">
      <div class="line-1px"></div>
    </div>
    <div class="recharge-confirm-way">
      请使用支付宝支付:
    </div>
    <div class="recharge-confirm-main">
      <div class="recharge-confirm-main-content">
        <div class="recharge-confirm-main-content-qr"></div>
        <div class="recharge-confirm-main-content-tips">
          <div class="recharge-confirm-main-content-tips-money">
            充值金额: <span class="highlight">50元</span>
          </div>
          <div class="recharge-confirm-main-content-tips-app">
            <p>请用微信扫一扫</p>
            <!-- <p>请用支付宝扫一扫</p> -->
            <p>扫描二维码支付</p>
          </div>
        </div>
        <div class="recharge-confirm-main-content-guide zhifubao-guide">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'RechargeConfirm',
  computed: {
    ...mapGetters({
      userProfile: 'user/profile'
    }),
    username() {
      return _.get(this.userProfile, 'username', '')
    }
  }
}
</script>

<style lang="scss">
.recharge-confirm {
  &-breadcrumb {
    margin: 22px 0;
  }

  &-header {
    height: 61px;
    line-height: 61px;
    font-size: 20px;
    color: #333;
    background: #fff;
    border-bottom: 1px solid #f3f3f3;
    padding-left: 49px;
  }

  &-message {
    height: 132px;
    background: #fff;
    padding-left: 49px;
    color: #808080;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &-row {
      height: 40px;
      line-height: 40px;
    }
    .message-bold {
      margin-left: 2em;
      color: #333;
    }
  }

  &-line {
    height: 1px;
    background: #fff;
    .line-1px {
      margin: 0 49px;
      height: 1px;
      background: #f3f3f3;
    }
  }

  &-way {
    background: #fff;
    padding-left: 49px;
    height: 78px;
    line-height: 78px;
    font-size: 16px;
    color: #333;
  }

  &-main {
    background: #fff;
    padding: 0 49px 49px;

    &-content {
      background: #f2f9ff;
      min-height: 470px;
      min-width: 956px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      &-qr {
        margin-left: 67px;
        height: 288px;
        width: 288px;
        background: url("../../assets/account/qr-bg.png");
      }

      &-tips {
        color: #40444a;
        margin-left: 31px;
        &-money {
          font-size: 24px;
          border-bottom: 1px dashed #bec1c6;
          padding-bottom: 22px;
          .highlight {
            color: #409efe;
          }
        }
        &-app {
          margin-top: 22px;
          font-size: 18px;
          p {
            margin: 0;
            line-height: 28px;
            padding: 0;
          }
        }
      }

      &-guide {
        margin-left: 131px;
        height: 391px;
        width: 267px;
        &.weixin-guide {
          background: url("../../assets/account/weixin-guide.png");
        }
        &.zhifubao-guide {
          background: url("../../assets/account/zhifubao-guide.png");
        }
      }
    }
  }
}
</style>


