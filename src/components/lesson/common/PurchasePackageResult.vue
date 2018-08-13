<template>
  <div class="purchase-package-result">
    <div class="purchase-package-result-icon">
      <i class="iconfont icon-chenggong"></i>
    </div>
    <p class="purchase-package-result-text">{{$t('lesson.purchaseSuccess')}}</p>
    <p class="purchase-package-result-text">{{$t('lesson.coinsWillBeBack', { backCoinCount: '100' })}}</p>
    <el-button type="primary" class="purchase-package-result-button" @click="backToPackageDetailPage">{{$t('lesson.viewPackage')}}</el-button>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'PurchasePackageResult',
  computed: {
    nowPath() {
      return this.$route.path
    },
    packageDetailPath() {
      return _.replace(this.nowPath, '/purchase', '')
    }
  },
  methods: {
    backToPackageDetailPage() {
      this.$router.push({
        path: this.packageDetailPath
      })
    }
  }
}
</script>
<style lang="scss">
.purchase-package-result {
  max-width: 1150px;
  margin: 150px auto 0;
  text-align: center;
  border: 1px solid #d7eaff;
  padding: 50px 0;
  &-icon {
    .iconfont {
      font-size: 86px;
      color: #80b622;
      margin-bottom: 10px;
    }
  }
  &-text {
    font-size: 20px;
    color: #111;
    margin: 0;
  }
  &-button {
    font-size: 18px;
    width: 266px;
    padding: 18px 20px;
    margin: 55px 0 20px;
  }
}
</style>
