<template>
  <div class="lesson-vip">
    <compare-view class="lesson-vip-row"></compare-view>
    <price-purchase class="lesson-vip-row"></price-purchase>
  </div>
</template>
<script>
import CompareView from './common/CompareView'
import PricePurchase from './common/PricePurchase'
export default {
  name: 'LessonVip',
  components: {
    CompareView,
    PricePurchase
  }
}
</script>
<style lang="scss" scoped>
.lesson-vip {
  &-row {
    padding: 30px 0;
    border-bottom: 1px solid #f2f2f2;
  }
  &-row:last-child {
    border-bottom: none;
  }
}
</style>
