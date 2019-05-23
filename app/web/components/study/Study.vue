<template>
  <div class="study-home-region">
    <div class="study-home-region-banner">
      <div class="study-home-region-banner-center">
        <div class="study-home-region-banner-center-img"><img src="@/assets/study/title.png" alt=""></div>
        <div class="study-home-region-banner-center-desc">
          <p class="study-home-region-banner-center-desc-text">你是动画爱好者？还是希望提升编程技能？<br>keepwork为各个阶段、水平的3D动画与编程学习者提供了多种多样的学习资源，从免费的教程到现场培训。</p>
        </div>
        <div class="study-home-region-banner-center-go"><span class="study-home-region-banner-center-go-text">从中选择适合你的学习内容吧！</span></div>
      </div>
    </div>
    <div class="study-home-region-module">
      <div class="study-home-region-module-box" v-for="(i,index) in centerIntroData" :key="index">
        <img class="study-home-region-module-box-img" :src="i.imgUrl" alt="" @click="learnMore(i.moreLink)">
        <h4 class="study-home-region-module-box-title" @click="learnMore(i.moreLink)">{{i.title}}</h4>
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
    <div class="study-home-region-teachers">
      <div class="study-home-region-teachers-desc">
        <h4 class="study-home-region-teachers-desc-title">师资团队</h4>
        <p class="study-home-region-teachers-desc-text">我们的师资团队由拥有丰富教学经验和多年开发经验的职业程序员组成，致力于拓展编程教育愿景，希望能够帮助中国培养下一代优秀的程序员，也帮助更广大家庭的孩子们学会自主学习的方法。</p>
        <span class="study-home-region-teachers-desc-more" @click="learnMore(teachingGroupLink)">了解更多</span>
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
          title: '在线课程',
          text_1: '通过一流的在线课程学习编程',
          text_2:
            'Keepwork官方认证课程可在线进行自主学习并提供系统的学习路径。',
          moreLink: `${window.location.origin}/s/lesson`
        },
        {
          imgUrl: require('@/assets/study/teaching.png'),
          title: '学校和培训机构',
          text_1: '赋予学生创造力',
          text_2: '为学校、培训机构提供优惠的教学资源。',
          moreLink: 'https://biz.keepwork.com/'
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
      border: 1px solid transparent;
      &-img {
        width: 396px;
        height: 120px;
        margin: 160px auto 0;
        img {
          width: 100%;
        }
      }
      &-desc {
        max-width: 670px;
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
          padding: 9px 18px;
          color: rgb(34, 106, 236);
          background: #fff;
          border-radius: 20px;
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
  &-teachers {
    max-width: 1200px;
    margin: 0 auto 24px;
    min-height: 300px;
    background: url(../../assets/study/teacher.png) center top no-repeat;
    &-desc {
      max-width: 630px;
      color: #fff;
      padding: 10px 0 0 30px;
      &-title {
        font-size: 24px;
      }
      &-text {
        font-size: 14px;
        line-height: 36px;
      }
      &-more {
        display: inline-block;
        padding: 9px 22px;
        border: 1px solid #fff;
        border-radius: 18px;
        font-size: 14px;
        margin-top: 48px;
        cursor: pointer;
      }
    }
  }
}
</style>

