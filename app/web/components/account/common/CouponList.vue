<template>
  <div class="coupon-list">
    <template v-if="hasTickets">
      <div class="coupon-list-sum">
        {{$t('account.total', { total: ticketsCount })}}
      </div>
      <div class="coupon-list-main">
        <coupon-ticket class="coupon-list-main-item" v-for="(item,index) in soredTickets" :key="index" :data="item"></coupon-ticket>
      </div>
    </template>
    <template v-else>
      <div class="coupon-list-empty">
        <img class="coupon-list-empty-image" src="../../../assets/lessonImg/no_packages.png" :alt="$t('account.noCoupons')">
        <span class="coupon-list-empty-tips">{{$t('account.noCoupons')}}</span>
      </div>
    </template>
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
      type: Array,
      required: true,
      default() {
        return []
      }
    }
  },
  computed: {
    ticketsCount() {
      return this.data.length
    },
    hasTickets() {
      return this.ticketsCount > 0
    },
    soredTickets() {
      return this.data.map(i => i).sort((prv, cur) => prv.endTime - cur.endTime)
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

  &-empty {
    height: 266px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-tips {
      font-size: 20px;
      color: #111;
      margin-top: 20px;
    }
  }
}
</style>

