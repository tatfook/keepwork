<template>
  <div class="recharge-page">
    <div class="recharge-page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Account' }">我的账户</el-breadcrumb-item>
        <el-breadcrumb-item>充值</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="recharge-page-header">
      充值账号: {{username}}
    </div>
    <div class="recharge-page-money">
      充值金额:
      <div class="recharge-page-money-options">
        <div class="recharge-page-money-options-card selected">
          50元
        </div>
        <div class="recharge-page-money-options-card">
          100元
        </div>
        <div class="recharge-page-money-options-card">
          500元
        </div>
        <div class="recharge-page-money-options-card">
          其他金额
        </div>
      </div>
      <div class="recharge-page-money-tips">
        <i class="el-icon-warning"></i>
        充值金额必须为正整数，单次最多不超过100万元。
      </div>
    </div>
    <div class="recharge-page-way">
      支付方式:
      <div class="recharge-page-way-options">
        <span class="recharge-page-way-options-card selected">
          <span class="recharge-page-way-options-card-icon weixin-icon"></span>
          <span class="recharge-page-way-options-card-name">微信支付</span>
          <span class="recharge-page-way-options-card-selected-label">
          </span>
        </span>
        <span class="recharge-page-way-options-card">
          <span class="recharge-page-way-options-card-icon zhifubao-icon"></span>
          <span class="recharge-page-way-options-card-name">支付宝</span>
          <!-- <span class="recharge-page-way-options-card-selected-label"></span> -->
        </span>
      </div>

      <div class="recharge-page-confirm">
        <el-button type="primary" class="recharge-page-confirm-button">立即充值</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'RechargePage',
  computed: {
    ...mapGetters({
      userProfile: 'user/profile'
    }),
    username() {
      return _.get(this.userProfile, 'username', '')
    }
  },
  methods: {
    handleSelectMoneyCard() {

    },
    handleSelectPayWay() {

    }
  }
}
</script>

<style lang="scss">
.recharge-page {
  &-breadcrumb {
    margin: 22px 0;
  }
  &-header {
    height: 61px;
    line-height: 61px;
    font-size: 16px;
    color: #808080;
    background: #fff;
    border-bottom: 1px solid #f3f3f3;
    padding-left: 49px;
  }

  &-money {
    background: #fff;
    border-bottom: 1px solid #f3f3f3;
    padding: 25px 0 19px 49px;
    color: #808080;
    border-bottom: 1px solid #f3f3f3;
    &-options {
      display: flex;
      margin-top: 18px;
      &-card {
        height: 141px;
        width: 255px;
        min-width: 141px;
        box-sizing: border-box;
        border: 2px solid #c1c1c1;
        border-radius: 6px;
        font-size: 30px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        margin-right: 31px;
        cursor: pointer;
        &.selected {
          background: #65cad9;
          color: #fff;
          border: none;
        }
      }
    }
    &-tips {
      margin-top: 42px;
      font-size: 16px;
    }
  }

  &-way {
    background: #fff;
    padding: 22px 49px 20px;
    min-height: 400px;
    color: #808080;
    &-options {
      margin-top: 20px;
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
        &.selected {
          border: 2px solid #409efe;
        }
        &-icon {
          display: inline-block;
          height: 30px;
          width: 30px;
          margin: 8px;
          &.zhifubao-icon {
            background: url("../../assets/account/zhifubao.png") no-repeat;
          }
          &.weixin-icon {
            background: url("../../assets/account/weixin.png") no-repeat;
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
            content: " ";
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
  }

  &-confirm {
    margin-top: 38px;
    &-button {
        width: 329px;
        height: 43px;
        font-size: 18px;
    }
  }
}
</style>


