<template>
  <div class="contests-home-page">
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_1.png" alt=""></h3>
    <p class="contests-home-page-paragraph">
      汉字是中华民族的文化瑰宝，是传颂中华文明的基本符号，是传承中华民族精神的血脉基因，而姓氏文化精粹《百家姓》作为中华传统文化经典国学，记录着祖先一脉相承的智慧，是蒙学教育的识字读本。人工智能时代正在开启，编程教育席卷而来，呼吁用科技去创造未来。
    </p>
    <p class="contests-home-page-paragraph">
      为了让中华民族优秀传统文化跳动时代的脉搏，2019年，大富配天集团携手中视科华举办“用计算机程序让汉字活起来 走向世界”内容创作大赛，面向全球征集以中国自主原创的3D动画和编程软件Paracraft（创意空间）软件为创作工具，以《百家姓》的姓氏文化演绎为内容的视频作品。通过本届大赛用计算机代码激活汉字的灵动性，让汉字在人工智能时代独领风骚，让汉字的方块构造演绎出国人的刚正不阿的气骨，续写民族之魂。
    </p>
    <div class="contests-home-page-brief">
      <p class="contests-home-page-brief-text"><span class="contests-home-page-brief-text-left">·大赛主题：</span><span class="contests-home-page-brief-text-right">用计算机程序让汉字活起来走向世界。</span></p>
      <p class="contests-home-page-brief-text"><span class="contests-home-page-brief-text-left">·创作内容：</span><span class="contests-home-page-brief-text-right">利用自主原创的3D动画、编程软件Paracraft创意空间围绕《百家姓》创作能够充分体现汉字姓氏文化的视频短片。</span></p>
      <p class="contests-home-page-brief-text"><span class="contests-home-page-brief-text-left">·指定创作工具：</span><span class="contests-home-page-brief-text-right">Paracraft创意空间<a href="http://paracraft.keepwork.com/download?lang=zh" target="_blank" class="download-paracraft">下载Paracraft创意空间</a></span></p>
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
        <div class="contests-home-page-awards-box-text">
          <p class="award-name">• 荣誉奖 •</p>
          <p class="award-subname" @click="showExplain(0)">汉字传播贡献奖</p>
          <p class="award-name">• 综合奖 •</p>
          <p class="award-subname" @click="showExplain(1)">最佳故事短片奖</p>
          <p class="award-subname" @click="showExplain(2)">最佳传播创意奖</p>
          <p class="award-subname" @click="showExplain(3)">最佳汉字气韵奖</p>
          <p class="award-notice">注：优秀作品可在两个组别重复获奖</p>
        </div>
      </div>
      <div class="contests-home-page-awards-box award_2">
        <div class="contests-home-page-awards-box-text">
          <p class="award-name">• 综合奖 •</p>
          <p class="award-subname" @click="showExplain(1)">最佳故事短片奖</p>
          <p class="award-name">• 单项奖 •</p>
          <p class="award-subname" @click="showExplain(4)">最佳视觉效果奖</p>
          <p class="award-subname" @click="showExplain(5)">最佳汉字解读奖</p>
          <p class="award-subname" @click="showExplain(6)">最佳场景设计奖</p>
          <p class="award-notice">注：优秀作品可在两个组别重复获奖</p>
        </div>
      </div>
      <div class="contests-home-page-awards-box award_3">
        <div class="contests-home-page-awards-box-text">
          <p class="award-subname" @click="showExplain(7)">最佳组织奖</p>
          <p class="award-subname" @click="showExplain(8)">十佳人气奖</p>
          <p class="award-notice">◆特别奖从公开组和学生组所有参赛作品中评选产生。</p>
        </div>
      </div>
    </div>
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_4.png" alt=""></h3>
    <div class="contests-home-page-sponsor">
      <div class="contests-home-page-sponsor-item">
        <div class="contests-home-page-sponsor-item-img">
          <img src="@/assets/contests/big_1.png" alt="">
        </div>
        <p class="contests-home-page-sponsor-item-name">国际智能创意大奖赛组委会</p>
      </div>
      <div class="contests-home-page-sponsor-item">
        <div class="contests-home-page-sponsor-item-img">
          <img src="@/assets/contests/big_2.png" alt="">
        </div>
        <p class="contests-home-page-sponsor-item-name">深圳市大富配天投资有限公司</p>
      </div>
      <div class="contests-home-page-sponsor-item">
        <div class="contests-home-page-sponsor-item-img">
          <img src="@/assets/contests/big_3.png" alt="">
        </div>
        <p class="contests-home-page-sponsor-item-name">深圳市大富科技股份有限公司</p>
      </div>
      <div class="contests-home-page-sponsor-item">
        <div class="contests-home-page-sponsor-item-img">
          <img src="@/assets/contests/big_4.png" alt="">
        </div>
        <p class="contests-home-page-sponsor-item-name">中视科华文产中心</p>
      </div>
    </div>
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_5.png" alt=""></h3>
    <div class="contests-home-page-support">
      <div class="contests-home-page-support-intro">
        <div class="contests-home-page-support-intro-box">
          <p>北京电影学院</p>
          <p>北京开放大学</p>
          <p>安徽科技学院</p>
          <p>北京师范大学南山附属中学</p>
          <p>中国科学院深圳先进技术研究院实验学校</p>
          <p>深圳市中幼国际教育科技有限公司</p>
        </div>
      </div>
      <div class="contests-home-page-support-intro">
        <div class="contests-home-page-support-intro-box">
          <p>深圳市方块动漫画文化发展有限公司</p>
          <p>深圳市时代科腾文化传媒有限公司</p>
          <p>深圳市噢深商贸有限公司</p>
        </div>
      </div>
      <div class="contests-home-page-support-intro">
        <div class="contests-home-page-support-intro-box">
          <p>香港动漫电玩节组委会</p>
          <p>国际先进动态影像协会</p>
          <p>美国加州启智教育机构</p>
          <p>美育国际（新加坡）文化传播有限公司</p>
        </div>
      </div>
    </div>
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_6.png" alt=""></h3>
    <div class="contests-home-page-undertake">
      <div class="contests-home-page-undertake-name">
        <p>深圳市一网乾坤科技文化发展有限公司</p>
      </div>
      <div class="contests-home-page-undertake-name">
        <p>深圳市大富网络技术有限公司</p>
      </div>
    </div>
    <h3 class="contests-home-page-title"><img src="@/assets/contests/title_7.png" alt=""></h3>
    <div class="contests-home-page-media">
      <img class="contests-home-page-media-web" src="@/assets/contests/logo.png" alt="">
      <img class="contests-home-page-media-phone" src="@/assets/contests/logo_m.png" alt="">
    </div>
    <div class="contests-home-page-join" @click="toApply">
      <p class="contests-home-page-join-word">立即报名</p>
    </div>
    <el-dialog :visible.sync="showAwardExplain" width="450px" :before-close="closeAwardExplain" custom-class="contests-home-page-explain-dialog">
      <h3 class="contests-home-page-explain-dialog-title">{{awardExplainData[selectedIndex].name}}</h3>
      <p class="contests-home-page-explain-dialog-text">{{awardExplainData[selectedIndex].explain}}</p>
    </el-dialog>
    <apply-way-dialog v-if='showApplyDialog' :showApplyDialog='showApplyDialog' @close="closeApplyDialog"></apply-way-dialog>
    <img class="contests-home-page-bgpic element_1" src="@/assets/contests/element_1.png" alt="">
    <img class="contests-home-page-bgpic element_2" src="@/assets/contests/element_2.png" alt="">
    <img class="contests-home-page-bgpic element_3" src="@/assets/contests/element_3.png" alt="">
    <img class="contests-home-page-bgpic element_4" src="@/assets/contests/element_4.png" alt="">
    <img class="contests-home-page-bgpic element_text_1" src="@/assets/contests/element_text_1.png" alt="">
    <img class="contests-home-page-bgpic element_text_2" src="@/assets/contests/element_text_2.png" alt="">
    <img class="contests-home-page-bgpic element_text_3" src="@/assets/contests/element_text_3.png" alt="">
  </div>
