<template>
  <div :class="['coupon-ticket', { 'coupon-disabled': isDisabled }]">
    <div class="coupon-ticket-left">
      <div class="coupon-ticket-left-sum">
        <span v-if="isRmbPayment" class="coupon-ticket-left-sum-money"><span class="coupon-ticket-left-sum-money-unit">¥</span>{{rewardRmb}}</span>
        <span v-else-if="isCoinPayment" class="coupon-ticket-left-sum-coin">{{rewardCoin}}<span class="coupon-ticket-left-sum-coin-unit">{{$t('account.coin')}}</span></span>
        <span v-else-if="isBeanPayment" class="coupon-ticket-left-sum-bean">{{rewardBean}}<span class="coupon-ticket-left-sum-bean-unit">{{$t('account.bean')}}</span></span>
      </div>
      <div class="coupon-ticket-left-condition">
        {{title}}
      </div>
      <div v-if="isCloseToExpire" class="coupon-ticket-left-label deadline-label">{{$t('account.willExpire')}}</div>
      <div class="coupon-ticket-left-dot right-top"></div>
      <div class="coupon-ticket-left-dot right-bottom"></div>
    </div>
    <div class="coupon-ticket-right">
      <div class="coupon-ticket-right-dot left-top"></div>
      <div class="coupon-ticket-right-dot left-bottom"></div>
      <div :class="['coupon-ticket-right-type', { 'coupon-disabled': isDisabled }]">
        {{description}}
      </div>
      <div class="coupon-ticket-right-deadline">
        {{startTime | formatTime }} — {{endTime | formatTime}}
      </div>
      <template v-if="isUsed">
        <div v-if="isEn" class="coupon-ticket-right-icon en-used-icon"></div>
        <div v-else class="coupon-ticket-right-icon used-icon"></div>
      </template>
      <template v-if="isExpire">
        <div v-if="isEn" class="coupon-ticket-right-icon en-expire-icon"></div>
        <div v-else class="coupon-ticket-right-icon expire-icon"></div>
      </template>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { locale } from '@/lib/utils/i18n'
import _ from 'lodash'
export default {
  name: 'CouponTicket',
  props: {
    data: Object,
    width: '430px'
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY/M/D')
    }
  },
  computed: {
    isEn() {
      return locale === 'en-US'
    },
    isPropsDisabled() {
      return this.data.isDisabled || false
    },
    title() {
      return this.isEn
        ? _.get(this.data, 'extra.en.title', '')
        : _.get(this.data, 'title', '')
    },
    description() {
      return this.isEn
        ? _.get(this.data, 'extra.en.description', '')
        : _.get(this.data, 'description', '')
    },
    state() {
      return this.data.state
    },
    startTime() {
      return this.data.startTime
    },
    isRmbPayment() {
      return Boolean(this.rmb)
    },
    isCoinPayment() {
      return Boolean(this.coin)
    },
    isBeanPayment() {
      return Boolean(this.bean)
    },
    rmb() {
      return this.data.rmb
    },
    coin() {
      return this.data.coin
    },
    bean() {
      return this.data.bean
    },
    rewardRmb() {
      return this.data.rewardRmb
    },
    rewardCoin() {
      return this.data.rewardCoin
    },
    rewardBean() {
      return this.data.rewardBean
    },
    endTime() {
      return this.data.endTime
    },
    isDisabled() {
      return this.isPropsDisabled || this.isUsed || this.isExpire
    },
    isExpire() {
      return this.isUseable && this.endTime < this.timestamp
    },
    isCloseToExpire() {
      return (
        this.isUseable &&
        !this.isExpire &&
        moment.duration(this.endTime - this.timestamp, 'ms').asDays() <= 7
      )
    },
    isUseable() {
      return this.state === 0
    },
    isUsed() {
      return this.state === 1
    },
    timestamp() {
      return +new Date()
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-ticket {
  background: #65cad9;
  color: #fff;
  width: 430px;
  min-height: 110px;
  display: flex;
  &.coupon-disabled {
    background: #cbcbcb;
  }
  &-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 166px;
    position: relative;
    overflow: hidden;
    &-sum {
      &-money {
        font-size: 38px;
        &-unit {
          font-size: 22px;
          margin-right: 3px;
        }
        &-coin {
          font-size: 14px;
        }
      }
      &-coin,
      &-bean {
        font-size: 38px;
        &-unit {
          font-size: 14px;
          margin-left: 3px;
        }
      }
    }
    &-condition {
      font-size: 14px;
    }
    &::after {
      content: ' ';
      width: 0;
      height: 100%;
      position: absolute;
      top: 4px;
      border-left: 4px dotted #fff;
      right: -2px;
    }
    &-dot {
      $diameter: 14px;
      $offset: -6px;
      width: $diameter;
      height: $diameter;
      position: absolute;
      background: #fff;
      border-radius: 50%;
      &.right-top {
        top: $offset;
        right: $offset;
      }
      &.right-bottom {
        right: $offset;
        bottom: $offset;
      }
    }

    &-label {
      font-size: 12px;
      text-align: center;
      line-height: 24px;
      position: absolute;
      left: 0;
      top: 0;
      border-bottom-right-radius: 4px;
      padding: 0 5px;
      &.deadline-label {
        color: #666666;
        background: #ffea01;
      }
    }
  }
  &-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    box-sizing: border-box;
    padding-left: 20px;
    // width: 265px;
    flex: 1;
    position: relative;
    overflow: hidden;
    &-type {
      color: #137282;
      font-size: 16px;
      font-weight: bold;
      &.coupon-disabled {
        color: #8a898b;
      }
    }
    &-deadline {
      font-size: 12px;
      line-height: 28px;
    }
    &-dot {
      $diameter: 14px;
      $offset: -6px;
      width: $diameter;
      height: $diameter;
      position: absolute;
      background: #fff;
      border-radius: 50%;
      &.left-top {
        top: $offset;
        left: $offset;
      }
      &.left-bottom {
        left: $offset;
        bottom: $offset;
      }
    }
    &::before,
    &::after {
      content: ' ';
      width: 0;
      height: 100%;
      position: absolute;
      top: 4px;
    }
    &::before {
      border-left: 4px dotted #fff;
      left: -2px;
    }
    &::after {
      border-left: 6px dotted #fff;
      right: -3px;
      top: 6px;
    }

    &-icon {
      width: 86px;
      height: 62px;
      object-fit: contain;
      position: absolute;
      right: 4px;
      bottom: 10px;
      &.expire-icon {
        background: url('../../../assets/account/expire.png');
      }
      &.en-expire-icon {
        background: url('../../../assets/account/en-expire.png');
      }
      &.used-icon {
        background: url('../../../assets/account/used.png');
      }
      &.en-used-icon {
        background: url('../../../assets/account/en-used.png');
      }
    }
  }
}
</style>

