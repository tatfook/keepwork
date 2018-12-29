<template>
  <div class="coupon-ticket-checkbox" @click="handleClick">
    <coupon-ticket class="coupon-ticket-checkbox-item" :data="data"></coupon-ticket>
    <span :class="['coupon-ticket-checkbox-circle', { 'circle-is-checked': isChecked }]">
    </span>
  </div>
</template>

<script>
import CouponTicket from './CouponTicket'
export default {
  name: 'CouponTickCheckbox',
  props: {
    data: Object
  },
  components: {
    CouponTicket
  },
  methods: {
    handleClick() {
      if (!this.isDisabled) {
        this.$emit('handleClick', this.id)
      }
    }
  },
  computed: {
    isChecked() {
      return this.data.isChecked
    },
    id() {
      return this.data.id
    },
    isDisabled() {
      return this.data.isDisabled
    }
  }
}
</script>

<style lang="scss">
.coupon-ticket-checkbox {
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  margin-bottom: 17px;
  &-item {
    width: 500px !important;
  }

  &-circle {
    display: block;
    position: absolute;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: solid 2px #fff;
    z-index: 998;
    top: 50%;
    right: 23px;
    margin-top: -11px;
    &.circle-is-checked {
      background: #fff;
      font-size: 22px;
      line-height: 18px;
      text-align: center;
      &::after {
        content: ' ';
        display: inline-block;
        height: 12px;
        width: 6px;
        border-right: 3px solid #65cad9;
        border-bottom: 3px solid #65cad9;
        transform: rotate(45deg);
      }
    }
  }
}
</style>