</template>
<script>
import ApplyWayDialog from './ApplyWayDialog'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ContestsHomePage',
  data() {
    return {
      showAwardExplain: false,
      showApplyDialog: false,
      awardExplainData: [
        {
          name: '汉字传播贡献奖',
          explain:
            '作品立意深远、内涵丰富，充分利用了Paracraft软件功能，完整演绎百家姓氏的内涵，为汉字的传播和传承打开了新思路，让更多的人了解汉字的魅力，进一步扩大了汉字的全球影响力。'
        },
        {
          name: '最佳故事短片奖',
          explain:
            '基于NPL代表软件Paracraft和它的原生引擎，通过研究、实践充分应用NPL相关功能，以Paracraf 动画作品形式充分展现汉字的精髓。结合作品故事情节、场景设计、音乐音效等综合因素确定大奖。'
        },
        {
          name: '最佳传播创意奖',
          explain:
            '通过Paracraft软件制作以汉字为创作蓝本的视频作品，巧妙融入或借鉴了汉字结构元素、汉语言文化精髓等，创新了汉字的传播方式。'
        },
        {
          name: '最佳汉字气韵奖',
          explain:
            '作品形神兼备，意境悠远，展现出独特的艺术风格和生生不息的生命力，积极向上，充满正能量，一定程度上体现出创作者的灵魂。'
        },
        {
          name: '最佳视觉效果奖',
          explain:
            '作品镜头表现、剪辑衔接和特效制作表现俱佳，保持高度的艺术性，技巧性和高保真度，足以令受众获得愉悦的视觉享受。'
        },
        {
          name: '最佳汉字解读奖',
          explain:
            '作品对百家姓氏某个姓具有较高的演绎水准，能够充分反映其起源、发展和内涵，并将其外延应用到现代科技、创意设计等方面。'
        },
        {
          name: '最佳场景设计奖',
          explain:
            '使用Paracraft的建筑功能，以单人或多人的形式搭建场景。充分发挥Paracraft优势特色，结合自定义材质、自定义模型等功能，创作出以汉字结构、汉字内涵为蓝本的场景，搭建相关的动态场景，体现汉字美学和汉语言文化内涵。'
        },
        {
          name: '最佳组织奖',
          explain:
            '大赛进行期间，Paracraft教学中在统筹协调、精心组织、密切配合等方面有突出贡献且取得优异成效的学校及教育机构。'
        },
        {
          name: '十佳人气奖',
          explain:
            '是由媒体和大众评审组成评审团，共同由网络投票选出，其中网络投票占60%，媒体占40%；排名前十位的将获得本次大赛十佳人气奖。'
        }
      ],
      selectedIndex: 0
    }
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined'
    })
  },
  components: {
    ApplyWayDialog
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    closeAwardExplain() {
      this.showAwardExplain = false
    },
    showExplain(index) {
      this.selectedIndex = index
      this.showAwardExplain = true
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
  }
}
</script>

