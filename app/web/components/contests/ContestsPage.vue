<template>
  <div class="contests-page">
    <div class="contests-page-header">
      <contests-header></contests-header>
    </div>
    <div class="contests-page-top">
      <p class="contests-page-top-streamer">用Paracraft软件演绎姓氏，用编程解读汉字，用视频媒介传播人文精神，用人工智能弘扬中华文化。</p>
      <div class="contests-page-top-title"></div>
      <p class="contests-page-top-specifier">“用计算机程序让汉字活起来走向世界”</p>
      <p class="contests-page-top-apply">
        <img class="contests-page-top-apply-img" src="@/assets/contests/button_1.png" alt="">
        <span class="contests-page-top-apply-text">我要报名</span>
      </p>
      <div class="contests-page-top-tab">
        <span v-for="(item, index) in tabData" :key="index" :class="['contests-page-top-tab-item', {'selected-item': index == currentSelected}]" @click="selectTabItem(index)">{{item.name}}</span>
      </div>
    </div>
    <div class="contests-page-main">
      <router-view></router-view>
    </div>
    <div class="contests-page-footer">
      <contests-footer></contests-footer>
    </div>
  </div>
</template>
<script>
import ContestsHeader from '@/components/contests/ContestsHeader'
import ContestsFooter from '@/components/contests/ContestsFooter'
export default {
  name: 'ContestsPage',
  data() {
    return {
      tabData: [
        {
          name: '首页'
        },
        {
          name: '大赛规则'
        },
        {
          name: '大赛动态'
        },
        {
          name: '报名方式'
        },
        {
          name: '了解Paracraft'
        }
      ],
      currentSelected: 0
    }
  },
  components: {
    ContestsHeader,
    ContestsFooter
  },
  methods: {
    selectTabItem(index) {
      this.currentSelected = index
      switch (index) {
        case 0:
          this.$router.push({ name: 'ContestsHomePage' })
          break
        case 1:
          this.$router.push({ name: 'ContestsRules' })
          break
        case 2:
          this.$router.push({ name: 'ContestsDynamic' })
          break
        case 3:
          this.$router.push({ name: 'ApplyWay' })
          break
        case 4:
          this.$router.push({ name: 'ContestsHomePage' })
          break
        default:
          this.$router.push({ name: 'ContestsHomePage' })
          break
      }
    }
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  background: url(../../assets/contests/body_bg.png);
}
.contests-page {
  height: 100%;
  display: table;
  width: 100%;
  box-sizing: border-box;
  background: url(../../assets/contests/bg.png) center top no-repeat,
    url(../../assets/contests/footer_bg.png) bottom center no-repeat;
  &-header {
    display: table-row;
    height: 60px;
  }
  &-top {
    &-streamer {
      text-align: center;
      font-size: 18px;
      line-height: 38px;
      color: #fff;
      letter-spacing: 1px;
      font-family: 'STKaiti';
      background: url(../../assets/contests/roll_bg.png) top center no-repeat;
      margin: 0 0 18px;
    }
    &-title {
      height: 184px;
      background: url(../../assets/contests/banner_text.png) no-repeat top
        center;
    }
    &-specifier {
      text-align: center;
      font-family: 'FangSong_GB2312';
      font-size: 26px;
      letter-spacing: 2px;
      color: #fbd7a2;
      margin: 10px 0 0;
    }
    &-apply {
      height: 117px;
      margin: 0;
      position: relative;
      &-img {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
      }
      &-text {
        position: absolute;
        cursor: pointer;
        display: inline-block;
        width: 318px;
        height: 150px;
        line-height: 150px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        color: #fff;
        font-size: 27px;
        font-family: 'PangMenZhengDao-Cu';
      }
    }
    &-tab {
      display: flex;
      max-width: 1020px;
      margin: 0 auto;
      justify-content: space-around;
      &-item {
        display: inline-block;
        width: 166px;
        height: 109px;
        line-height: 109px;
        text-align: center;
        font-family: 'KaiTi';
        font-weight: bold;
        font-size: 24px;
        color: #13232f;
        cursor: pointer;
        position: relative;
        z-index: 999;
        &.selected-item {
          color: #fff;
          background: url(../../assets/contests/head_selected.png) no-repeat
            center top;
        }
      }
    }
  }
  &-main {
    display: table-row;
    height: 100%;
    width: 100%;
  }
  &-footer {
    display: table-row;
  }
}
</style>

