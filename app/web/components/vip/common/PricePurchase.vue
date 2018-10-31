<template>
  <div class="price-purchase">
    <h1 class="price-purchase-title">
      <span>VIP购买付费</span>
    </h1>
    <div class="price-purchase-item price-purchase-item-active">
      <div class="price-purchase-item-price">
        <span>￥</span>{{lessonVipPrice}}
      </div>
      <div class="price-purchase-item-time">1年</div>
    </div>
    <el-button type="primary" @click="goPayPage()">立即充值</el-button>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
const LESSON_VIP_APP_NAME = process.env.LESSON_VIP_APP_NAME
const LESSON_VIP_APP_GOODS_ID = process.env.LESSON_VIP_APP_GOODS_ID

export default {
  name: 'PricePurchase',
  data() {
    return {
      lessonVipPrice: 3000
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      userIsLogined: 'user/isLogined'
    }),
    username() {
      return _.get(this.userProfile, 'username')
    },
    origin() {
      return window.location.origin
    }
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'vip/toggleLoginDialog'
    }),
    goPayPage() {
      if (!this.userIsLogined) {
        return this.toggleLoginDialog(true)
      }
      let payParams = {
        username: this.username,
        app_name: LESSON_VIP_APP_NAME,
        app_goods_id: LESSON_VIP_APP_GOODS_ID,
        price: this.lessonVipPrice
      }
      let paramsString = this.objectToQueryString(payParams)
      let payPath = `${this.origin}/wiki/pay?${paramsString}`
      window.location.href = payPath
    },
    objectToQueryString(obj) {
      const results = []
      _.forOwn(obj, (value, key) => {
        if (_.isObject(value)) {
          value = JSON.stringify(value)
        }
        results.push(`${key}=${encodeURIComponent(value)}`)
      })
      return results.join('&')
    }
  }
}
</script>
<style lang="scss" scoped>
.price-purchase {
  text-align: center;
  &-title {
    color: #303133;
    margin: 0 0 60px;
    font-size: 24px;
    span {
      border-bottom: 4px solid #3977ad;
      padding-bottom: 6px;
    }
  }
  &-item {
    text-align: center;
    display: flex;
    width: 200px;
    margin: 0 auto;
    align-items: center;
    cursor: pointer;
    border: 1px solid #dcdcdc;
    &-active {
      outline: 2px solid #fd3265;
    }
    &-price {
      flex: 1;
      font-size: 28px;
      color: #fd3265;
      span {
        font-size: 14px;
      }
    }
    &-time {
      background-color: #dcdcdc;
      padding: 28px 12px;
      word-break: break-all;
      width: 1em;
    }
  }
  .el-button {
    width: 120px;
    height: 42px;
    line-height: 42px;
    padding: 0;
    font-size: 16px;
    margin-top: 40px;
  }
}
</style>
