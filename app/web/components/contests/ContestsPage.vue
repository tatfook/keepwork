<template>
  <div class="contests-page">
    <div class="contests-page-header">
      <contests-header></contests-header>
    </div>
    <div class="contests-page-top">
      <div class="contests-page-top-streamer">
        <div class="contests-page-top-streamer-wrap">
          <p class="contests-page-top-streamer-wrap-text" ref="topHintText">用Paracraft软件演绎姓氏，用编程解读汉字，用视频媒介传播人文精神，用人工智能弘扬中华文化。</p>
        </div>
      </div>
      <div class="contests-page-top-title"></div>
      <p class="contests-page-top-specifier">“用计算机程序让汉字活起来&nbsp;&nbsp;走向世界”</p>
      <p class="contests-page-top-apply">
        <img class="contests-page-top-apply-img" src="@/assets/contests/button_1.png" alt="">
        <span class="contests-page-top-apply-text" @click="toApply">我要报名</span>
      </p>
      <div class="contests-page-top-tab">
        <div class="contests-page-top-tab-phone-wrap">
          <span v-for="(item, index) in tabData" :key="index" :class="['contests-page-top-tab-item', {'selected-item': index == currentSelected}]" @click="selectTabItem(index)">{{item.name}}</span>
          <span :class="['contests-page-top-tab-item', {'selected-item': 2 == currentSelected}]" @click="selectTabItem(2)">
            <el-dropdown @command="handleCommand" trigger="hover" placement="bottom">
              <span class="el-dropdown-link" :class="['contests-page-top-tab-item', {'selected-item': 2 == currentSelected}]">
                大赛动态
              </span>
              <el-dropdown-menu slot="dropdown" class="contests-dynamic-menu">
                <el-dropdown-item command="a">精品赏析</el-dropdown-item>
                <el-dropdown-item command="b">新闻动态</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
          <span :class="['contests-page-top-tab-item', {'selected-item': 3 == currentSelected}]" @click="selectTabItem(3)">报名方式</span>
          <span :class="['contests-page-top-tab-item', {'selected-item': 4 == currentSelected}]" @click="selectTabItem(4)">了解Paracraft</span>
        </div>
      </div>
    </div>
    <div class="contests-page-main">
      <router-view></router-view>
    </div>
    <div class="contests-page-footer">
      <contests-footer></contests-footer>
    </div>
    <apply-way-dialog v-if='showApplyDialog' :showApplyDialog='showApplyDialog' @close="closeApplyDialog"></apply-way-dialog>
  </div>
</template>
<script>
import ContestsHeader from '@/components/contests/ContestsHeader'
import ContestsFooter from '@/components/contests/ContestsFooter'
import ApplyWayDialog from './ApplyWayDialog'
import { mapActions, mapGetters } from 'vuex'

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
        }
        // {
        //   name: '大赛动态'
        // },
        // {
        //   name: '报名方式'
        // },
        // {
        //   name: '了解Paracraft'
        // }
      ],
      currentSelected: 0,
      topTextTimer: null,
      showApplyDialog: false
    }
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined'
    })
  },
  components: {
    ContestsHeader,
    ContestsFooter,
    ApplyWayDialog
  },
  mounted() {
    this.topTextAnimation()
    this.highlightTab()
  },
  watch: {
    $route(route) {
      this.highlightTab()
    }
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    highlightTab() {
      switch (this.$route.name) {
        case 'ContestsHomePage':
          this.currentSelected = 0
          break
        case 'ContestsRules':
          this.currentSelected = 1
          break
        case 'ContestsDynamic':
        case 'ContestsDynamicWorks':
        case 'ContestsDynamicNews':
          this.currentSelected = 2
          break
        case 'ApplyWay':
          this.currentSelected = 3
          break
        default:
          this.currentSelected = 0
          break
      }
    },
    handleCommand(command) {
      if (command == 'a') {
        this.$router.push({ name: 'ContestsDynamicWorks' })
      } else {
        this.$router.push({ name: 'ContestsDynamicNews' })
      }
    },
    topTextAnimation() {
      this.topTextTimer = setInterval(() => {
        let leftLen = this.$refs['topHintText'].style['left'].replace(/px/, '')
        let winWidth =
          document.body.clientWidth || document.documentElement.clientWidth
        let comparisonValue = 840
        let winCompLeft = 800
        if (winWidth < 768) {
          comparisonValue = 750
          winCompLeft = 280
        }
        if (leftLen > -comparisonValue) {
          leftLen -= 1
          this.$refs['topHintText'].style['left'] = leftLen + 'px'
        } else {
          this.$refs['topHintText'].style['left'] = winCompLeft + 'px'
        }
      }, 20)
    },
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
          this.$router.push({ name: 'ContestsDynamicWorks' })
          break
        case 3:
          this.$router.push({ name: 'ApplyWay' })
          break
        case 4:
          window.open('http://paracraft.keepwork.com')
          this.$router.push({ name: 'ContestsHomePage' })
          this.currentSelected = 0
          break
        default:
          this.$router.push({ name: 'ContestsHomePage' })
          break
      }
    },
    toApply() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      this.showApplyDialog = true
    },
    closeApplyDialog() {
      this.showApplyDialog = false
    }
  },
  beforeDestroy() {
    clearInterval(this.topTextTimer)
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
  // font-family: 'STKaiti';
  // font-weight: bold;
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
      margin: 0 auto 18px;
      max-width: 940px;
      overflow: hidden;
      height: 38px;
      &-wrap {
        position: relative;
        height: 38px;
        width: 85%;
        margin: 0 auto;
        overflow: hidden;
        &-text {
          margin: 0;
          width: 900px;
          position: absolute;
          left: 0px;
        }
      }
    }
    &-title {
      height: 184px;
      max-width: 692px;
      background: url(../../assets/contests/banner_text.png) no-repeat top
        center;
      background-size: 80%;
      margin: 0 auto;
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
      }
    }
    &-tab {
      display: flex;
      max-width: 1020px;
      margin: 40px auto 0;
      justify-content: space-around;
      &-item {
        display: inline-block;
        width: 166px;
        height: 52px;
        line-height: 52px;
        text-align: center;
        font-size: 24px;
        color: #13232f;
        cursor: pointer;
        position: relative;
        z-index: 999;
        &.selected-item {
          // color: rgb(4, 62, 147);
          // background: url(../../assets/contests/head_selected.png) no-repeat
          //   center top;
          // border: 2px solid rgb(4, 62, 147);
          color: #fff;
          background: rgb(4, 62, 147);
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
.contests-dynamic-menu {
  .el-dropdown-menu__item{
    padding: 0 40px;
    font-size: 18px;
  }
}
@media screen and (max-width: 768px) {
  .contests-page {
    &-top {
      &-streamer {
        width: 90%;
        background-size: 100% 100%;
        font-size: 14px;
        margin: 10px auto;
      }
      &-title {
        max-width: 90%;
        background-size: 100% 100%;
        margin: 0 auto;
        height: calc((100vw - 36px) / 692 * 184);
      }
      &-specifier {
        font-size: 18px;
      }
      &-tab {
        width: 100vw - 6;
        overflow-x: scroll;
        display: block;
        position: relative;
        z-index: 999;
        &-phone-wrap {
          width: 460px;
        }
        &-item {
          display: inline-block;
          width: auto;
          padding: 0 10px;
          font-size: 16px;
          color: #212121;
          opacity: 0.5;
          height: 48px;
          line-height: 48px;
          margin-top: 20px;
          &.selected-item {
            opacity: 1;
            color: #212121;
            background: none;
          }
        }
      }
    }
  }
}
</style>

