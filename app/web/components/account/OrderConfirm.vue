<template>
  <div class="order-confirm" v-if="!isLoading">
    <div class="order-confirm-header">
      <div class="order-confirm-header-center">
        <div class="order-confirm-header-center-title">{{$t('account.confirmAccount')}}</div>
        <div class="order-confirm-header-center-main">
          <span class="order-confirm-header-center-main-username">{{$t('account.keepworkAccount')}} {{username}}</span>
          <span v-if="isNeedDigitalAccount" class="order-confirm-header-center-main-account">{{$t('account.digitalAccount')}}
            <el-select v-model="digitalAccount" :placeholder="$t('account.pleaseSelect')">
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
          <el-input-number class="input-number-counter" v-model="count" :min="goodsMin" :max="goodsMax" size="small"></el-input-number>
        </div>
        <div class="order-confirm-main-count-total">
          {{$t('account.totalPrice')}} {{totalCostByUnit}}
        </div>
      </div>
      <div class="order-confirm-main-discounts">
        <div class="order-confirm-main-discounts-title">
          {{$t('account.coupons')}}
        </div>
        <div class="order-confirm-main-discounts-checked">
          <span class="is-checked-discount" v-show="this.tradeOrderDiscount">
            - {{rewardNumberByUnit}} ({{tradeOrderDiscount && tradeOrderDiscount.title}})
          </span>
          <span v-show="!this.tradeOrderDiscount">
            {{$t('account.noCoupons')}}
          </span>
        </div>
        <div class="order-confirm-main-discounts-all" @click="handleShowDiscountsDialog">
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
    <el-dialog class="order-confirm-discounts-dialog" title="请选择优惠券" :visible.sync="isShowDiscountDialog">
      <template v-if="hasDiscounts">
        <div class="order-confirm-discounts-dialog-dont"> <span class="order-confirm-discounts-dialog-dont-title">不使用优惠券</span> <span @click="handleDontChecked" :class="['order-confirm-discounts-dialog-dont-checkbox', { 'is-dont-checked': isDontCheckedDiscount}]"></span></div>
        <div class="order-confirm-discounts-dialog-list">
          <coupon-ticket-checkbox class="order-confirm-discounts-dialog-list-item" @handleClick="handleSelectDiscount" v-for="(item, index) in currentPaymentDiscounts" :data="item" :key="index"></coupon-ticket-checkbox>
        </div>
      </template>
      <template v-else>
        <div class="order-confirm-discounts-dialog-empty">
          <img class="order-confirm-discounts-dialog-empty-image" src="../../assets/lessonImg/no_packages.png" :alt="$t('account.noCoupons')">
          <span class="order-confirm-discounts-dialog-empty-tips">{{$t('account.noCoupons')}}</span>
        </div>
      </template>
      <div class="order-confirm-discounts-dialog-footer" slot="footer">
        <el-button class="order-confirm-discounts-dialog-footer-button" @click="handleCancelSelected" size="small">取消</el-button>
        <el-button class="order-confirm-discounts-dialog-footer-button" @click="handleConfirmSelected" size="small" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PackageItem from './common/OrderPackageItem'
