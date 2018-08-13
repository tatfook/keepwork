<template>
  <div class="coin-purchase">
    <div class="coin-purchase-info">
      <el-checkbox v-model='isPayByCoin'>{{$t('lesson.purchaseWithCoins')}}</el-checkbox>
    </div>
    <div class="coin-purchase-card" :class="{'coin-purchase-card-selected': isPayByCoin}">
      <label class="coin-purchase-card-label">{{$t('lesson.availableCoins')}}</label>
      <div class="coin-purchase-card-value">
        <img class="coin-purchase-card-bg-icon" src="@/assets/lessonImg/coin_available.png" alt=""> 1300 coins
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CoinPurchase',
  data() {
    return {
      isPayByCoin: false
    }
  }
}
</script>
<style lang="scss">
.coin-purchase {
  &-card {
    width: 266px;
    height: 127px;
    background-color: #f3f3ef;
    font-size: 18px;
    margin-top: 18px;
    text-align: center;
    padding: 30px 15px;
    box-sizing: border-box;
    border-radius: 4px;
    &-selected {
      background-color: #66cd2e;
    }
    &-label {
      color: #172d0b;
    }
    &-value {
      background-color: #fff;
      color: #333;
      font-weight: bold;
      position: relative;
      height: 50px;
      line-height: 50px;
      text-align: center;
      margin: 10px 30px 0 43px;
      white-space: nowrap;
    }
    &-bg-icon {
      position: absolute;
      width: 50px;
      height: 50px;
      left: -25px;
      top: 0;
    }
  }
  .el-checkbox__inner {
    border-radius: 50%;
    width: 20px;
    height: 20px;
  }
  .el-checkbox__inner::after {
    width: 5px;
    height: 10px;
    border-width: 2px;
    left: 6px;
  }
  .el-checkbox__label {
    font-size: 16px;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #333;
  }
}
</style>

