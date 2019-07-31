<template>
  <div class="contests-dynamic-works">
    <div class="contests-dynamic-works-box" v-for="(item, index) in worksData" :key="index" @click="playVideo(index)">
      <div class="contests-dynamic-works-box-cover">
        <img class="contests-dynamic-works-box-cover-img" :src="item.coverUrl" alt="">
        <img class="contests-dynamic-works-box-cover-play" src="@/assets/contests/handpick/play.svg" alt="播放">
      </div>
      <h4 class="contests-dynamic-works-box-title">{{item.title}}</h4>
      <p class="contests-dynamic-works-box-author">{{item.author}}</p>
    </div>
    <div v-if="videoDialogVisible" class="contests-dynamic-video-dialog">
      <el-dialog :visible.sync="videoDialogVisible" width="50%" center>
        <video width="100%" :src="currentToPlayerVideo" autoplay controls></video>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ContestsDynamicWorks',
  data() {
    return {
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
    playVideo(index) {
      this.videoDialogVisible = true
      this.currentToPlayerVideo = this.worksData[index].videoUrl
    }
  }
}
</script>
<style lang="scss" scoped>
.contests-dynamic {
  &-works {
    max-width: 1006px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    &-box {
      width: 320px;
      cursor: pointer;
      background: #fff;
      margin: 0 7px 18px;
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
    &-works {
      justify-content: center;
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


