<template>
  <div class="order-confirm" v-if="!isLoading">
    <div class="order-confirm-header">
      <div class="order-confirm-header-center">
        <div class="order-confirm-header-center-title">{{$t('account.confirmAccount')}}</div>
        <div class="order-confirm-header-center-main">
          <span class="order-confirm-header-center-main-username">{{$t('account.keepworkAccount')}} {{username}}</span>
          <span v-if="isExchangeType" class="order-confirm-header-center-main-account">{{$t('account.digitalAccount')}} <el-select v-model="digitalAccount" :placeholder="$t('account.pleaseSelect')">
              <el-option v-for="item in digitalAccountList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select></span>
        </div>
      </div>
    </div>
    <div class="order-confirm-main">
      <div class="order-confirm-main-title">
        {{$t('account.confirmInformation')}}
      </div>
      <div class="order-confirm-main-item">
        <package-item v-if="!isLoading && isPackageType" :data="goodsDetail"></package-item>
        <goods-item v-if="!isLoading && isExchangeType" :data="goodsDetail"></goods-item>
      </div>
      <div class="order-confirm-main-count">
        <div class="order-confirm-main-count-title">
          {{$t('account.qty')}}
        </div>
        <div class="order-confirm-main-count-input">
          <el-input-number class="input-number-counter" :disabled="isPackageType" v-model="count" :min="1" :max="10000" size="small"></el-input-number>
        </div>
        <div class="order-confirm-main-count-total">
        {{$t('account.totalPrice')}} {{ totalCostByUnit }}
        </div>
      </div>
      <div class="order-confirm-main-discounts">
        <div class="order-confirm-main-discounts-title">
          {{$t('account.coupons')}}
        </div>
        <div class="order-confirm-main-discounts-checked">
           {{$t('account.noCoupons')}}
        </div>
        <div class="order-confirm-main-discounts-all">
           {{$t('account.detail')}} <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="order-confirm-main-submit">
        <div class="order-confirm-main-submit-total">
          <span class="order-confirm-main-submit-total-title">{{$t('account.needToPay')}} </span>
          <span class="order-confirm-main-submit-total-cost">{{ finalCostByUnit }}</span>
        </div>
        <el-button type="danger" class="order-confirm-main-submit-button" :loading="isSubmiLoading" @click="handleSubmitTradeOrder" round>{{$t('account.submitOrder')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import PackageItem from './common/OrderPackageItem'
import GoodsItem from './common/OrderGoodsItem'
import { mapActions, mapGetters } from 'vuex'
import OrderMixin from './common/OrderMixin'
import { keepwork } from '@/api'
import _ from 'lodash'
const COUNT_REG = /^[0-9]*[1-9][0-9]*$/
export default {
  name: 'OrderConfirm',
  mixins: [OrderMixin],
  components: {
    PackageItem,
    GoodsItem
  },
  data() {
    return {
      isLoading: true,
      count: 1,
      isSubmiLoading: false,
      discountId: null,
      digitalAccount: '',
      digitalAccountList: []
    }
  },
  async mounted() {
    let { type, count = 1, id, payment } = this.$route.query
    type = _.toNumber(type)
    id = _.toNumber(id)
    if (type === 2 && payment === 'bean') {
      return this.$message.error('课程包无法通过知识豆购买')
    }
    if (!type || !id || !payment) {
      return this.$message.error('缺少必要参数')
    }
    await Promise.all([
      this.getBalance(),
      this.getDiscounts(),
      this.createTradeOrder({ type, count, id, payment, user_nid: this.digitalAccount })
    ])
    if (type === 1) {
      // exchange way
      // this.digitalAccountList = [{label: '7000000001360', value: 7000000001360}]
      keepwork.account.getDigitalAccounts()
        .then(res => {
          let { data = [] } = res
          this.DigitalAccountList = res.data.map(item => ({ label: item, value: item}))
        })
        .catch(e => console.error(e))
    }
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      createTradeOrder: 'account/createTradeOrder',
      getDiscounts: 'account/getDiscounts',
      submitTradeOrder: 'account/submitTradeOrder',
      getBalance: 'account/getBalance'
    }),
    handleSubmitTradeOrder() {
      if (this.isExchangeType && !this.digitalAccount) {
        return this.$message.error(this.$t('account.pleaseSelectDigitalAccount'))
      }
      if (this.isCoinPayment && this.finalCost > this.userCoin) {
        return this.$message.error(this.$t('account.coinInsufficient'))
      }
      if (this.isBeanPayment && this.finalCost > this.userBean) {
        return this.$message.error(this.$t('account.beanInsufficient'))
      }
      try {
        let payload = {
          count: this.count,
          finalCost: this.finalCost
        }
        if (this.discountId) {
          payload['discountId '] = this.discountId
        }
        payload = {
          ...payload,
          totalCost: this.totalCost,
          finalCost: this.finalCost
        }
        this.submitTradeOrder(payload)
        this.$router.push({ name: 'OrderPay' })
      } catch (error) {
        console.error(error)
        this.$message.error(this.$t('card.operationFail'))
      }
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      tradeOrder: 'account/tradeOrder',
      balance: 'account/balance'
    }),
    username() {
      return _.get(this.userProfile, 'username', '')
    },
    goodsType() {
      return _.get(this.tradeOrder, 'type', '')
    },
    goodsDetail() {
      return {
        ..._.get(this.tradeOrder, 'goodsDetail', {}),
        payment: this.payment
      }
    },
    goodsCost() {
      if (this.isPackageType) {
        return _.get(this.goodsDetail, [this.payment], '')
      }
      return (
        _.get(this.goodsDetail, 'rmb', 0) ||
        _.get(this.goodsDetail, 'coin', 0) ||
        _.get(this.goodsDetail, 'bean', 0)
      )
    },
    isPackageType() {
      return this.goodsType === 2
    },
    isExchangeType() {
      return this.goodsType === 1
    },
    isDisabledCount() {
      return false
    },
    costByUnit() {
      return this.isRmbPayment
        ? `${this.costUnit}${this.finalCost}`
        : `${this.finalCost}${this.costUnit}`
    },
    totalCost() {
      return this.goodsCost * this.count
    },
    totalCostByUnit() {
      return this.isRmbPayment
        ? `${this.costUnit} ${this.totalCost}`
        : `${this.totalCost} ${this.costUnit}`
    },
    finalCost() {
      // FIXME:
      return this.totalCost - 0
    }
  }
}
</script>