<style lang="scss" scoped>
.contests-home-page {
  position: relative;
  max-width: 1920px;
  margin: 0 auto;
  /deep/ &-explain-dialog {
    box-shadow: none;
    background: url('../../assets/contests/awardExplain.png') no-repeat top
      center;
    min-height: 330px;
    .el-dialog__header {
    }
    .el-dialog__body {
      padding: 0 40px;
    }
    &-title {
      font-size: 30px;
      color: rgb(210, 72, 11);
      border-bottom: 2px solid rgb(224, 225, 220);
      text-align: center;
      margin: 0 20px;
    }
    &-text {
      font-size: 20px;
      word-wrap: break-word;
    }
  }
  &-bgpic {
    position: absolute;
    z-index: -999;
    &.element_1 {
      left: 0;
      top: 20px;
      width: 18%;
    }
    &.element_3 {
      left: 0;
      top: 1620px;
      width: 18%;
    }
    &.element_2 {
      right: 0;
      top: 620px;
    }
    &.element_4 {
      right: 0;
      top: 2120px;
      width: 15%;
    }
    &.element_text_1 {
      right: 100px;
      top: 120px;
    }
    &.element_text_2 {
      left: 80px;
      top: 700px;
    }
    &.element_text_3 {
      right: 200px;
      bottom: 400px;
    }
  }
  &-title {
    text-align: center;
    margin: 70px 0 0;
  }
  &-paragraph {
    max-width: 928px;
    margin: 0 auto;
    font-size: 18px;
    color: #000000;
    line-height: 32px;
    text-indent: 30px;
    text-align: center;
    margin-bottom: 18px;
  }
  &-brief {
    max-width: 970px;
    min-height: 228px;
    margin: 0 auto;
    padding: 50px 12px 0;
    background: url(../../assets/contests/paper.png) no-repeat top center;
    &-text {
      max-width: 780px;
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
    flex-wrap: wrap;
    &-item {
      padding-left: 20px;
      display: flex;
      &-left {
        width: 68px;
      }
      &-right {
        flex: 1;
        font-size: 24px;
        &-title {
          color: #13232f;
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
    flex-wrap: wrap;
    &-box {
      width: 330px;
      height: 510px;
      margin: 10px;
      &-text {
        max-width: 225px;
        margin: 160px auto 0;
        text-align: center;
        .award-name {
          font-size: 18px;
          color: #fff;
          opacity: 0.5;
          margin-bottom: 4px;
        }
        .award-subname {
          font-size: 20px;
          color: #fff;
          letter-spacing: 1px;
          margin: 7px 0;
          cursor: pointer;
        }
        .award-notice {
          font-size: 16px;
          color: #fff;
          opacity: 0.5;
          letter-spacing: 1px;
        }
      }
      &.award_3 {
        padding-top: 50px;
        box-sizing: border-box;
      }
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
  &-sponsor {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    &-item {
      // width: 245px;
      padding: 10px 26px;
      font-size: 18px;
      color: #212121;
      &-img {
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &-name {
        text-align: center;
      }
    }
  }
  &-support {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    &-intro {
      display: flex;
      align-items: center;
      padding: 40px;
      color: #3b474f;
      font-size: 20px;
      &-box {
        text-align: center;
      }
    }
  }
  &-undertake {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    &-name {
      width: 520px;
      text-align: center;
      font-size: 24px;
      color: #13232f;
      padding: 30px;
    }
  }
  &-media {
    display: flex;
    justify-content: center;
    padding: 70px 0 0;
    &-phone {
      display: none;
    }
  }
  &-join {
    width: 372px;
    height: 292px;
    margin: 0 auto;
    background: url('../../assets/contests/button_2.png');
    cursor: pointer;
    &-word {
      margin: 0;
      line-height: 320px;
      font-size: 39px;
      text-align: center;
      color: #fff;
    }
  }
}
@media screen and (max-width: 768px) {
  .contests-home-page {
    /deep/ &-explain-dialog {
      width: 80% !important;
      .el-dialog__body {
        padding: 0 10px;
      }
      &-title {
        font-size: 20px;
      }
      &-text {
        font-size: 18px;
      }
    }
    &-title {
      img {
        max-width: 84%;
      }
    }
    &-bgpic {
      display: none;
    }
    &-paragraph {
      padding: 0 12px;
      font-size: 14px;
    }
    &-brief {
      padding: 30px 10px 0;
      min-height: 210px;
      &-text {
        font-size: 14px;
        line-height: 24px;
        &-left {
          width: 120px;
        }
      }
    }

    &-progress {
      display: block;
      &-item {
        padding-left: 70px;
        &-right {
          font-size: 16px;
          &-time {
            font-size: 14px;
          }
        }
      }
      &-arrow {
        padding: 12px;
        img {
          transform: rotate(90deg);
        }
      }
    }
    &-awards {
      &-box {
        &-text {
          .award-name {
            font-size: 14px;
          }
          .award-subname {
            font-size: 16px;
          }
        }
      }
    }
    &-sponsor {
      justify-content: space-around;
      padding: 20px 2px;
      &-item {
        width: 50%;
        padding: 0;
        font-size: 12px;
        padding: 20px 0 0;
        p {
          text-align: center;
        }
        &-img {
          img {
            width: 70%;
            max-width: 220px;
          }
        }
      }
    }
    &-support {
      &-intro {
        font-size: 16px;
        padding: 0;
      }
    }
    &-undertake {
      display: block;
      &-name {
        font-size: 16px;
        padding: 0;
        width: 100%;
      }
    }
    &-media {
      padding: 10px 0;
      &-web {
        display: none;
      }
      &-phone {
        display: block;
      }
    }
  }
}
</style>
     