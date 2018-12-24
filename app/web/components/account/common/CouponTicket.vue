<template>
  <div :class="['coupon-ticket', { 'disabled': isDisabled }]">
    <div class="coupon-ticket-left">
      <div class="coupon-ticket-left-sum">
        <span class="coupon-ticket-left-sum-money"><span class="coupon-ticket-left-sum-money-rmb">¥</span>5</span>
        <!-- <div class="coupon-ticket-left-sum-coin">5 知识币</div> -->
        <!-- <div class="coupon-ticket-left-sum-bean">5 知识豆</div> -->
      </div>
      <div class="coupon-ticket-left-condition">
        {{title}}
      </div>
      <div v-if="isCloseToExpire" class="coupon-ticket-left-label deadline-label">即将过期</div>
      <div class="coupon-ticket-left-dot right-top"></div>
      <div class="coupon-ticket-left-dot right-bottom"></div>
    </div>
    <div class="coupon-ticket-right">
      <div class="coupon-ticket-right-dot left-top"></div>
      <div class="coupon-ticket-right-dot left-bottom"></div>
      <div :class="['coupon-ticket-right-type', { 'disabled': isDisabled }]">
        {{description}}
      </div>
      <div class="coupon-ticket-right-deadline">
        {{startTime | formatTime }} — {{endTime | formatTime}}
      </div>
      <div v-if="isUsed" class="coupon-ticket-right-icon used-icon"></div>
      <div v-if="isExpire" class="coupon-ticket-right-icon expire-icon"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'CouponTicket',
  props: {
    data: Object
  },
  mounted() {
    console.warn(this.data)
  },
  filters: {
    formatTime(time) {
      return moment(time).format("YYYY/M/D")
    }
  },
  computed: {
    title() {
      return this.data.title || ''
    },
    description() {
      return this.data.description || ''
    },
    startTime() {
      return this.data.startTime
    },
    endTime() {
      return this.data.endTime
    },
    isDisabled() {
      return !this.isUseable || this.isUsed || this.isExpire
    },
    isExpire() {
      return false
    },
    isCloseToExpire() {
      return this.isUseable && false
    },
    isUseable() {
      return true
    },
    isUsed() {
      return this.data.state === 1
    },

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
  &.disabled {
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
        &-rmb {
          font-size: 22px;
          margin-right: 6px;
        }
        &-coin {
          font-size: 14px;
        }
      }
    }
    &-condition {
      font-size: 14px;
    }
    &::after {
      content: " ";
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
      left: -28px;
      top: 9px;
      transform: rotate(-45deg);
      width: 100px;
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
    width: 265px;
    position: relative;
    overflow: hidden;
    &-type {
      color: #137282;
      font-size: 16px;
      font-weight: bold;
      &.disabled {
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
      content: " ";
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
        background: url("../../../assets/account/expire.png");
      }
      &.used-icon {
        background: url("../../../assets/account/used.png");
      }
    }
  }
}
</style>