<style lang="scss">
.order-confirm {
  &-header {
    background: url('../../assets/account/confirm-bg.jpg') repeat-x;
    height: 170px;
    &-center {
      max-width: 1145px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      padding-left: 40px;
      &-title {
        font-size: 20px;
        color: #333;
      }
      &-main {
        margin-top: 14px;
        margin-bottom: 25px;
        &-username {
          font-size: 14px;
          color: #666;
          display: inline-block;
          min-width: 189px;
          padding-right: 39px;
          box-sizing: border-box;
        }

        &-account {
          display: inline-block;
          font-size: #666;
          font-size: 14px;
          border-left: 1px solid #9c9c9c;
          padding-left: 39px;
          .el-input__inner {
            height: 30px;
            line-height: 30px;
          }
          .el-input__suffix-inner {
            .el-select__caret {
              line-height: 30px;
            }
          }
        }
      }
    }
  }

  &-main {
    background: #fff;
    box-shadow: 0px 10px 12px 0px rgba(1, 32, 45, 0.08);
    width: 1145px;
    min-height: 577px;
    border-radius: 8px;
    margin: -46px auto 0;
    box-sizing: border-box;
    padding: 0 40px;
    overflow: hidden;
    &-title {
      height: 74px;
      line-height: 74px;
    }
    &-item {
      min-width: 140px;
    }
    &-count {
      min-height: 93px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      &-title {
        min-width: 60px;
        color: #666;
      }
      &-input {
        flex: 1;
      }
      &-total {
        min-width: 100px;
      }
    }
    &-discounts {
      min-height: 93px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      &-title {
        color: #333;
        min-width: 100px;
      }
      &-checked {
        color: #999;
        flex: 1;
      }
      &-all {
        min-width: 100px;
        color: #999;
        cursor: pointer;
      }
    }
    &-submit {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      min-height: 188px;
      &-total {
        &-title {
          font-size: 14px;
          color: #666;
          margin-right: 2em;
        }
        &-cost {
          font-size: 24px;
          color: #f20d0d;
        }
      }
      &-button {
        margin-top: 30px;
        background-color: #f20d0d;
        border-color: #f20d0d;
        padding: 12px 44px;
      }
    }
  }
}
</style>

