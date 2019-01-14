<template>
  <div class="payment-way">
    {{$t('account.payWith')}}
    <div class="payment-way-options">
      <span :class="['payment-way-options-card', { 'options-card-selected': isWeixinPay }]" @click="handleSelectPayWay(CONF.WEIXIN_PAY)">
        <span class="payment-way-options-card-icon weixin-icon"></span>
        <span class="payment-way-options-card-name">{{$t('account.wechat')}}</span>
        <span class="payment-way-options-card-selected-label" v-show="isWeixinPay">
        </span>
      </span>
      <span :class="['payment-way-options-card', { 'options-card-selected': isZhifubaoPay }]" @click="handleSelectPayWay(CONF.ZHIFUBAO_PAY)">
        <span class="payment-way-options-card-icon zhifubao-icon"></span>
        <span class="payment-way-options-card-name">{{$t('account.alipay')}}</span>
        <span class="payment-way-options-card-selected-label" v-show="isZhifubaoPay"></span>
      </span>
    </div>

    <div class="payment-way-confirm">
      <el-button type="primary" :class="['payment-way-confirm-button', {'payment-way-min': isMini}]" @click="handleConfirm" :loading="isLoading">{{$t('account.proceedToCheckout')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentWay',
  props: {
    handleCallback: {
      type: Function,
      default: () => {}
    },
    size: {
      type: String,
      default: 'normal'
    }
  },
  data() {
    return {
      payWay: 'weixin',
      isLoading: false
    }
  },
  computed: {
    isWeixinPay() {
      return this.payWay === this.CONF.WEIXIN_PAY
    },
    isZhifubaoPay() {
      return this.payWay === this.CONF.ZHIFUBAO_PAY
    },
    isMini() {
      return this.size === 'mini'
    },
    CONF() {
      return {
        WEIXIN_PAY: 'weixin',
        ZHIFUBAO_PAY: 'zhifubao'
      }
    }
  },
  methods: {
    async handleConfirm() {
      this.isLoading = true
      let channel = this.payWay === 'weixin' ? 'wx_pub_qr' : 'alipay_qr'
      await this.handleCallback(channel)
      this.isLoading = false
    },
    handleSelectPayWay(way) {
      this.payWay = way
    }
  }
}
</script>



<style lang="scss">
.payment-way {
  background: #fff;
  // padding: 22px 49px 20px;
  // min-height: 400px;
  color: #808080;
  &-options {
    margin-top: 20px;
    padding-bottom: 40px;
    border-bottom: 1px solid #f3f3f3;
    &-card {
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
      height: 54px;
      width: 151px;
      margin-right: 46px;
      background: #f3f5f7;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      &.options-card-selected {
        border: 2px solid #409efe;
      }
      &-icon {
        display: inline-block;
        height: 30px;
        width: 30px;
        margin: 8px;
        &.zhifubao-icon {
          background: url('../../../assets/account/zhifubao.png') no-repeat;
        }
        &.weixin-icon {
          background: url('../../../assets/account/weixin.png') no-repeat;
        }
      }
      &-name {
        font-size: 16px;
        color: #333;
      }
      &-selected-label {
        display: block;
        height: 23px;
        width: 66px;
        transform: rotate(45deg);
        position: absolute;
        top: -9px;
        right: -28px;
        background: #409efe;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        &::after {
          content: ' ';
          display: inline-block;
          border-right: 3px solid #fff;
          border-bottom: 3px solid #fff;
          border-radius: 2px;
          height: 16px;
          width: 5px;
        }
      }
    }
  }

  &-confirm {
    margin-top: 38px;
    &-button {
      width: 329px;
      height: 43px;
      font-size: 18px;

      &.payment-way-mini {
        width: 154px;
      }
    }
  }
}
</style>
