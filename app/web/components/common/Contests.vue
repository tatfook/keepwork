<template>
  <div class="contests">
    <!-- <div class="contests-banner">暂时没有图片</div> -->
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
    <div class="contests-hint" v-if="false">
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
        <p class="contests-games-box-time"><i class="iconfont icon-time-circle"></i> 2019/7/1 ~ 7/15</p>
      </div>
      <div class="contests-games-box" @click="goRelatedLinks('http://s.noc.net.cn/Student/Index')">
        <div class="contests-games-box-top">
          <img class="contests-games-box-top-img" src="@/assets/contests/c.png" alt="">
        </div>
        <h4 class="contests-games-box-title">全国中小学信息技术创新与实践大赛 <span class="contests-games-box-title-num">4项</span></h4>
        <p class="contests-games-box-subject">计算机科学</p>
        <p class="contests-games-box-time"><i class="iconfont icon-time-circle"></i> 截止日期：2019/5/30前</p>
      </div>
      <div class="contests-games-box" @click="goRelatedLinks('/NPL')" v-if="currentNPLgameInfo.no !== 0">
        <div class="contests-games-box-top">
          <!-- <img class="contests-games-box-top-img" src="@/assets/contests/c.png" alt=""> -->
          <p class="contests-games-box-top-text">NPL大赛第{{currentNPLgameInfo.no}}期</p>
        </div>
        <h4 class="contests-games-box-title">NPL大赛第{{currentNPLgameInfo.no}}期</h4>
        <p class="contests-games-box-subject"></p>
        <p class="contests-games-box-time"><i class="iconfont icon-time-circle"></i> 截止日期：{{currentNPLgameInfo.endDate | formatTime}}前</p>
      </div>
      <!-- <div class="contests-games-box" @click="goRelatedLinks('keepwork.com/NPL')">
        <div class="contests-games-box-top">
          <img class="contests-games-box-top-img" src="@/assets/contests/c.png" alt="">
          <p class="contests-games-box-top-text">汉字大赛</p>
        </div>
        <h4 class="contests-games-box-title">汉字大赛 </h4>
        <p class="contests-games-box-subject"></p>
        <p class="contests-games-box-time"><i class="iconfont icon-time-circle"></i> 截止日期：2019/5/30前</p>
      </div> -->
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
      <div class="contests-exhibition-box" v-for="(gameInfo,index) in exhibitionDataOptimize" :key="index" @click="goRelatedLinks('/exhibition')">
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
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'Contests',
  data() {
    return {
      exhibitionData: [
        {
          gameLogo: require('@/assets/contests/contest_1.png'),
          gameName: '全国青少年科技创新大赛',
          gameEntriesIcon: 'icon-image-fill',
          gameEntrierText: '参赛作品',
          gameWorksCount: '0个'
        },
        {
          gameLogo: require('@/assets/contests/contest_1.png'),
          gameName: '全国青少年科技创新大赛',
          gameEntriesIcon: 'icon-trophy-fill',
          gameEntrierText: '获奖作品',
          gameWorksCount: '0个'
        },
        {
          gameLogo: require('@/assets/contests/contest_3.png'),
          gameName: '全国中小学科学影像节',
          gameEntriesIcon: 'icon-image-fill',
          gameEntrierText: '参赛作品',
          gameWorksCount: '0个'
        },
        {
          gameLogo: require('@/assets/contests/contest_3.png'),
          gameName: '全国中小学科学影像节',
          gameEntriesIcon: 'icon-trophy-fill',
          gameEntrierText: '获奖作品',
          gameWorksCount: '0个'
        },
        {
          gameLogo: require('@/assets/contests/contest_2.png'),
          gameName: '全国中小学信息技术创新与实践大赛',
          gameEntriesIcon: 'icon-image-fill',
          gameEntrierText: '参赛作品',
          gameWorksCount: '0个'
        },
        {
          gameLogo: require('@/assets/contests/contest_2.png'),
          gameName: '全国中小学信息技术创新与实践大赛',
          gameEntriesIcon: 'icon-trophy-fill',
          gameEntrierText: '获奖作品',
          gameWorksCount: '0个'
        },
        {
          gameLogo: require('@/assets/contests/contest_1.png'),
          gameName: 'NPL大赛',
          gameEntriesIcon: 'icon-image-fill',
          gameEntrierText: '参赛作品',
          gameWorksCount: '0个'
        },
        {
          gameLogo: require('@/assets/contests/contest_1.png'),
          gameName: 'NPL大赛',
          gameEntriesIcon: 'icon-trophy-fill',
          gameEntrierText: '获奖作品',
          gameWorksCount: '0个'
        },
        {
          gameLogo: require('@/assets/contests/contest_4.png'),
          gameName: '汉字大赛',
          gameEntriesIcon: 'icon-image-fill',
          gameEntrierText: '参赛作品',
          gameWorksCount: '0个'
        },
        {
          gameLogo: require('@/assets/contests/contest_4.png'),
          gameName: '汉字大赛',
          gameEntriesIcon: 'icon-trophy-fill',
          gameEntrierText: '获奖作品',
          gameWorksCount: '0个'
        }
      ],
      workStatistics: {}
    }
  },
  computed: {
    ...mapGetters({
      gamesList: 'pbl/gamesList'
    }),
    exhibitionDataOptimize() {
      return _.filter(
        this.exhibitionData,
        game => game.gameWorksCount !== '0个'
      )
    },
    NPLgameInfo() {
      return _.filter(this.gamesList.rows, game => game.name == 'NPL大赛')
    },
    currentNPLgameInfo() {
      let currentData = _.filter(this.NPLgameInfo, game => {
        let startTime = new Date(game.startDate).getTime()
        let endTime = new Date(game.endDate).getTime()
        let nowTime = new Date().getTime()
        return nowTime >= startTime && nowTime <= endTime
      })
      return currentData[0] || { no: 0 }
    }
  },
  async mounted() {
    await this.getGamesList()
    this.workStatistics = await this.getGameWorksStatistics()

    let allWorksList = _.get(this.workStatistics, 'list')
    for (let i = 0; i < this.exhibitionData.length; i = i + 2) {
      for (let j = 0; j < allWorksList.length; j++) {
        if (this.exhibitionData[i].gameName == allWorksList[j].name) {
          this.exhibitionData[i].gameWorksCount = allWorksList[j].count + '个'
        }
      }
    }

    let winWorksList = _.get(this.workStatistics, 'winlist')
    for (let i = 1; i < this.exhibitionData.length; i = i + 2) {
      for (let j = 0; j < winWorksList.length; j++) {
        if (this.exhibitionData[i].gameName == winWorksList[j].name) {
          this.exhibitionData[i].gameWorksCount = winWorksList[j].count + '个'
        }
      }
    }
  },

  methods: {
    ...mapActions({
      getGamesList: 'pbl/getGamesList',
      getGameWorksStatistics: 'pbl/getGameWorksStatistics'
    }),
    goRelatedLinks(url) {
      window.open(url)
    }
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY/M/D')
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
        background-color: rgb(229, 243, 255);
        border-radius: 10px 10px 0 0;
        height: 104px;
        box-sizing: border-box;
        &-img {
          height: 60px;
          width: 100%;
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
      cursor: pointer;
      margin: 0 16px 16px 0;
      width: 288px;
      background: #fff;
      padding: 21px 0 12px 0;
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
@media screen and (max-width: 768px) {
  .contests {
    &-games {
      display: block;
      &-box {
        margin: 20px;
        width: 90%;
      }
    }
    &-exhibition {
      display: block;
      &-box {
        margin: 20px auto;
      }
    }
  }
}
</style>