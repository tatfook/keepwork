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
      <div class="recharge-confirm-message-row">充值金额: <span class="message-bold">{{money}}元</span> </div>
    </div>
    <div class="recharge-confirm-line">
      <div class="line-1px"></div>
    </div>
    <div
      v-if="isWeixin"
      class="recharge-confirm-way"
    >
      请使用微信支付:
    </div>
    <div
      v-if="isZhifubao"
      class="recharge-confirm-way"
    >
      请使用支付宝支付: 
    </div>
    <div class="recharge-confirm-main">
      <div class="recharge-confirm-main-content">
        <div class="recharge-confirm-main-content-qr">
          <div v-if="isOrderSuccess" class="recharge-confirm-main-content-qr-success">
            <i class="el-icon-success"></i>
            支付成功
          </div>
          <img
            v-if="qrData && !isOrderSuccess"
            :src="qrData"
          >
        </div>
        <div class="recharge-confirm-main-content-tips">
          <div class="recharge-confirm-main-content-tips-money">
            充值金额: <span class="highlight">{{ money }}元</span>
          </div>
          <div class="recharge-confirm-main-content-tips-app">
            <p v-if="isWeixin">请用微信扫一扫</p>
            <p v-if="isZhifubao">请用支付宝扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
        </div>
        <div :class="['recharge-confirm-main-content-guide', {'zhifubao-guide': isZhifubao, 'weixin-guide': isWeixin}]">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'RechargeConfirm',
  data() {
    return {
      _interval: null
    }
  },
  mounted() {
    if (!this.orderId) {
      return this.$router.push({ name: 'Recharge' })
    }
    this.intervalCheckOrder()
  },
  destroyed() {
    this.clearRechargeOrderRecord()
    clearTimeout(this._interval)
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
        let order = await this.getRechargeOrderState({ id: this.orderId })
        if (order.state === 256) {
          await this.getBalance().catch(e => console.error(e))
          // setTimeout(() => this.$router.push({ name: 'Account' }), 10000)
          return
        }
        this.intervalCheckOrder()
      }, 2000)
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      order: 'account/rechargeOrder',
    }),
    orderState() {
      return this.order.state
    },
    isOrderSuccess() {
      return this.orderState === 256
    },
    orderId() {
      return this.order.id || ''
    },
    isWeixin() {
      return this.channel === 'wx_pub_qr'
    },
    isZhifubao() {
      return this.channel === 'alipay_qr'
    },
    channel() {
      return this.order.channel
    },
    qrData() {
      return this.order.QR || ''
    },
    money() {
      return this.order.amount || ''
    },
    username() {
      return this.userProfile.username || ''
    }
  }
}
</script>

<style lang="scss">
.recharge-confirm {
  max-width: 1230px;
  margin: 0 auto;
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
        display: flex;
        justify-content: center;
        align-items: center;
        background: url("../../assets/account/qr-bg.png");
        &-success {
          color: #67C23A;
          font-size: 28px;
        }
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


