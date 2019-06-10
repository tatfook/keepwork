<template>
  <div class="contests">
    <div class="contests-banner"></div>
    <div class="contests-tab">
      <div class="contests-tab-option contests-tab-option-selected">赛事预告</div>
      <div class="contests-tab-option" @click="goRelatedLinks('/exhibition')">在线展厅</div>
    </div>
    <div class="contests-title">
      <span class="contests-title-icon">
        <img src="@/assets/contests/contest_icon.png" alt="">
      </span>
      <span class="contests-title-text">赛事预告</span>
      <span class="contests-title-icon">
        <img src="@/assets/contests/contest_icon.png" alt="">
      </span>
    </div>
    <div class="contests-hint">
      全国青少年科技创新大赛、全国青少年科学影像节、全国中小学信息技术创新与实践活动，每年都会定期举办，你可以提前准备明年的参赛作品，使用Paracraft制作的作品参加全国性赛事，请与我们联系，有惊喜大礼等你拿。<span class="contests-hint-contact">(联系电话：123 4567 7890)</span>
    </div>
    <div class="contests-games">
      <div class="contests-games-box" @click="goRelatedLinks('http://castic.xiaoxiaotong.org/')">
        <div class="contests-games-box-top">
          <img class="contests-games-box-top-img" src="@/assets/contests/a.png" alt="">
        </div>
        <h4 class="contests-games-box-title">全国青少年科技创新大赛 <span class="contests-games-box-title-num">1项</span></h4>
        <p class="contests-games-box-subject">计算机科学</p>
        <p class="contests-games-box-time"><i class="iconfont icon-time-circle"></i> 2019/3/20 ~ 4/20 中午 12 : 00</p>
      </div>
      <div class="contests-games-box" @click="goRelatedLinks('http://casvf.xiaoxiaotong.org/')">
        <div class="contests-games-box-top">
          <img class="contests-games-box-top-img" src="@/assets/contests/b.png" alt="">
        </div>
        <h4 class="contests-games-box-title">全国中小学科学影像节 <span class="contests-games-box-title-num">1项</span></h4>
        <p class="contests-games-box-subject">计算机科学</p>
        <p class="contests-games-box-time"><i class="iconfont icon-time-circle"></i> 2019/1 ~ 7/15</p>
      </div>
      <div class="contests-games-box" @click="goRelatedLinks('http://s.noc.net.cn/Student/Index')">
        <div class="contests-games-box-top">
          <img class="contests-games-box-top-img" src="@/assets/contests/c.png" alt="">
        </div>
        <h4 class="contests-games-box-title">全国中小学信息技术创新与实践大赛 <span class="contests-games-box-title-num">4项</span></h4>
        <p class="contests-games-box-subject">计算机科学</p>
        <p class="contests-games-box-time"><i class="iconfont icon-time-circle"></i> 截止日期：2019/5/30前</p>
      </div>
      <div class="contests-games-box" @click="goRelatedLinks('keepwork.com/NPL')">
        <div class="contests-games-box-top">
          <!-- <img class="contests-games-box-top-img" src="@/assets/contests/c.png" alt=""> -->
          <p class="contests-games-box-top-text">NPL大赛第5期</p>
        </div>
        <h4 class="contests-games-box-title">NPL大赛第5期</h4>
        <p class="contests-games-box-subject"></p>
        <p class="contests-games-box-time"><i class="iconfont icon-time-circle"></i> 截止日期：2019/5/30前</p>
      </div>
      <div class="contests-games-box" @click="goRelatedLinks('keepwork.com/NPL')">
        <div class="contests-games-box-top">
          <!-- <img class="contests-games-box-top-img" src="@/assets/contests/c.png" alt=""> -->
          <p class="contests-games-box-top-text">汉字大赛</p>
        </div>
        <h4 class="contests-games-box-title">汉字大赛 </h4>
        <p class="contests-games-box-subject"></p>
        <p class="contests-games-box-time"><i class="iconfont icon-time-circle"></i> 截止日期：2019/5/30前</p>
      </div>
    </div>
    <div class="contests-title">
      <span class="contests-title-icon">
        <img src="@/assets/contests/contest_icon.png" alt="">
      </span>
      <span class="contests-title-text">在线展厅</span>
      <span class="contests-title-icon">
        <img src="@/assets/contests/contest_icon.png" alt="">
      </span>
    </div>
    <div class="contests-exhibition">
      <div class="contests-exhibition-box" v-for="(gameInfo,index) in exhibitionData" :key="index">
        <div class="contests-exhibition-box-sign">
          <img class="contests-exhibition-box-sign-img" :src="gameInfo.gameLogo" alt="">
        </div>
        <h4 class="contests-exhibition-box-game">{{gameInfo.gameName}}</h4>
        <p class="contests-exhibition-box-join"><i :class="['iconfont', gameInfo.gameEntriesIcon]"></i>{{gameInfo.gameEntrierText}}</p>
        <div class="contests-exhibition-box-count">{{gameInfo.gameWorksCount}}</div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'Contests',
  data(){
    return {
      exhibitionData: [
        {
          gameLogo: require('@/assets/contests/contest_1.png'),
          gameName: '全国青少年科技创新大赛',
          gameEntriesIcon: 'icon-image-fill',
          gameEntrierText: '参赛作品',
          gameWorksCount: '100个'
        },
        {
          gameLogo: require('@/assets/contests/contest_1.png'),
          gameName: '全国青少年科技创新大赛',
          gameEntriesIcon: 'icon-trophy-fill',
          gameEntrierText: '获奖作品',
          gameWorksCount: '20个'
        },
        {
          gameLogo: require('@/assets/contests/contest_3.png'),
          gameName: '全国中小学科学影像节',
          gameEntriesIcon: 'icon-image-fill',
          gameEntrierText: '参赛作品',
          gameWorksCount: '100个'
        },
        {
          gameLogo: require('@/assets/contests/contest_3.png'),
          gameName: '全国中小学科学影像节',
          gameEntriesIcon: 'icon-trophy-fill',
          gameEntrierText: '获奖作品',
          gameWorksCount: '20个'
        },
        {
          gameLogo: require('@/assets/contests/contest_2.png'),
          gameName: '全国中小学信息技术创新与实践大赛',
          gameEntriesIcon: 'icon-image-fill',
          gameEntrierText: '参赛作品',
          gameWorksCount: '100个'
        },
        {
          gameLogo: require('@/assets/contests/contest_2.png'),
          gameName: '全国中小学信息技术创新与实践大赛',
          gameEntriesIcon: 'icon-trophy-fill',
          gameEntrierText: '获奖作品',
          gameWorksCount: '20个'
        },
        {
          gameLogo: require('@/assets/contests/contest_1.png'),
          gameName: 'NPL大赛',
          gameEntriesIcon: 'icon-image-fill',
          gameEntrierText: '参赛作品',
          gameWorksCount: '100个'
        },
        {
          gameLogo: require('@/assets/contests/contest_1.png'),
          gameName: 'NPL大赛',
          gameEntriesIcon: 'icon-trophy-fill',
          gameEntrierText: '获奖作品',
          gameWorksCount: '20个'
        },
        {
          gameLogo: require('@/assets/contests/contest_4.png'),
          gameName: '汉字大赛',
          gameEntriesIcon: 'icon-image-fill',
          gameEntrierText: '参赛作品',
          gameWorksCount: '100个'
        },
        {
          gameLogo: require('@/assets/contests/contest_4.png'),
          gameName: '汉字大赛',
          gameEntriesIcon: 'icon-trophy-fill',
          gameEntrierText: '获奖作品',
          gameWorksCount: '20个'
        },
      ]
    }
  },
  methods: {
    goRelatedLinks(url) {
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.contests {
  max-width: 1200px;
  margin: 20px auto;
  &-banner {
    min-height: 300px;
    border: 1px solid red;
  }
  &-tab {
    background: #fff;
    height: 64px;
    border-radius: 10px;
    display: flex;
    margin: 20px 0;
    align-items: center;
    &-option {
      flex: 1;
      text-align: center;
      height: 17px;
      font-size: 16px;
      cursor: pointer;
      &-selected {
        color: #3895ff;
      }
    }
    .contests-tab-option + .contests-tab-option {
      border-left: 1px solid #e0e4ee;
    }
  }
  &-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    font-size: 20px;
    font-weight: bold;
    margin: 20px;
    padding: 20px 0 0 0;
    &-icon {
      display: flex;
      align-items: center;
    }
    &-text {
      margin: 0 10px;
    }
  }
  &-hint {
    padding: 23px 32px;
    background: rgb(233, 233, 233);
    font-size: 14px;
    color: #909399;
    border-radius: 10px;
    margin: 14px 0;
    &-contact {
      color: #3794ff;
    }
  }
  &-games {
    display: flex;
    flex-wrap: wrap;
    &-box {
      background-color: #fff;
      border-radius: 10px;
      margin: 10px 0;
      min-height: 224px;
      box-sizing: border-box;
      width: 389px;
      margin-right: 15px;
      cursor: pointer;
      &:nth-child(3n) {
        margin-right: 0;
      }
      &-top {
        text-align: center;
        padding: 20px 28px;
        background-color: rgb(229,243,255);
        border-radius: 10px 10px 0 0;
        &-img {
          height: 60px;
        }
        &-text {
          font-size: 38px;
          text-align: center;
          font-style: italic;
          color: #4a9eff;
          margin: 0;
        }
      }
      &-title {
        padding-left: 20px;
        font-size: 16px;
        color: #303133;
        font-family: PingFangSC-Medium;
        margin: 20px 0 10px 0;
        &-num {
          font-size: 14px;
          color: #fff;
          background-color: #f07c0a;
          border-radius: 10px;
          display: inline-block;
          padding: 2px 10px;
        }
      }
      &-subject {
        padding-left: 20px;
        color: #3794ff;
        font-size: 13px;
        margin: 0 0 30px 0;
        height: 18px;
      }
      &-time {
        padding-left: 20px;
        font-size: 14px;
        color: #909399;
      }
    }
  }
  &-exhibition {
    display: flex;
    flex-wrap: wrap;
    &-box {
      margin: 0 16px 16px 0;
      width: 288px;
      background: #fff;
      padding: 21px 0  12px 0;
      border-radius: 10px;
      &:nth-child(4n) {
        margin-right: 0;
      }
      &-sign {
        text-align: center;
        &-img {
        }
      }
      &-game {
        margin: 16px 0 11px 0;
        text-align: center;
        font-size: 16px;
        color: #303133;
        font-family: PingFangSC-Semibold;
      }
      &-join {
        text-align: center;
        font-size: 14px;
        color: #909399;
        display: flex;
        justify-content: center;
        i {
          margin-right: 7px;
        }
      }
      &-count {
        margin: 0 20px;
        background: #f5f5f5;
        text-align: center;
        padding: 10px 0;
        color: #f07c0a;
        font-weight: bold;
        border-radius: 10px;
      }
    }
  }
}
</style>