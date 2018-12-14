<template>
  <div class="coupon-list">
    <div class="coupon-list-sum">
      共6张:
    </div>
    <div class="coupon-list-main">
      <coupon-ticket
        class="coupon-list-main-item"
        v-for="(item,index) in tickets"
        :key="index"
      ></coupon-ticket>
    </div>
  </div>

</template>

<script>
import CouponTicket from './CouponTicket'
export default {
  name: 'CouponList',
  components: {
    CouponTicket
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tickets: [1, 2, 3, 4, 5]
    }
  }
}
</script>


<style lang="scss">
.coupon-list {
  &-sum {
    font-size: 14px;
    color: #808080;
  }

  &-main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &-item {
      margin-top: 20px;
    }
  }
}
</style>