import GoodsItem from './common/OrderGoodsItem'
import CouponTicketCheckbox from './common/CouponTicketCheckbox'
import { mapActions, mapGetters } from 'vuex'
import OrderMixin from './common/OrderMixin'
import { keepwork } from '@/api'
import _ from 'lodash'
const COUNT_REG = /^[0-9]*[1-9][0-9]*$/
const HAQI_PLATFORM = [2, 3]
export default {
  name: 'OrderConfirm',
  mixins: [OrderMixin],
  components: {
    PackageItem,
    GoodsItem,
    CouponTicketCheckbox
  },
  data() {
    return {
      isLoading: true,
      count: 1,
      isSubmiLoading: false,
      discountId: null,
      digitalAccount: '',
      digitalAccountList: [],
      goodsId: '',
      isShowDiscountDialog: false,
      discountId: ''
    }
  },
  watch: {
    totalCost() {
      this.autoCheckDiscount()
    }
  },
  async mounted() {
    let {
      type,
      count = 1,
      id,
      payment,
      user_nid,
      username = '',
      price = ''
    } = this.$route.query
    type = _.toNumber(type)
    id = _.toNumber(id)
    this.goodsId = id
    if (type === 2 && payment === 'bean') {
      return this.$message.error('课程包无法通过知识豆购买')
    }
    if (!type || !id || !payment) {
      return this.$message.error('缺少必要参数')
    }
    await Promise.all([
      this.getBalance(),
      this.getDiscounts(),
      this.createTradeOrder({ type, count, id, payment })
    ])
    this.count = this.goodsDefaultCount
    if (price) {
      this.count = _.floor(_.divide(price, this.goodsCost))
    }
    if (this.isNeedDigitalAccount) {
      // exchange way
      await keepwork.account
        .getDigitalAccounts()
        .then(res => {
          let data = _.get(res, 'data.data', [])
          if (user_nid && this.data.includes(user_nid)) {
            this.digitalAccount = user_nid
          } else {
            this.$message({
              type: 'error',
              duration: '8000',
              message: '当前登录的账号跟该数字账号不存在关联'
            })
          }
          data = _.uniq(data)
          this.digitalAccountList = data.map(item => ({
            label: item,
            value: item
          }))
        })
        .catch(e => console.error(e))
    }
    this.autoCheckDiscount()
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      createTradeOrder: 'account/createTradeOrder',
      getDiscounts: 'account/getDiscounts',
      submitTradeOrder: 'account/submitTradeOrder',
      getBalance: 'account/getBalance',
      setDiscount: 'account/setDiscount',
      userLogout: 'user/logout'
    }),
    handleSelectDiscount(id) {
      this.discountId = id
    },
    handleDontChecked() {
      this.discountId = ''
    },
    handleShowDiscountsDialog() {
      this.isShowDiscountDialog = true
      this.discountId = this.tradeOrderDiscountId
    },
    handleCancelSelected() {
      this.isShowDiscountDialog = false
    },
    handleConfirmSelected() {
      this.setDiscount(this.discountId)
      this.isShowDiscountDialog = false
    },
    autoCheckDiscount() {
      let discount = _.maxBy(
        this.usableDiscounts,
        item => item[`reward${_.upperFirst(this.payment)}`]
      )
      const discounts = _.filter(
        this.usableDiscounts,
        item =>
          item[`reward${_.upperFirst(this.payment)}`] ===
          discount[`reward${_.upperFirst(this.payment)}`]
      )
      if (discounts.length > 1) {
        discount = _.minBy(discounts, item => item.endTime)
      }
      const id = _.get(discount, 'id', '')
      this.setDiscount(id)
    },
    handleSubmitTradeOrder() {
      if (this.isNeedDigitalAccount && !this.digitalAccount) {
        return this.$message.error(
          this.$t('account.pleaseSelectDigitalAccount')
        )
      }
      if (this.isCoinPayment && this.finalCost > this.userCoin) {
        return this.$message.error(this.$t('account.coinInsufficient'))
      }
      if (this.isBeanPayment && this.finalCost > this.userBean) {
        return this.$message.error(this.$t('account.beanInsufficient'))
      }
      try {
        const payload = {
          count: this.count,
          finalCost: this.finalCost,
          user_nid: this.digitalAccount,
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
      balance: 'account/balance',
      discounts: 'account/discounts'
    }),
    hasDiscounts() {
      return this.currentPaymentDiscounts.length > 0
    },
    currentPaymentDiscounts() {
      return [...this.usableDiscounts, ...this.disabledDiscounts]
    },
    usableDiscounts() {
      const filterDiscount = this.isExchangeType
        ? item =>
            item.state === 0 &&
            item.endTime > +new Date() &&
            item[this.payment] > 0 &&
            item[this.payment] <= this.totalCost &&
            item.type === 0
        : item =>
            item.state === 0 &&
            item.endTime > +new Date() &&
            item[this.payment] > 0 &&
            item[this.payment] <= this.totalCost

      return this.discounts
        .filter(filterDiscount)
        .map(i => ({
          ...i,
          isChecked: i.id === this.discountId
        }))
        .sort(
          (prv, cur) =>
            cur[`reward${_.upperFirst(this.payment)}`] -
            prv[`reward${_.upperFirst(this.payment)}`]
        )
    },
    usableDiscountsIds() {
      return this.usableDiscounts.map(i => i.id)
    },
    disabledDiscounts() {
      const filterDiscount = item => {
        return (
          !this.usableDiscountsIds.includes(item.id) &&
          item.state === 0 &&
          item.endTime > +new Date()
        )
      }
      return this.discounts
        .filter(filterDiscount)
        .map(i => ({
          ...i,
          isDisabled: true
        }))
        .sort((prv, cur) => prv.endTime - cur.endTime)
    },
    isDisableInput() {
      return this.isPackageType || ''
    },
    isDontCheckedDiscount() {
      return !this.discountId
    },
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
    goodsMin() {
      return _.get(this.goodsDetail, 'min', 1)
    },
    goodsMax() {
      return _.get(this.goodsDetail, 'max', 1)
    },
    goodsDefaultCount() {
      return _.get(this.goodsDetail, 'defaultCount', 1)
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
    goodsPlatform() {
      return _.get(this.goodsDetail, 'platform', '')
    },
    isPackageType() {
      return this.goodsType === 2
    },
    isExchangeType() {
      return this.goodsType === 1
    },
    isNeedDigitalAccount() {
      return this.isExchangeType && HAQI_PLATFORM.includes(this.goodsPlatform)
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
      const total = _.multiply(this.goodsCost * this.count)
      return _.round(total, 2)
    },
    totalCostByUnit() {
      return this.isRmbPayment
        ? `${this.costUnit}${this.totalCost}`
        : `${this.totalCost}${this.costUnit}`
    },
    tradeOrderDiscountId() {
      return this.tradeOrder.discountId
    },
    tradeOrderDiscount() {
      return _.find(
        this.discounts,
        ({ id }) => id === this.tradeOrderDiscountId
      )
    },
    payment() {
      return _.get(this.tradeOrder, 'payment', '')
    },
    rewardNumber() {
      return _.get(
        this.tradeOrderDiscount,
        `reward${_.upperFirst(this.payment)}`,
        0
      )
    },
    rewardNumberByUnit() {
      return this.isRmbPayment
        ? `${this.costUnit}${this.rewardNumber}`
        : `${this.rewardNumber} ${this.costUnit}`
    },
    finalCost() {
      return _.round(_.subtract(this.totalCost, this.rewardNumber), 2)
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
        .is-checked-discount {
          color: #ff9307;
        }
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

  &-discounts-dialog {
    .el-dialog {
      width: 599px;
    }
    .el-dialog__header {
      height: 71px;
      line-height: 71px;
      border-bottom: 1px solid #dcdcdc;
      text-align: center;
      font-size: 20px;
      color: #333;
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__footer {
      padding: 0;
    }
    &-dont {
      width: 500px;
      margin: 0 auto;
      height: 57px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      color: #666;
      font-weight: bold;
      &-checkbox {
        cursor: pointer;
        display: inline-block;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        margin-right: 32px;
        border: solid 2px #bfbfbf;
        &.is-dont-checked {
          background: #fff;
          font-size: 22px;
          line-height: 18px;
          text-align: center;
          &::after {
            content: ' ';
            display: inline-block;
            height: 12px;
            width: 6px;
            border-right: 3px solid #bfbfbf;
            border-bottom: 3px solid #bfbfbf;
            transform: rotate(45deg);
          }
        }
      }
    }
    &-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 500px;
      overflow-y: auto;
    }

    &-empty {
      height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      &-tips {
        color: #333;
        font-size: 24px;
        margin-top: 30px;
      }
    }

    &-footer {
      width: 500px;
      height: 100px;
      box-sizing: border-box;
      padding-top: 30px;
      margin: 0 auto;
      &-button {
        &.el-button--small {
          padding: 10px 24px;
        }
      }
    }
  }
}
</style>

