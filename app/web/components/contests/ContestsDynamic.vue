<template>
  <div class="contests-dynamic">
    <div class="contests-dynamic-tab">
      <span :class="['contests-dynamic-tab-btn',{'selected': selectSign == 'ContestsDynamicWorks'}]" @click="switchTab('ContestsDynamicWorks')">精品赏析</span>
      <span :class="['contests-dynamic-tab-btn',{'selected': selectSign == 'ContestsDynamicNews'}]" @click="switchTab('ContestsDynamicNews')">新闻动态</span>
    </div>
    <div>
      <router-view></router-view>
    </div>
    <!-- <img class="contests-dynamic-bgpic element_text_1" src="@/assets/contests/element_text_1.png" alt=""> -->
    <img class="contests-dynamic-bgpic element_text_2" src="@/assets/contests/element_text_2.png" alt="">
    <img class="contests-dynamic-bgpic element_text_3" src="@/assets/contests/element_text_3.png" alt="">
  </div>
</template>
<script>
export default {
  name: 'ContestsDynamic',
  data() {
    return {
      selectSign: 'ContestsDynamicWorks'
    }
  },
  mounted() {
    this.selectSign = this.$route.name
  },
  watch: {
    $route(route) {
      this.selectSign = this.$route.name
    }
  },
  methods: {
    switchTab(sign) {
      this.selectSign = sign
      this.$router.push({ name: sign })
    }
  }
}
</script>
<style lang="scss" scoped>
.contests-dynamic {
  padding-top: 40px;
  position: relative;
  max-width: 1920px;
  margin: 0 auto 100px;
  &-tab {
    text-align: center;
    color: #fff;
    padding: 12px;
    margin-bottom: 37px;
    &-btn {
      padding: 10px 20px;
      border-radius: 20px;
      // background: #999;
      color: rgb(129, 130, 132);
      cursor: pointer;
      &.selected {
        border: 2px solid #003f8d;
        color: #333;
      }
    }
  }
  &-bgpic {
    position: absolute;
    z-index: -999;
    &.element_text_1 {
      right: 100px;
      top: 100px;
    }
    &.element_text_2 {
      left: 80px;
      top: 130px;
    }
    &.element_text_3 {
      right: 100px;
      bottom: 200px;
    }
  }
}
@media screen and (max-width: 768px) {
  .contests-dynamic {
    &-bgpic {
      display: none;
    }
  }
}
</style>


