<template>
  <div class="study-home-region">
    <div class="study-home-region-banner">
      <div class="study-home-region-banner-center"></div>
    </div>
    <div class="study-home-region-module">
      <div class="study-home-region-module-box" v-for="(i,index) in centerIntroData" :key="index">
        <img class="study-home-region-module-box-img" :src="i.imgUrl" alt="">
        <h4 class="study-home-region-module-box-title">{{i.title}}</h4>
        <div class="study-home-region-module-box-intro">
          <div class="study-home-region-module-box-intro-text">
            <p class="study-home-region-module-box-intro-text-word">{{i.text_1}}</p>
            <p class="study-home-region-module-box-intro-text-word">{{i.text_2}}</p>
          </div>
          <div class="study-home-region-module-box-intro-more">
            <span class="study-home-region-module-box-intro-more-btn" @click="learnMore(i.moreLink)">了解更多</span>
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
          moreLink: `${window.location.origin}/s/document`
        },
        {
          imgUrl: require('@/assets/study/lesson.png'),
          title: '在线课程',
          text_1: '通过一流的在线课程学习编程',
          text_2: 'Keepwork官方认证课程可在线进行自主学习并提供系统的学习路径。',
          moreLink: `${window.location.origin}/s/lessonPackage`
        },
        {
          imgUrl: require('@/assets/study/teaching.png'),
          title: '教师和学生',
          text_1: '赋予学生创造力',
          text_2: '为学校、培训机构提供优惠的教学资源。',
          moreLink: 'https://biz.keepwork.com/'
        },
      ]
    }
  },
  methods: {
    learnMore(link){
      window.open(link)
    }
  }
}
</script>

<style lang="scss" scoped>
.study-home-region {
  &-banner {
    margin-top: -116px;
    background: url(../../assets/study/banner.png) center top no-repeat;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      min-height: 461px;
    }
  }
  &-module {
    max-width: 1200px;
    margin: 12px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
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
      }
      &-title {
        font-family: 'PingFangSC-Semibold';
        font-size: 24px;
        padding-left: 15px;
        color: #303133;
        margin: 24px 0 21px;
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

