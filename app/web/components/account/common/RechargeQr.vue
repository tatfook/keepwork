<template>
  <div :class="['recharge-qr', { 'mini': isMiniSize }]">
    <div class="recharge-qr-header">
      {{$t('account.pleaseConfirm')}}
    </div>
    <div class="recharge-qr-container">
      <div class="recharge-qr-message">
        <div class="recharge-qr-message-row">{{$t('account.rechargeAccount')}}<span class="message-bold">{{ username }}</span> </div>
        <div class="recharge-qr-message-row">{{$t('account.rechargeMoney')}} <span class="message-bold">{{$t('account.rmbUnit', { money: money })}}</span> </div>
      </div>
      <div v-if="isWeixin" class="recharge-qr-way">
        {{$t('account.payWithWechat')}}
      </div>
      <div v-if="isZhifubao" class="recharge-qr-way">
        {{$t('account.payWithAlipay')}}
      </div>
      <div class="recharge-qr-main">
        <div class="recharge-qr-main-content">
          <div class="recharge-qr-main-content-qr">
            <div v-if="isOrderSuccess" class="recharge-qr-main-content-qr-success">
              <i class="el-icon-success"></i>
              {{$t('account.success')}}
            </div>
            <img class="recharge-qr-main-content-qr-image" v-if="qrData && !isOrderSuccess" :src="qrData">
          </div>
          <div class="recharge-qr-main-content-tips">
            <div class="recharge-qr-main-content-tips-money">
              {{$t('account.rechargeMoney')}} <span class="highlight">{{$t('account.rmbUnit', { money: money})}}</span>
            </div>
            <div class="recharge-qr-main-content-tips-app">
              <p v-if="isWeixin">{{$t('account.wechatScan')}}</p>
              <p v-if="isZhifubao">{{$t('account.alipayScan')}}</p>
              <p>{{$t('account.scan')}}</p>
            </div>
          </div>
          <div :class="['recharge-qr-main-content-guide', { 'zhifubao-guide': isZhifubao, 'weixin-guide': isWeixin, 'en-zhifubao-guide': isEnZhifubao, 'en-weixin-guide': isEnWeixin}]">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { locale } from '@/lib/utils/i18n'
export default {
  name: 'RechargeQr',
  props: {
    size: {
      type: String,
      default: 'normal'
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      order: 'account/rechargeOrder'
    }),
    isEn() {
      return locale === 'en-US'
    },
    isMiniSize() {
      return this.size === 'mini'
    },
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
    isEnZhifubao() {
      return this.isEn && this.isZhifubao
    },
    isEnWeixin() {
      return this.isEn && this.isWeixin
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
.recharge-qr {
  &-header {
    height: 61px;
    line-height: 61px;
    font-size: 20px;
    color: #333;
    background: #fff;
    border-bottom: 1px solid #f3f3f3;
    padding-left: 49px;
  }
  &-container {
    padding: 0 49px 49px;
    background: #fff;
    &.mini {
      padding: 0;
    }
  }
  &-message {
    height: 132px;
    background: #fff;
    color: #808080;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-bottom: 1px solid #f3f3f3;
    &-row {
      height: 40px;
      line-height: 40px;
    }
    .message-bold {
      margin-left: 2em;
      color: #333;
    }
  }

  &-way {
    background: #fff;
    height: 78px;
    line-height: 78px;
    font-size: 16px;
    color: #333;
  }

  &-main {
    background: #fff;

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
        background: url('../../../assets/account/qr-bg.png');
        &-success {
          color: #67c23a;
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
        background-size: cover;
        @each $pic in weixin, zhifubao, en-weixin, en-zhifubao {
          &.#{$pic}-guide {
            background: url('../../../assets/account/#{$pic}-guide.png');
          }
        }
      }
    }
  }
  // mini size
  &.mini &-header {
    padding-left: 0;
  }

  &.mini &-container {
    padding: 0;
  }

  &.mini &-main {
    &-content {
      min-height: 329px;
      min-width: 641px;
      &-qr {
        height: 183px;
        width: 183px;
        margin-left: 20px;
        background-size: contain;
        background-repeat: no-repeat;
        &-image {
          height: 130px;
          width: 130px;
        }
        &-success {
          font-size: 20px;
        }
      }

      &-tips {
        margin-left: 20px;
        &-money {
          font-size: 18px;
          .highlight {
            color: #409efe;
          }
        }
        &-app {
          margin-top: 22px;
          font-size: 14px;
          p {
            margin: 0;
            line-height: 28px;
            padding: 0;
          }
        }
      }

      &-guide {
        height: 257px;
        width: 151px;
        background-size: contain;
        background-repeat: no-repeat;
        margin-left: 30px;
      }
    }
  }
}
</style>

