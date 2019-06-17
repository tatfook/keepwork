<template>
  <div class="contests-home-page">
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_1.png" alt=""></h3>
    <p class="contests-home-page-paragraph">
      汉字是中华民族的文化瑰宝，是传颂中华文明的基本符号，是传承中华民族精神的血脉基因，而姓氏文化精粹《百家姓》作为中华传统文化经典国学，记录着祖先一脉相承的智慧，是蒙学教育的识字读本。人工智能时代正在开启，编程教育席卷而来，呼吁用科技去创造未来。
    </p>
    <p class="contests-home-page-paragraph">
      为了让中华民族优秀传统文化跳动时代的脉搏，2019年，大富配天集团携手中视科华举办“用计算机程序让汉字活起来 走向世界”内容创作大赛，面向全球征集 以中国自主原创的3D动画和编程软件Paracraft（创意空间）软件为创作工具，以《百家姓》的姓氏文化演绎为内容的视频作品。通过本届大赛用计算机代码激活汉字的灵动性，让汉字在人工智能时代独领风骚，让汉字的方块构造演绎出国人的刚正不阿的气骨，续写民族之魂。
    </p>
    <div class="contests-home-page-brief">
      <p class="contests-home-page-brief-text"><span class="contests-home-page-brief-text-left">·大赛主题：</span><span class="contests-home-page-brief-text-right">用计算机程序让汉字活起来走向世界。</span></p>
      <p class="contests-home-page-brief-text"><span class="contests-home-page-brief-text-left">·创作内容：</span><span class="contests-home-page-brief-text-right">利用自主原创的3D动画、编程软件Paracraft创意空间围绕《百家姓》创作能够充分体现汉字姓氏文化的视频短片。</span></p>
      <p class="contests-home-page-brief-text"><span class="contests-home-page-brief-text-left">·指定创作工具：</span><span class="contests-home-page-brief-text-right">Paracraft创意空间<a href="#" class="download-paracraft">下载Paracraft</a></span></p>
    </div>
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_2.png" alt=""></h3>
    <div class="contests-home-page-progress">
      <div class="contests-home-page-progress-item">
        <div class="contests-home-page-progress-item-left">
          <img src="@/assets/contests/time_1.png" alt="">
        </div>
        <div class="contests-home-page-progress-item-right">
          <p class="contests-home-page-progress-item-right-title">作品征集</p>
          <p class="contests-home-page-progress-item-right-time">2019年4月~11月30日</p>
        </div>
      </div>
      <div class="contests-home-page-progress-arrow">
        <img src="@/assets/contests/arrow_time.png" alt="">
      </div>
      <div class="contests-home-page-progress-item">
        <div class="contests-home-page-progress-item-left">
          <img src="@/assets/contests/time_2.png" alt="">
        </div>
        <div class="contests-home-page-progress-item-right">
          <p class="contests-home-page-progress-item-right-title">投票和评审</p>
          <p class="contests-home-page-progress-item-right-time">2019年12月</p>
        </div>
      </div>
      <div class="contests-home-page-progress-arrow">
        <img src="@/assets/contests/arrow_time.png" alt="">
      </div>
      <div class="contests-home-page-progress-item">
        <div class="contests-home-page-progress-item-left">
          <img src="@/assets/contests/time_3.png" alt="">
        </div>
        <div class="contests-home-page-progress-item-right">
          <p class="contests-home-page-progress-item-right-title">获奖公示</p>
          <p class="contests-home-page-progress-item-right-time">2019年12月</p>
        </div>
      </div>
    </div>
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_3.png" alt=""></h3>
    <div class="contests-home-page-awards">
      <div class="contests-home-page-awards-box award_1">
        <p>· 荣誉奖 ·</p>
      </div>
      <div class="contests-home-page-awards-box award_2"></div>
      <div class="contests-home-page-awards-box award_3"></div>
    </div>
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_4.png" alt=""></h3>
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_5.png" alt=""></h3>
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_6.png" alt=""></h3>
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_7.png" alt=""></h3>
  </div>
</template>
<style lang="scss" scoped>
.contests-home-page {
  &-title {
    text-align: center;
    margin: 30px 0 0;
  }
  &-paragraph {
    max-width: 928px;
    margin: 0 auto;
    font-family: 'STKaiti';
    font-size: 18px;
    color: #000000;
    line-height: 32px;
    text-indent: 30px;
    text-align: center;
    font-weight: bold;
    margin-bottom: 18px;
  }
  &-brief {
    max-width: 970px;
    min-height: 228px;
    margin: 0 auto;
    padding-top: 50px;
    background: url(../../assets/contests/paper.png) no-repeat top center;
    &-text {
      max-width: 780px;
      font-family: 'STKaiti';
      font-weight: bold;
      margin: 0 auto;
      font-size: 18px;
      line-height: 32px;
      color: #2e281b;
      box-sizing: border-box;
      display: flex;
      &-left {
        width: 154px;
        text-align: right;
        color: #6e1612;
      }
      &-right {
        flex: 1;
        .download-paracraft {
          color: #609db6;
          text-decoration: underline;
        }
      }
    }
  }
  &-progress {
    max-width: 1020px;
    margin: 0 auto;
    display: flex;
    &-item {
      // width: 292px;
      padding-left: 20px;
      display: flex;
      &-left {
        width: 68px;
      }
      &-right {
        flex: 1;
        font-size: 24px;
        font-family: 'STKaiti';
        &-title {
          color: #13232f;
          font-weight: bold;
          margin: 10px;
        }
        &-time {
          color: #8b97a2;
          margin: 0 0 0 10px;
        }
      }
    }
    &-arrow {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  &-awards {
    display: flex;
    justify-content: center;
    &-box {
      width: 325px;
      height: 510px;
      margin: 10px;
      @each $bg in award_1, award_2, award_3 {
        &.#{$bg} {
          background: url('../../assets/contests/#{$bg}.png')
            no-repeat
            center
            top;
        }
      }
    }
  }
}
</style>
     