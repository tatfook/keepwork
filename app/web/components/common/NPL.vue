<template>
  <div class="npl">
    <div class="npl-banner">
      <img class="npl-banner-img" src="@/assets/nplImg/banner.jpg" alt="">
      <img class="npl-banner-img-phone" src="@/assets/nplImg/banner-phone.jpg" alt="">
      <div class="npl-banner-button">
        <img class="npl-banner-button-contest" :src="contestImg" alt="contest" @click="joinContest" @mouseover="contestImgOver" @mouseout="contestImgOut">
        <img class="npl-banner-button-contest npl-banner-button-contest-phone" src="@/assets/nplImg/Button-contest-phone.png" alt="contest" @click="joinContest">
        <a href="http://www.paracraft.cn/download?lang=zh" target="_blank">
          <img class="npl-banner-button-download" :src="downloadImg" alt="download" @mouseover="downloadImgOver" @mouseout="downloadImgOut">
          <img class="npl-banner-button-download npl-banner-button-download-phone" src="@/assets/nplImg/Button-download-phone.png" alt="download">
        </a>
      </div>
    </div>
    <div class="npl-center">
      <div class="npl-center-title">
        <span class="npl-center-title-left"></span>
        <span class="npl-center-title-text">简介</span>
        <span class="npl-center-title-right"></span>
      </div>
      <p class="npl-center-text">NPL大赛由<a href="https://keepwork.com/" target="_blank">KeepWork</a>举办推广，以NPL语言和Paracraft工具为基础，以游戏、动画、解谜为主题，每月举办一次。 参赛者使用Paracraft软件单人或组队完成一个游戏项目，项目评比在KeepWork网络评分系统中进行。
      </p>
      <div class="npl-center-title">
        <span class="npl-center-title-left"></span>
        <span class="npl-center-title-text">主题</span>
        <span class="npl-center-title-right"></span>
      </div>
      <div class="npl-center-theme">
        <div class="npl-center-theme-title">NPL大赛可以是游戏和动画、解谜三大类主题</div>
        <div class="npl-center-theme-text">
          <div class="npl-center-theme-text-box">
            <h2>游戏</h2>
            <p>游戏：必须是引导清晰（包含玩法介绍），体验完整和流畅的产品。参考<a href="http://www.4399.com/" target="_blank">4399.com</a></p>
          </div>
          <div class="npl-center-theme-text-box">
            <h2>动画</h2>
            <p>采用Paracraft电影方块制作，有清晰的故事逻辑，动画镜头清晰、播放流畅。</p>
          </div>
          <div class="npl-center-theme-text-box">
            <h2>解谜</h2>
            <p>解谜场景制作完善，解谜线索符合基本逻辑思维。制作中须包含不少于两处代码制作的机关。</p>
          </div>
        </div>
      </div>
      <div class="npl-center-title">
        <span class="npl-center-title-left"></span>
        <span class="npl-center-title-text">奖金</span>
        <span class="npl-center-title-right"></span>
      </div>
      <div class="npl-center-bonus">
        <div class="npl-center-bonus-box">
          <p>一等奖（1名）</p>
          <p>现金奖励3500元</p>
        </div>
        <div class="npl-center-bonus-box">
          <p>二等奖（2名）</p>
          <p>现金奖励2500元</p>
        </div>
        <div class="npl-center-bonus-box">
          <p>三等奖（4名）</p>
          <p>现金奖励1500元</p>
        </div>
        <div class="npl-center-bonus-box">
          <p>人气奖（1名）</p>
          <p>现金奖励500元</p>
        </div>
      </div>
      <div class="npl-center-title">
        <span class="npl-center-title-left"></span>
        <span class="npl-center-title-text">评比规则</span>
        <span class="npl-center-title-right"></span>
      </div>
      <div class="npl-center-points">
        <h4 class="npl-center-points-title">作品获奖资格标准</h4>
        <p class="npl-center-points-text"><span class="text-icon"></span>每个人可以同时提交多款作品参赛。</p>
        <p class="npl-center-points-text"><span class="text-icon"></span>每期大赛截止日期前，作品可随时提交。未在截止日期前提交的作品，可参与下届比赛。</p>
        <p class="npl-center-points-text"><span class="text-icon"></span>报名及作品提交中，请填写真实的个人信息，以方便组委会第一时间联系。</p>
        <p class="npl-center-points-text"><span class="text-icon"></span>作品评分时间自作品提交开始，自本期大赛截止终止。</p>
        <p class="npl-center-points-text"><span class="text-icon"></span>作品评分分为主动评分类型及被动系统邀请类型。</p>
        <p class="npl-center-points-text"><span class="text-icon"></span>为获得客观评分，参赛选手可尽早提交作品邀请他人为自己评分。</p>
        <p class="npl-center-points-text"><span class="text-icon"></span>本次未获奖作品，在修改完善后重新提交获取新ID，以新ID参加下一届NPL大赛的评比。</p>
        <p class="npl-center-points-text"><span class="text-icon"></span>评选获奖作品需满足最低标准要求，当本次比赛提交的所有作品未达到对应奖项最低标准要求时，该奖项本次不进行评选。</p>
        <p class="npl-center-points-text"><span class="text-icon"></span>此前已获奖作品，包括但不限于获得PAC大赛、IICC大赛、NPL大赛奖项的作品不再参与评选（人气奖不受此条规则限制）。</p>
        <p class="npl-center-points-text"><span class="text-icon"></span>2018年10月10日前上传作品不再参与评选（原作品修改后不受此条限制）。</p>
        <p class="npl-center-points-text"><span class="text-icon"></span>NPL大赛评选规则最终解释权归活动举办方KeepWork所有。</p>

        <h4 class="npl-center-points-title">一二三等奖评比规则</h4>
        <h5 class="npl-center-points-subtitle"><span class="subtitle-icon"></span>最低标准要求：</h5>
        <p class="npl-center-points-prize">一等奖：游戏类参考作品：<a href="https://keepwork.com/pbl/project/709/" target="_blank">《BlockBot》</a>；动画类参考作品：<a href="https://keepwork.com/pbl/project/805/" target="_blank">《呵护》</a>；解谜类参考作品：<a href="https://keepwork.com/pbl/project/507/" target="_blank">《爷爷的宝藏》</a></p>
        <p class="npl-center-points-prize">二等奖：游戏类参考作品：<a href="https://keepwork.com/pbl/project/821/" target="_blank">《坦克大战》</a>；动画类参考作品：<a href="https://keepwork.com/pbl/project/456/" target="_blank">《肇庆一中·记忆永存》</a>；解谜类参考作品：<a href="https://keepwork.com/pbl/project/141/" target="_blank">《寻找小萱》</a></p>
        <p class="npl-center-points-prize">三等奖：游戏类参考作品：<a href="https://keepwork.com/pbl/project/840/" target="_blank">《道路通畅》</a>；动画类参考作品：<a href="https://keepwork.com/pbl/project/166/" target="_blank">《悲伤的巴塞罗那》</a>；解谜类参考作品: <a href="https://keepwork.com/pbl/project/510/" target="_blank">《忆回童心岛》</a></p>

        <h5 class="npl-center-points-subtitle"><span class="subtitle-icon"></span>评比方法：</h5>
        <p class="npl-center-points-prize">获奖作品须满足对应奖项最低标准要求。</p>
        <p class="npl-center-points-prize">根据评分系统得分进行排序评选。可参考<a href="/ranking" target="_blank">KeepWork排行榜</a></p>
        <p class="npl-center-points-prize">评分评委为所有拥有自己作品的KeepWork注册用户，评委分为主动评分类型及被动系统邀请类型。</p>
        <p class="npl-center-points-prize">每个评委可对提交的每一个作品进行一次评分。</p>
        <p class="npl-center-points-prize">每个作品在每届NPL大赛截止日期之前都可进行评委评分。</p>

        <h4 class="npl-center-points-title">人气奖评比规则</h4>
        <h5 class="npl-center-points-subtitle"><span class="subtitle-icon"></span>最低标准要求：</h5>
        <p class="npl-center-points-prize">完整的作品，可以正常浏览。必须是游戏、动画、解谜三大类主题中的某一类</p>

        <h5 class="npl-center-points-subtitle"><span class="subtitle-icon"></span>评比方法：</h5>
        <p class="npl-center-points-prize">根据评分系统中为该作品评分的评委人数来进行排序评选，评委人数最多的作品获得该奖项。</p>
        <p class="npl-center-points-prize">评分评委为所有拥有自己作品的KeepWork注册用户，评委分为主动评分类型及被动系统邀请类型。</p>
        <p class="npl-center-points-prize">每个评委可对提交的每一个作品进行一次评分。</p>
        <p class="npl-center-points-prize">每个作品在每届NPL大赛截止日期之前都可进行评委评分。</p>
      </div>
      <div class="npl-center-title">
        <span class="npl-center-title-left"></span>
        <span class="npl-center-title-text">日程</span>
        <span class="npl-center-title-right"></span>
      </div>
      <div class="npl-center-going" v-if="currentGameBoard">
        <p class="npl-center-going-date">{{currentGameInfo}}</p>
        <p class="npl-center-going-hint"><img class="npl-center-going-hint-flame" src="@/assets/nplImg/flame.png">进行中</p>
      </div>
      <div class="npl-center-end" v-if="lastGameBoard">
        <p class="npl-center-end-date">{{lastGameInfo}}</p>
        <p class="npl-center-end-hint">点击查看<a :href='lastGameAward' target="_blank"> &lt;获奖作品&gt; </a></p>
      </div>
    </div>
    <div class="npl-competition">
      <div class="npl-competition-showcase">
        <div class="npl-center-title">
          <span class="npl-center-title-left"></span>
          <span class="npl-center-title-text">本期参赛作品</span>
          <span class="npl-center-title-right"></span>
        </div>
        <el-row>
          <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in rankingList" :key="index">
            <project-cell :project="project" :ranking='true' :level="index"></project-cell>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog class="npl-hint-dialog" :visible.sync="hintVisible" width="375px" center :before-close="handleCloseHint">
      <p class="npl-hint-dialog-text">请完善个人信息</p>
      <p class="npl-hint-dialog-text">包括姓名、手机号、出生年月、邮箱、QQ</p>
      <a href="/u/p/userData" target="_blank" class="npl-hint-dialog-btn">现在就去</a>
    </el-dialog>
    <el-dialog class="npl-submit-work" :visible.sync="submitWorkVisible" v-if="submitWorkVisible" width="614px" :before-close="handleCloseSubmitWork">
      <submit-work @close='handleCloseSubmitWork' @submitSuccess="submitSuccess"></submit-work>
    </el-dialog>
    <el-dialog class="npl-success-dialog" :visible.sync="submitSuccessVisible" width="375px" center :before-close="handleCloseSubmitSuccess">
      <p class="npl-success-dialog-text"><img src="@/assets/nplImg/submit-success.png" alt=""></p>
      <p class="npl-success-dialog-text">作品提交成功!</p>
      <a class="npl-success-dialog-btn" @click="continueSubmit">继续提交</a>
    </el-dialog>
  </div>
