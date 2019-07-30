<template>
  <div class="contests-home-page">
    <h3 class="contests-home-page-title"><img src="@/assets/contests/handpick_title.png" alt=""></h3>
    <div class="contests-home-page-handpick">
      <p class="contests-home-page-handpick-hint">
        *精品赏析的作品不参加比赛
        <a class="contests-home-page-handpick-hint-more" href="/han/contestsDynamic/works">查看更多>></a>
      </p>
      <div class="contests-home-page-handpick-screen">
        <video-player class="contests-home-page-handpick-screen-video" width="100%" :src='currentHandpick.videoUrl' :poster="currentHandpick.coverUrl" />
        <!-- <video width="100%" :src='currentHandpick.videoUrl' :poster="currentHandpick.coverUrl"></video> -->
        <div class="contests-home-page-handpick-screen-author">
          <h3 class="contests-home-page-handpick-screen-author-title">{{currentHandpick.title}}</h3>
          <p class="contests-home-page-handpick-screen-author-name">{{currentHandpick.author}}</p>
        </div>
      </div>
      <div class="contests-home-page-handpick-videos">
        <span :class="['contests-home-page-handpick-videos-left', {'contests-home-page-handpick-videos-more': currentHandpick.currentIndex > 0}]" @click="priorVideo"></span>
        <span :class="['contests-home-page-handpick-videos-right', {'contests-home-page-handpick-videos-more': currentHandpick.currentIndex < 3}]" @click="nextVideo"></span>
        <div class="contests-home-page-handpick-videos-box" v-for="(item, index) in handpickVideoData" :key="index" @click="selectVideo(index)">
          <img class="contests-home-page-handpick-videos-box-img" :src="item.coverUrl" alt="">
          <div :class="[{'contests-home-page-handpick-videos-box-mask': index !== currentHandpick.currentIndex}]"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import videoPlayer from '@/components/common/VideoPlayer'

export default {
  name: 'Handpick',
  data() {
    return {
      handpickVideoData: [
        {
          title: '宇宙快递',
          author: 'HM',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4607/raw#宇宙快递.mp4',
          coverUrl: require('@/assets/contests/handpick/宇宙快递-400x230.jpg'),
          currentIndex: 0
        },
        {
          title: '致匠心',
          author: '奇仔',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4609/raw#致匠心.mp4',
          coverUrl: require('@/assets/contests/handpick/致匠心-400x235.jpg'),
          currentIndex: 1
        },
        {
          title: 'ToMars',
          author: '阿杰',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4596/raw#ToMars.mp4',
          coverUrl: require('@/assets/contests/handpick/火星-海报-397x240.jpg'),
          currentIndex: 2
        },
        {
          title: '山海闻妖录',
          author: '阿杰',
          videoUrl:
            'https://api.keepwork.com/storage/v0/siteFiles/4603/raw#山海闻录.mp4',
          coverUrl: require('@/assets/contests/handpick/山海闻妖录-400x227.jpg'),
          currentIndex: 3
        }
      ],
      currentHandpick: {
        title: '宇宙快递',
        author: 'HM',
        videoUrl:
          'https://api.keepwork.com/storage/v0/siteFiles/4607/raw#宇宙快递.mp4',
        coverUrl: require('@/assets/contests/handpick/宇宙快递-400x230.jpg'),
        currentIndex: 0
      }
    }
  },
  components: {
    videoPlayer
  },
  methods: {
    selectVideo(index) {
      this.currentHandpick = this.handpickVideoData[index]
    },
    priorVideo() {
      if (this.currentHandpick.currentIndex === 0) return
      let _index = this.currentHandpick.currentIndex - 1
      this.currentHandpick = this.handpickVideoData[_index]
    },
    nextVideo() {
      if (this.currentHandpick.currentIndex === this.handpickVideoData.length - 1)
        return
      let _index = this.currentHandpick.currentIndex + 1
      this.currentHandpick = this.handpickVideoData[_index]
    }
  }
}
</script>
<style lang="scss" scoped>
.contests-home-page {
  &-title {
    text-align: center;
    margin: 70px 0 0;
  }
  &-handpick {
    &-hint {
      max-width: 1000px;
      margin: 0 auto;
      position: relative;
      text-align: center;
      color: #909399;
      font-size: 16px;
      &-more {
        color: #333;
        text-decoration: none;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    &-screen {
      max-width: 1000px;
      padding: 24px;
      background: #fff;
      box-sizing: border-box;
      margin: 20px auto;
      &-video {
        height: 536px;
      }
      &-author {
        text-align: center;
        &-title {
          font-size: 20px;
          color: #333;
          margin: 6px;
        }
        &-name {
          color: #999;
          margin: 6px;
          font-size: 16px;
        }
      }
    }
    &-videos {
      display: flex;
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 40px;
      box-sizing: border-box;
      position: relative;
      &-left {
        position: absolute;
        left: 0;
        top: 38%;
        border: 5px solid rgb(150, 146, 146);
        border-top: 0px;
        border-right: 0px;
        display: inline-block;
        width: 22px;
        height: 22px;
        transform: rotate(45deg);
        margin: 10px;
        cursor: not-allowed;
      }
      &-right {
        position: absolute;
        right: 0;
        top: 38%;
        border: 5px solid rgb(150, 146, 146);
        border-top: 0px;
        border-right: 0px;
        display: inline-block;
        width: 22px;
        height: 22px;
        transform: rotate(-135deg);
        margin: 10px;
        cursor: not-allowed;
      }
      &-more {
        border-color: rgb(71, 68, 68);
        cursor: pointer;
      }
      &-box {
        max-width: 205px;
        height: 115px;
        margin: 0 20px;
        cursor: pointer;
        position: relative;
        &-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        &-mask {
          background: rgba(36, 36, 35, 0.8);
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
  }
}
@media screen and (max-width: 768px){
  .contests-home-page {
    &-title {
      img {
        max-width: 84%;
      }
    }
  &-handpick {
    &-screen {
      &-video {
        height: auto;
      }
    }
    &-videos {
      &-box {
        height: 60px;
        margin: 0 4px;
      }
      &-left {
        left: 20px;
      }
      &-right {
        right: 10px;
      }
      &-left, &-right {
        margin: 0;
        border-width: 3px;
        top: 40%;
        width: 12px;
        height: 12px;
      }
    }
  }
  }  
}
</style>


