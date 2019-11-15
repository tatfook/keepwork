<template>
  <div class="study-home-region">
    <div class="study-home-region-banner">
      <div class="study-home-region-banner-center">
        <div class="study-home-region-banner-center-img"><img src="@/assets/study/title.png" alt="编程学习"></div>
        <div class="study-home-region-banner-center-desc">
          <p class="study-home-region-banner-center-desc-text">你是动画爱好者？还是希望提升编程技能？<br>Keepwork专为各个年龄段、水平的3D动画与编程学习者提供了配套的学习资源，从编程书籍到课程学习。</p>
        </div>
        <div class="study-home-region-banner-center-go"><span class="study-home-region-banner-center-go-text">从中选择适合你的学习内容吧！</span></div>
      </div>
    </div>
    <div class="study-home-region-module">
      <div class="study-home-region-module-box" v-for="(i,index) in centerIntroData" :key="index">
        <img class="study-home-region-module-box-img" :src="i.imgUrl" :alt="i.title" @click="learnMore(i.moreLink)">
        <h4 class="study-home-region-module-box-title" @click="learnMore(i.moreLink)">{{i.title}}</h4>
        <div class="study-home-region-module-box-intro">
          <div class="study-home-region-module-box-intro-text">
            <p class="study-home-region-module-box-intro-text-word">{{i.text_1}}</p>
            <p class="study-home-region-module-box-intro-text-word">{{i.text_2}}</p>
          </div>
          <div class="study-home-region-module-box-intro-more">
            <span class="study-home-region-module-box-intro-more-btn" @click="learnMore(i.moreLink)">{{i.moreLinkText||'了解更多'}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StudyPage',
  data() {
    return {
      centerIntroData: [
        {
          imgUrl: require('@/assets/study/book.png'),
          title: '教材购买',
          text_1: 'Paracraft编程入门',
          text_2: '学生、家长、教师的AI与编程入门教材，适合7岁以上用户使用',
          moreLink: `${window.location.origin}/s/textbook`
        },
        {
          imgUrl: require('@/assets/study/document.png'),
          title: '免费文档',
          text_1: '免费在线资料',
          text_2: '通过免费的在线资料进行学习，涵盖动画、编程、CAD',
          moreLink: `https://keepwork.com/official/docs/index`
        },
        {
          imgUrl: require('@/assets/study/lesson.png'),
          title: '在线视频',
          text_1: '3D动画编程在线教学视频',
          text_2: '沉浸式学习3D动画与编程语言知识点',
          moreLink: 'https://keepwork.com/official/docs/videoguide',
          moreLinkText: '点击进入'
        },
        {
          imgUrl: require('@/assets/study/teaching.png'),
          title: '进修培训',
          text_1: '提升逻辑思维和创造力',
          text_2: '挑选合适的机构系统化地学习3D动画与编程',
          moreLink: `${window.location.origin}/s/lesson/organizationCooperation`,
          moreLinkText: '点击进入'
        }
      ],
      teachingGroupLink: `${window.location.origin}/s/teachingGroup`
    }
  },
  methods: {
    learnMore(link) {
      if (link == `${window.location.origin}/s/textbook`) {
        this.$router.push('/textbook')
        return
      }
      window.location.href = link
    }
  }
}
</script>

<style lang="scss" scoped>
.study-home-region {
  &-banner {
    background: url(../../assets/study/banner.png) center top no-repeat;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      min-height: 461px;
      border: 1px solid transparent;
      &-img {
        text-align: center;
        margin: 100px auto 0;
        img {
          max-width: 100%;
        }
      }
      &-desc {
        text-align: center;
        margin: 0 auto;
        &-text {
          color: #fff;
          line-height: 30px;
          font-size: 16px;
          font-family: 'PingFangSC-Regular';
        }
      }
      &-go {
        display: flex;
        align-content: center;
        justify-content: center;
        &-text {
          display: inline-block;
          color: #fff;
          background: url('../../assets/study/bannerTextBg.png') center/contain
            no-repeat;
          border-radius: 20px;
          font-size: 18px;
          padding: 20px 70px;
          font-weight: bold;
        }
      }
    }
  }
  &-module {
    max-width: 1200px;
    margin: 12px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &-box {
      width: 588px;
      box-sizing: border-box;
      padding: 16px;
      background: #fff;
      border-radius: 10px;
      margin: 12px 0;
      &-img {
        width: 100%;
        height: 299px;
        object-fit: cover;
        cursor: pointer;
      }
      &-title {
        font-family: 'PingFangSC-Semibold';
        font-size: 24px;
        padding-left: 15px;
        color: #303133;
        margin: 20px 0 16px;
        cursor: pointer;
      }
      &-intro {
        display: flex;
        &-text {
          flex: 1;
          &-word {
            color: #a0a4aa;
            font-size: 14px;
            margin: 6px 0 6px 13px;
          }
        }
        &-more {
          min-width: 108px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          &-btn {
            color: #2397f3;
            border-radius: 18px;
            border: solid 1px #2397f3;
            padding: 7px 24px;
            font-size: 14px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