</template>
<script>
import ProjectCell from './ProjectCell'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import SubmitWork from './SubmitWork'

export default {
  name: 'NPL',
  data() {
    return {
      hintVisible: false,
      submitWorkVisible: false,
      submitSuccessVisible: false,
      gameId: -1,
      contestImg: require('@/assets/nplImg/Button-contest.png'),
      downloadImg: require('@/assets/nplImg/Button-download.png'),
      currentGame: {
        currentGameStartTime: 0,
        currentGameEndTime: '',
        currentGameNo: '',
        currentGameName: ''
      },
      lastGame: {
        lastGameStartTime: 0,
        lastGameEndTime: '',
        lastGameNo: '',
        lastGameName: ''
      }
    }
  },
  async mounted() {
    await this.getGamesList()
    await this.getCurrentGameAndLastGameInfo()
    console.log('this.currentgame', this.currentGame)
    console.log('this.lastgame', this.lastGame)
    if (this.gameId === -1) {
      return
    }
    await this.getWorksByGameId({ gameId: this.gameId })
  },
  computed: {
    ...mapGetters({
      gamesList: 'pbl/gamesList',
      gameWorks: 'pbl/gameWorks',
      loginUserProfile: 'user/profile',
      isLogined: 'user/isLogined'
    }),
    currentGameBoard(){
      return this.currentGame.currentGameStartTime === 0 ? false : true
    },
    lastGameBoard(){
      return this.lastGame.lastGameStartTime === 0 ? false : true
    },
    currentGameInfo(){
      let current_game_start_time = new Date(this.currentGame.currentGameStartTime)
      let startYear = current_game_start_time.getFullYear()
      let startMonth = current_game_start_time.getMonth() + 1

      let current_game_end_time = new Date(this.currentGame.currentGameEndTime)
      let endYear = current_game_end_time.getFullYear()
      let endMonth = current_game_end_time.getMonth() + 1
      let endDate = current_game_end_time.getDate()
      return `${endYear}年${endMonth}月${this.currentGame.currentGameName}截止日期${endMonth}月${endDate}日`
    },
    lastGameInfo(){
      let last_game_start_time = new Date(this.lastGame.lastGameStartTime)
      let startYear = last_game_start_time.getFullYear()
      let startMonth = last_game_start_time.getMonth() + 1

      let last_game_end_time = new Date(this.lastGame.lastGameEndTime)
      let endYear = last_game_end_time.getFullYear()
      let endMonth = last_game_end_time.getMonth() + 1
      let endDate = last_game_end_time.getDate()
      return `${endYear}年${endMonth}月${this.lastGame.lastGameName}截止日期${endMonth}月${endDate}日 (已截止)`
    },
    lastGameAward(){
      return `https://keepwork.com/paraworld/NPL_${this.lastGame.lastGameNo}/index`
    },
    rankingList() {
      let list = _.get(this.gameWorks, 'rows', [])
      let works = []
      _.forEach(list, i => {
        works.push(i.projects)
      })
      return works
    }
  },
  methods: {
    ...mapActions({
      getGamesList: 'pbl/getGamesList',
      getWorksByGameId: 'pbl/getWorksByGameId',
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    getCurrentGameAndLastGameInfo(){
      const nowTime = new Date()
      for (let i = 0; i < this.gamesList.rows.length; i++) {
        if (nowTime > new Date(this.gamesList.rows[i].startDate) && nowTime < new Date(this.gamesList.rows[i].endDate)) {
          this.gameId = _.get(this.gamesList.rows[i], 'id', -1)
          this.currentGame.currentGameStartTime = _.get(this.gamesList.rows[i], 'startDate', 0)
          this.currentGame.currentGameEndTime = _.get(this.gamesList.rows[i], 'endDate', 0)
          this.currentGame.currentGameNo = _.get(this.gamesList.rows[i], 'no', 0)
          this.currentGame.currentGameName = _.get(this.gamesList.rows[i], 'name', 0)
          this.lastGame.lastGameNo = this.currentGame.currentGameNo - 1
          for (let j = 0; j < this.gamesList.rows.length; j++) {
            if((this.gamesList.rows[j].no === this.lastGame.lastGameNo)){
              this.lastGame.lastGameStartTime = _.get(this.gamesList.rows[j], 'startDate', 0)
              this.lastGame.lastGameEndTime = _.get(this.gamesList.rows[j], 'endDate', 0)
              this.lastGame.lastGameName = _.get(this.gamesList.rows[j], 'name', 0)
              break
            }
          }
          break
        }
      }
    },
    contestImgOver() {
      this.contestImg = require('@/assets/nplImg/Button-contest-2.png')
    },
    contestImgOut() {
      this.contestImg = require('@/assets/nplImg/Button-contest.png')
    },
    downloadImgOver() {
      this.downloadImg = require('@/assets/nplImg/Button-download-2.png')
    },
    downloadImgOut() {
      this.downloadImg = require('@/assets/nplImg/Button-download.png')
    },
    joinContest() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      if (this.gameId === -1) {
        this.$message.info('当前没有正在进行的比赛')
        return
      }
      if (
        this.loginUserProfile.info &&
        (this.loginUserProfile.info.name &&
          this.loginUserProfile.realname &&
          this.loginUserProfile.info.birthdate &&
          this.loginUserProfile.email &&
          this.loginUserProfile.info.qq)
      ) {
        this.submitWorkVisible = true
        return
      }
      this.hintVisible = true
    },
    submitSuccess() {
      this.submitSuccessVisible = true
      this.handleCloseSubmitWork()
    },
    continueSubmit() {
      this.submitWorkVisible = true
      this.handleCloseSubmitSuccess()
    },
    handleCloseHint() {
      this.hintVisible = false
    },
    handleCloseSubmitWork() {
      this.submitWorkVisible = false
    },
    handleCloseSubmitSuccess() {
      this.submitSuccessVisible = false
    }
  },
  components: {
    ProjectCell,
    SubmitWork
  }
}
</script>

<style lang="scss">
.npl {
  background: url(../../assets/nplImg/big-bg.jpg) #fff;
  &-banner {
    text-align: center;
    position: relative;
    &-img {
      object-fit: cover;
      max-width: 1920px;
      width: 100%;
      height: 580px;
      &-phone {
        display: none;
      }
    }
    &-button {
      min-height: 90px;
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translate(-50%, 0);
      &-contest {
        margin-right: 42px;
        cursor: pointer;
        &-phone {
          display: none;
        }
      }
      &-download {
        cursor: pointer;
        &-phone {
          display: none;
        }
      }
    }
  }
  &-center {
    max-width: 1200px;
    margin: 0 auto;
    &-title {
      text-align: center;
      display: flex;
      color: #0061e5;
      font-size: 36px;
      justify-content: center;
      align-items: center;
      &-text {
        margin: 45px;
      }
      &-left {
        display: inline-block;
        height: 4px;
        width: 36px;
        background: #0061e5;
        position: relative;
        &::before {
          content: '';
          height: 10px;
          width: 10px;
          background: #0061e5;
          position: absolute;
          right: -10px;
          top: -3px;
          transform: rotate(-45deg);
        }
      }
      &-right {
        display: inline-block;
        height: 4px;
        width: 36px;
        background: #0061e5;
        position: relative;
        &::before {
          content: '';
          height: 10px;
          width: 10px;
          background: #0061e5;
          position: absolute;
          left: -10px;
          top: -3px;
          transform: rotate(-45deg);
        }
      }
    }
    &-text {
      text-align: center;
      margin: 0 100px 110px;
      font-size: 18px;
      line-height: 42px;
      color: #333333;
      a {
        text-decoration: none;
      }
    }
    &-theme {
      background: url(../../assets/nplImg/text-bg.png);
      height: 327px;
      margin-bottom: 110px;
      &-title {
        text-align: center;
        padding: 80px 0 60px 0;
        font-size: 22px;
        line-height: 20px;
        color: #0676bd;
      }
      &-text {
        display: flex;
        &-box {
          max-width: 260px;
          flex: 1;
          margin: 0 auto;
          padding-bottom: 110px;
          color: #333;
          line-height: 26px;
          font-size: 16px;
        }
      }
    }
    &-bonus {
      display: flex;
      margin-bottom: 110px;
      flex-wrap: wrap;
      &-box {
        font-family: 'MicrosoftYaHei-Bold';
        min-width: 130px;
        flex: 1;
        text-align: center;
        color: #ff7800;
        line-height: 47px;
        font-size: 28px;
        font-weight: 700;
      }
    }
    &-points {
      margin-bottom: 110px;
      &-title {
        font-size: 28px;
        color: #333;
        margin: 68px 0 40px;
      }
      &-subtitle {
        font-size: 18px;
        color: #2561ba;
        .subtitle-icon {
          display: inline-block;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: linear-gradient(to right, #0061e5, #fff);
          margin-right: 15px;
        }
      }
      &-text {
        color: #333;
        padding-left: 20px;
        position: relative;
        .text-icon {
          position: absolute;
          left: 0;
          top: 6px;
          display: inline-block;
          height: 10px;
          width: 10px;
          background: #0061e5;
          transform: rotate(-45deg);
          margin-right: 17px;
        }
      }
      &-prize {
        padding-left: 28px;
      }
    }
    &-going {
      max-width: 1010px;
      min-height: 198px;
      margin: 0 auto;
      text-align: center;
      background: url(../../assets/nplImg/going-bg.png) no-repeat;
      color: #fff;
      &-date {
        padding-top: 78px;
        font-size: 24px;
      }
      &-hint {
        display: flex;
        justify-content: center;
        align-items: center;
        &-flame {
          margin-right: 22px;
        }
      }
    }
    &-end {
      max-width: 1010px;
      min-height: 182px;
      border: 2px solid #0061e5;
      box-sizing: border-box;
      background: #eaf5ff;
      margin: 92px auto;
      text-align: center;
      padding-top: 30px;
      font-size: 24px;
      color: #333;
      &-hint {
        font-size: 18px;
      }
    }
  }
  &-competition {
    background: #f6f7f8;
    padding: 100px;
    &-showcase {
      max-width: 1200px;
      margin: 0 auto;
    }
  }
  &-hint-dialog {
    &-text {
      text-align: center;
      color: #333;
      font-size: 16px;
    }
    &-btn {
      width: 90%;
      margin: 40px auto;
      display: block;
      width: 285px;
      height: 44px;
      line-height: 44px;
      color: #fff;
      text-align: center;
      background: #409eff;
      border-radius: 5px;
      text-decoration: none;
      font-size: 16px;
    }
  }
  &-success-dialog {
    &-text {
      text-align: center;
      color: #333;
      font-size: 18px;
      margin: 0;
    }
    &-btn {
      width: 90%;
      margin: 40px auto;
      display: block;
      width: 116px;
      height: 36px;
      line-height: 36px;
      color: #fff;
      text-align: center;
      background: #409eff;
      border-radius: 5px;
      text-decoration: none;
      font-size: 16px;
      cursor: pointer;
    }
  }
  &-submit-work {
    .el-dialog .el-dialog__body {
      padding: 10px 80px;
    }
  }
}
@media screen and (max-width: 769px) {
  .npl {
    &-banner {
      width: 100%;
      &-img{
        display: none;
      }
      &-img-phone {
        object-fit: cover;
        width: 100%;
        display: block;
      }
      &-button {
        width: 100%;
        min-height: 30px;
        bottom: 10px;
        &-contest {
          display: none;
          &-phone {
            display: inline-block;
          }
        }
        &-download {
          display: none;
          &-phone {
            display: inline-block;
          }
        }
      }
    }
    &-center {
      &-title {
        font-size: 18px;
        font-weight: 700;
        &-left,
        &-right {
          display: none;
        }
        &-text {
          margin: 45px 20px 20px;
        }
      }
      &-text {
        margin: 0 16px;
        font-size: 16px;
        line-height: 26px;
        text-align: left;
      }
      &-theme {
        background: none;
        &-title {
          font-size: 14px;
          padding: 0;
        }
        &-text {
          display: block;
          margin: 0 16px;
          &-box {
            padding: 0 3px;
            border-bottom: 1px solid #999;
            max-width: 330px;
            h2 {
              font-size: 16px;
              color: #333;
              font-weight: normal;
            }
            p {
              color: #666;
              font-size: 14px;
            }
          }
        }
      }
      &-bonus {
        margin: 0;
        &-box {
          font-size: 16px;
          line-height: 20px;
        }
      }
      &-points {
        margin: 0 16px;
        &-title {
          margin: 26px 0 0;
          font-size: 16px;
        }
        &-subtitle {
          margin: 18px 0 0;
          font-size: 14px;
          .subtitle-icon {
            margin-right: 9px;
          }
        }
        &-text {
          color: #666;
          font-size: 14px;
          line-height: 22px;
        }
        &-prize {
          font-size: 14px;
          line-height: 24px;
          padding-left: 20px;
        }
      }
      &-going {
        background: url(../../assets/nplImg/going-bg-phone.png) no-repeat top
          center;
        background-size: 100%;
        min-height: 100px;
        margin: 0 16px;
        &-date {
          font-size: 14px;
          padding-top: 30px;
        }
        &-hint {
          font-size: 14px;
          margin: 0;
        }
      }
      &-end {
        margin: 30px 16px;
        font-size: 14px;
        min-height: 100px;
        &-hint {
          font-size: 14px;
        }
      }
    }
    &-competition {
      padding: 10px;
    }
  }
}
</style>

