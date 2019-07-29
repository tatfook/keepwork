<template>
  <div class="contests-dynamic">
    <div class="contests-dynamic-tab">
      <span :class="['contests-dynamic-tab-btn',{'selected': cureentSeleted == 0}]" @click="switchTab(0)">精品赏析</span>
      <span :class="['contests-dynamic-tab-btn',{'selected': cureentSeleted == 1}]" @click="switchTab(1)">新闻动态</span>
    </div>
    <div class="contests-dynamic-works" v-show="cureentSeleted === 0">
      <div class="contests-dynamic-works-box" v-for="(item, index) in worksData" :key="index" @click="playVideo(index)">
        <div class="contests-dynamic-works-box-cover">
          <img class="contests-dynamic-works-box-cover-img" :src="item.coverUrl" alt="">
          <img class="contests-dynamic-works-box-cover-play" src="@/assets/contests/handpick/play.svg" alt="播放">
        </div>
        <h4 class="contests-dynamic-works-box-title">{{item.title}}</h4>
        <p class="contests-dynamic-works-box-author">{{item.author}}</p>
      </div>
    </div>
    <div class="contests-dynamic-news" v-show="cureentSeleted === 1">
      <div class="contests-dynamic-part" @click="openLink('https://mp.weixin.qq.com/s/5npjVGyKdpEMhG1UK82sLQ')">
        <div class="contests-dynamic-part-left">
          <img class="contests-dynamic-part-left-img" src="@/assets/contests/a1.png" alt="">
        </div>
        <div class="contests-dynamic-part-right">
          <p class="contests-dynamic-part-right-notice">汉字大赛 | 创作技巧大放送（一）</p>
          <p class="contests-dynamic-part-right-hint">创作时感觉力不从心，很多技巧都不会？别慌，这里有搭建汉字的速成秘诀！</p>
          <p class="contests-dynamic-part-right-time">2019 / 6 / 27<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
        </div>
      </div>
      <div class="contests-dynamic-part" @click="openLink('https://mp.weixin.qq.com/s/7vmA5tEkAZ1wyUwRV7NzNQ')">
        <div class="contests-dynamic-part-left">
          <img class="contests-dynamic-part-left-img" src="@/assets/contests/a3.png" alt="">
        </div>
        <div class="contests-dynamic-part-right">
          <p class="contests-dynamic-part-right-notice">汉字大赛｜姓氏趣闻一</p>
          <p class="contests-dynamic-part-right-hint">奇葩姓氏你知道几个？</p>
          <p class="contests-dynamic-part-right-time">2019 / 5 / 24<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
        </div>
      </div>
      <div class="contests-dynamic-part" @click="openLink('https://mp.weixin.qq.com/s/F64qcFRRqdAbC25AwdAIcw')">
        <div class="contests-dynamic-part-left">
          <img class="contests-dynamic-part-left-img" src="@/assets/contests/a2.png" alt="">
        </div>
        <div class="contests-dynamic-part-right">
          <p class="contests-dynamic-part-right-notice">“用计算机程序让汉字活起来 走向世界”内容创作大赛征集公告</p>
          <p class="contests-dynamic-part-right-hint">大赛正式启动啦，速速报名参赛吧！</p>
          <p class="contests-dynamic-part-right-time">2019 / 4 / 24<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
        </div>
      </div>
    </div>
    <div v-if="videoDialogVisible" class="contests-dynamic-video-dialog">
      <el-dialog :visible.sync="videoDialogVisible" width="50%" center>
        <video width="100%" :src="currentToPlayerVideo" autoplay controls></video>
      </el-dialog>
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
      cureentSeleted: 0,
      videoDialogVisible: false,
      currentToPlayerVideo: '',
      worksData: [
        {
          title: 'I had a black dog',
          author: '奇仔',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4594/raw#I had a black dog.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/I-had-a-black-dog-海报-400x240.jpg'),
          currentIndex: 0
        },
        {
          title: 'shine your way',
          author: '奇仔',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4595/raw#Shine Your Way.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/ShineYourWay-400x225.jpg'),
          currentIndex: 1
        },
        {
          title: 'To Mars',
          author: '阿杰',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4596/raw#ToMars.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/火星-海报-397x240.jpg'),
          currentIndex: 2
        },
        {
          title: '吃货的一天',
          author: '无心',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4597/raw#吃货的一天.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/吃货的一天-366x240.jpg'),
          currentIndex: 3
        },
        {
          title: '双马尾',
          author: '桃子',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4598/raw#双马尾.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/双马尾-400x219.jpg'),
          currentIndex: 4
        },
        {
          title: '有了想法你怎么做',
          author: '奇仔',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4599/raw#有了想法你怎么做.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/有了想法你怎么做-400x215.jpg'),
          currentIndex: 5
        },
        {
          title: '惧谁',
          author: 'Colin',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4600/raw#惧谁_colin.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/preview.jpg'),
          currentIndex: 6
        },
        {
          title: '美丽心灵',
          author: '柳金辉',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4601/raw#美丽心灵.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/美丽心灵-海报-400x232.jpg'),
          currentIndex: 7
        },
        {
          title: '囚禁',
          author: '阿杰',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4602/raw#囚禁.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/囚禁-400x216.jpg'),
          currentIndex: 8
        },
        {
          title: '山海闻妖录',
          author: '阿杰',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4603/raw#山海闻录.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/山海闻妖录-400x227.jpg'),
          currentIndex: 9
        },
        {
          title: '乌鸦',
          author: '桃子',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4604/raw#乌鸦.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/乌鸦-海报-400x225.jpg'),
          currentIndex: 10
        },
        {
          title: '永生的雪人',
          author: '无心',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4606/raw#永生的雪人.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/永生的雪人-400x225.jpg'),
          currentIndex: 11
        },
        {
          title: '宇宙快递',
          author: 'HM',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4607/raw#宇宙快递.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/宇宙快递-400x230.jpg'),
          currentIndex: 12
        },
        {
          title: '森林之王动画版',
          author: '阿杰',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4608/raw#森林之王动画版.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/76486d50-3991-11e9-a18e-95eb0ea25f14.png'),
          currentIndex: 13
        },
        {
          title: '致匠心',
          author: '奇仔',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4609/raw#致匠心.mp4',
          coverUrl: require('@/assets/contests/handpickWorksCover/致匠心-400x235.jpg'),
          currentIndex: 14
        }
      ]
    }
  },
  methods: {
    switchTab(index) {
      this.cureentSeleted = index
    },
    openLink(url) {
      window.open(url)
    },
    playVideo(index) {
      this.videoDialogVisible = true
      this.currentToPlayerVideo = this.worksData[index].videoUrl
    }
  }
}
</script>
<style lang="scss" scoped>
.contests-dynamic {
  padding-top: 40px;
  position: relative;
  max-width: 1920px;
  margin: 0 auto 280px;
  &-tab {
    text-align: center;
    color: #fff;
    padding: 12px;
    margin-bottom: 37px;
    &-btn {
      padding: 10px 20px;
      border-radius: 20px;
      background: #999;
      cursor: pointer;
      &.selected {
        background: #003f8d;
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
  &-works {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    &-box {
      max-width: 320px;
      cursor: pointer;
      background: #fff;
      margin: 0 2px 10px 2px;
      &-cover {
        position: relative;
        &-img {
          width: 100%;
          height: 183px;
          object-fit: cover;
        }
        &-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      &-title {
        font-size: 18px;
        color: #333;
        padding-left: 16px;
        margin: 4px 0;
      }
      &-author {
        font-size: 14px;
        padding-left: 16px;
        color: #999;
        margin: 4px 0;
      }
    }
  }
  &-part {
    max-width: 980px;
    min-height: 258px;
    display: flex;
    margin: 12px auto;
    box-sizing: border-box;
    padding: 22px 20px 0 22px;
    background-size: 100%;
    border: 2px solid transparent;
    cursor: pointer;
    &:hover {
      border: 2px solid #043e93;
    }
    &-left {
      &-img {
        width: 380px;
        object-fit: cover;
      }
    }
    &-right {
      padding-left: 20px;
      flex: 1;
      &-notice {
        font-size: 22px;
        color: #212121;
      }
      &-hint {
        font-size: 18px;
        color: #999;
      }
      &-time {
        color: #999;
        margin-top: 70px;
        &-right {
          float: right;
        }
      }
    }
  }
  &-video-dialog {
    /deep/ .el-dialog {
      background: rgba(0, 0, 0, 0);
      box-shadow: none;
      min-width: 510px !important;
      .el-dialog__header {
        padding: 20px;
        position: relative;
        .el-dialog__headerbtn {
          border-radius: 50%;
          position: absolute;
          top: -4px;
          right: -30px;
          padding: 5px;
          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          .el-icon-close:before {
            color: #fff;
            font-size: 36px;
          }
        }
      }
      .el-dialog__body {
        padding: 0;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .contests-dynamic {
    &-bgpic {
      display: none;
    }
    &-part {
      display: block;
      margin: 16px;
      &-left {
        &-img {
          width: 100%;
          max-width: 400px;
          height: calc((100vw - 28px) / 317 * 179);
        }
      }
      &-right {
        padding: 0;
        &-notice {
          font-size: 16px;
        }
        &-hint {
          font-size: 14px;
        }
        &-time {
          margin: 0;
        }
      }
    }
    &-works {
      &-box {
        max-width: 44%;
        margin: 0 8px 10px 8px;
        &-cover {
          &-img {
            height: 100px;
          }
        }
         &-title {
           font-size: 16px;
         }
      }
    }
    &-video-dialog {
      /deep/ .el-dialog {
        min-width: 85% !important;
        .el-dialog__header {
          .el-dialog__headerbtn {
            top: -2px;
            right: -20px;
            .el-icon-close:before {
              font-size: 26px;
            }
          }
        }
      }
    }
  }
}
</style>


