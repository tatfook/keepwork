<template>
  <div class="home-page">
    <div class="home-page-advertising">
      <div :class="['home-page-advertising-head',{'hidden-ad':hiddenAd}]">
        <i class="iconfont icon-sound-fill"></i>
        <span class="home-page-advertising-text">{{$t('home.paracraftIsFree')}}</span>
        <a href="http://paracraft.keepwork.com/download?lang=zh" target="_blank" class="home-page-advertising-download">{{$t('editor.paracraftDownload')}}</a>
        <span class="close" @click="closeAd">&times;</span>
      </div>
    </div>
    <div class="home-page-simple-show">
      <div class="home-page-simple-show-center">
        <div class="home-page-simple-show-center-left">
          <div class="home-page-simple-show-center-left-desc">
            <div class="home-page-simple-show-center-left-desc-box">
              <p :class="['intro',{'intro-hover': currIndex == index}]" v-for="(item,index) in briefPic" :key="index" @mouseover="switchPic(index)" @mouseout="continueTextAnimation(index)">{{item.text}}</p>
            </div>
            <span v-if="!isLogined" class="join-button" @click="goJoin">{{$t("home.joinFree")}}</span>
            <div class="remainder">
              <a href="https://keepwork.com/official/paracraft/to-educators" target="_blank" class="pedagogue">{{$t("home.toEducators")}}</a>
              <a href="https://keepwork.com/official/paracraft/to-parents" target="_blank">{{$t("home.toParents")}}</a>
            </div>
            <a class="join-button download-button" href="http://paracraft.keepwork.com/download?lang=zh" target="_blank">{{$t('project.downloadParacraft')}}</a>
            <div class="remainder">
              <a target="_blank" class="pedagogue">{{$t('common.support')}} Windows</a>
              <a target="_blank" class="pedagogue">Mac</a>
              <a target="_blank">Android</a>
            </div>
          </div>
          <div class="flexible-info-board">
            <img :src="boardImgUrl" alt="">
          </div>
        </div>
        <div class="home-page-simple-show-center-right hidden-sm-and-down">
          <div class="home-page-simple-show-center-right-kp">
            <div class="title">{{$t("home.whatCanYouDoOnKp")}}</div>
            <div class="video">
              <video-player width="100%" src='https://api.keepwork.com/storage/v0/siteFiles/770/raw#宣传视频01.mp4' />
            </div>
          </div>
          <div class="home-page-simple-show-center-right-board">
            <div class="title">{{$t("home.officialAnnouncements")}}</div>
            <ul class="announce-list" v-html="newsHtml"></ul>
            <!-- <ul v-else class="announce-list">
              <li><img class="iicc" src="@/assets/img/iicc_logo.png" alt="iicc">IICC大赛火热进行中！
                <a href="//iicc.keepwork.com" target="_blank">进入</a>
              </li>
              <li>
                <span class="icon-book">
                  <i class="iconfont icon-book-fill"></i>
                </span> Lessons系统即将上线，尽情期待！
                <a href="/l/student/center" target="_blank">进入</a>
              </li>
            </ul> -->
          </div>
        </div>
      </div>
    </div>
    <div class="home-page-brief">
      <div class="home-page-brief-center">
        <div class="box" @click="goCreativityPage" @mouseover="combinedPic('create', -1200,0)" @mouseout="combinedPic('create', -2000,0, 'leave')">
          <div class="box-text">
            <h2>{{$t('common.creativity')}}</h2>
            <p class="box-text-intro">{{$t("home.everyoneShouldHaveOwnWorks")}}</p>
          </div>
          <div class="box-img create" ref="create_box_img">
          </div>
          <div class="box-word">{{$t('common.creativity')}}</div>
        </div>
        <div class="line"></div>
        <div class="box" @click="goExplorationPage" @mouseover="combinedPic('explore', -1200,1)" @mouseout="combinedPic('explore', -2000,1, 'leave')">
          <div class="box-text">
            <h2>{{$t('common.explore')}}</h2>
            <p class="box-text-intro">{{$t("home.openDoorsToVariousWorlds")}}</p>
          </div>
          <div class="box-img explore" ref="explore_box_img">
          </div>
          <div class="box-word">{{$t('common.explore')}}</div>
        </div>
        <div class="line"></div>
        <div class="box" @click="goStudyPage" @mouseover="combinedPic('study', -1200,2)" @mouseout="combinedPic('study', -2000,2, 'leave')">
          <div class="box-text">
            <h2>{{$t('common.study')}}</h2>
            <p class="box-text-intro">{{$t("home.learningIsFromExploringToCreating")}}</p>
          </div>
          <div class="box-img study" ref="study_box_img">
          </div>
          <div class="box-word">{{$t('common.study')}}</div>
        </div>
      </div>
    </div>
    <div class="home-page-cabinet">
      <div class="home-page-cabinet-excellent selected">
        <div class="title">
          <div class="title-text">
            <span class="star">
              <img src="@/assets/img/hp_select_project.png" alt="">
            </span>{{$t("home.selectedProjects")}}</div>
          <div class="more" @click="viewMore('pickedProjects')">{{$t("common.viewMore")}}&gt;</div>
        </div>
        <el-row>
          <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in handpickProjects" :key="index">
            <project-cell :project='project'></project-cell>
          </el-col>
        </el-row>
      </div>
      <div class="home-page-cabinet-excellent like">
        <div class="title">
          <div class="title-text">
            <span class="star">
              <img src="@/assets/img/hp_people_like.png" alt="">
            </span>{{$t("home.likedByOthers")}}</div>
          <div class="more" @click="viewMore('allProjects')">{{$t("common.viewMore")}}&gt;</div>
        </div>
        <el-row>
          <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in likesProjects" :key="index">
            <project-cell :project="project"></project-cell>
          </el-col>
        </el-row>
      </div>
    </div>
    <div @click.stop v-if="isRegisterDialogShow">
      <el-dialog class="home-page-register-dialog" :visible.sync="isRegisterDialogShow">
        <register-dialog @close="closeRegisterDialog"></register-dialog>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import 'element-ui/lib/theme-chalk/display.css'
import { locale } from '@/lib/utils/i18n'
import ProjectCell from './ProjectCell'
import { lesson, keepwork } from '@/api'
import RegisterDialog from './RegisterComp'
import _ from 'lodash'
import { showRawForGuest as gitlabShowRawForGuest } from '@/api/gitlab'
import LessonPackageCell from './LessonPackageCell'
import { mapGetters } from 'vuex'
import videoPlayer from '@/components/common/VideoPlayer'

export default {
  name: 'HomePage',
  data() {
    return {
      projects: [],
      subtitleAnimation: null,
      hotsPackages: [],
      hiddenAd: false,
      isRegisterDialogShow: false,
      locationOrigin: window.location.origin,
      currIndex: 0,
      timer_pic: [],
      briefPic: [
        {
          image: require('@/assets/pblImg/game0.png'),
          text: this.$t('home.create3DGameAndAnim')
        },
        {
          image: require('@/assets/pblImg/game1.png'),
          text: this.$t('home.selfLearning')
        },
        {
          image: require('@/assets/pblImg/game2.png'),
          text: this.$t('home.personalKnowledge')
        },
        {
          image: require('@/assets/pblImg/game3.png'),
          text: this.$t('home.haveYourOwnSite')
        },
        {
          image: require('@/assets/pblImg/game4.png'),
          text: this.$t('home.learnBasedOnProjects')
        },
        {
          image: require('@/assets/pblImg/game5.png'),
          text: this.$t('home.learnFromProfessionalProgrammers')
        }
      ],
      boardImgUrl: require('@/assets/pblImg/game0.png'),
      newsHtml: '',
      originHandpickProjects: [],
      originLikesProjects: []
    }
  },
  components: {
    ProjectCell,
    RegisterDialog,
    LessonPackageCell,
    videoPlayer
  },
  async mounted() {
    this.textAnimation()
    let [ handpick, likes, news] = await Promise.all([
      this.getHandpick(),
      this.getLikes(),
      this.getNews()
    ]).catch(e => console.error(e))
    this.newsHtml = news
    this.originHandpickProjects = handpick
    this.originLikesProjects = likes
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined'
    }),
    isEn() {
      return locale === 'en-US'
    },
    handpickProjects() {
      return _.get(this.originHandpickProjects, 'rows', [])
    },
    likesProjects() {
      return _.get(this.originLikesProjects, 'rows', [])
    }
  },
  methods: {
    async getHandpick() {
      return keepwork.projects.getProjects({
        'x-order': 'choicenessNo-desc',
        'x-per-page': 8,
        'x-page': 1
      })
    },
    async getLikes() {
      return keepwork.projects.getProjects({
        'x-order': 'lastStar-desc-updatedAt-desc',
        'x-per-page': 8,
        'x-page': 1
      })
    },
    getPackageSuitableAge(lessonPackage) {
      let { minAge, maxAge } = lessonPackage
      if (minAge == 0 && maxAge == 0) {
        return this.$t('lesson.packageManage.SuitableForAll')
      }
      return `${minAge}-${maxAge}`
    },
    textAnimation() {
      this.subtitleAnimation = setInterval(() => {
        this.currIndex = this.currIndex + 1 > 5 ? 0 : this.currIndex + 1
        this.boardImgUrl = this.briefPic[this.currIndex].image
      }, 3000)
    },
    continueTextAnimation(index) {
      this.currIndex = index
      this.textAnimation()
    },
    combinedPic(item, len, n, leave) {
      clearInterval(this.timer_pic[n])
      this.timer_pic[n] = setInterval(() => {
        let backgroundLen = Number(
          this.$refs[`${item}_box_img`].style['backgroundPositionX'].replace(
            /px/,
            ''
          )
        )
        if (backgroundLen > len) {
          backgroundLen -= 100
          this.$refs[`${item}_box_img`].style['backgroundPositionX'] =
            backgroundLen + 'px'
        } else {
          clearInterval(this.timer_pic[n])
          if (leave)
            this.$refs[`${item}_box_img`].style['backgroundPositionX'] = '0px'
        }
      }, 50)
    },
    switchPic(index) {
      clearInterval(this.subtitleAnimation)
      this.currIndex = index
      this.boardImgUrl = this.briefPic[this.currIndex].image
    },
    closeAd() {
      this.hiddenAd = true
    },
    viewMore(tabName) {
      this.$router.push({
        name: 'ExplorationPage',
        query: {
          tab: tabName
        }
      })
    },
    goJoin() {
      this.isRegisterDialogShow = true
    },
    closeRegisterDialog() {
      this.isRegisterDialogShow = false
    },
    goCreativityPage() {
      this.$router.push(`/creativity`)
    },
    goExplorationPage() {
      this.$router.push(`/exploration`)
    },
    goStudyPage() {
      if (this.isLogined) {
        return (window.location.href = `${this.locationOrigin}/l/student`)
      }
      window.location.href = `${
        this.locationOrigin
      }/l/student/solution/teachingIdea`
    },
    goLessonPackage(lessonPackage) {
      window.open(`/l/student/package/${lessonPackage.id}`)
    },
    sortByKey(key) {
      return (obj1, obj2) => {
        return obj1[key] >= obj2[key] ? -1 : 1
      }
    },
    async getNews() {
      const HomePageInfo = {
        apiPrefix: 'https://api.keepwork.com/git/v0',
        projectName: 'official/keepwork',
        newsPath: this.isEn
          ? 'official/keepwork/news_en.md'
          : 'official/keepwork/news.md'
      }
      return gitlabShowRawForGuest(
        HomePageInfo.apiPrefix,
        HomePageInfo.projectName,
        HomePageInfo.newsPath
      ).catch(e => console.error(e))
    }
  },
  beforeDestroy() {
    clearInterval(this.subtitleAnimation)
  }
}
</script>

<style lang="scss">
.home-page {
  &-register-dialog {
    .el-dialog {
      width: 352px;
      .el-dialog__header {
        padding: 40px 0 0;
      }
      .el-dialog__body {
        padding: 0 0 10px;
        .register-dialog-form {
          margin: 0;
          box-shadow: none;
          .register-title {
            padding-top: 0;
          }
        }
      }
    }
  }
  &-advertising {
    background: #fff;
    padding-top: 16px;
    &-head {
      max-width: 1200px;
      margin: 0 auto;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: rgba(35, 151, 243, 0.2);
      border-radius: 4px;
      border: solid 1px #2397f3;
      color: #2397f3;
      position: relative;
      font-size: 14px;
      .iconfont {
        font-size: 20px;
        margin-right: 6px;
      }
      .close {
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        font-size: 28px;
        position: absolute;
        right: 20px;
        top: 0;
        cursor: pointer;
      }
    }
    &-text {
      color: #333;
    }
    &-download {
      text-decoration: none;
      color: #2397f3;
    }
    .hidden-ad {
      height: 0;
      overflow: hidden;
      border: none;
      transition: all 0.2s ease-out;
    }
  }
  &-simple-show {
    padding-top: 16px;
    padding-bottom: 40px;
    border-bottom: 1px solid #eeeeee;
    background: #fff;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      &-left {
        flex: 1;
        height: 442px;
        position: relative;
        background: url('../../assets/img/homepage_mainpic.png') no-repeat
          bottom right;
        &-desc {
          position: absolute;
          .title {
            color: #2397f3;
            font-size: 30px;
            margin: 12px 0;
          }
          &-box {
            height: 190px;
            .intro {
              font-size: 14px;
              color: #c0c4cc;
              margin: 0;
              line-height: 30px;
              cursor: pointer;
              transition: all 0.3s ease-out;
              &-hover {
                color: #2397f3;
                font-size: 26px;
                margin: 0;
                font-weight: bold;
                transition: all 0.3s ease-out;
              }
            }
          }
          .join-button {
            display: inline-block;
            padding: 0 28px;
            height: 36px;
            line-height: 36px;
            margin: 24px 0 12px;
            font-size: 15px;
            color: #fff;
            border-radius: 18px;
            cursor: pointer;
            background: linear-gradient(#ffde0d, #ff4e10);
            border: none;
            box-shadow: 3px 15px 18px -12px #ff720ee0;
            text-shadow: 0px 1px 6px #a52e02b0;
          }
          .download-button {
            background: linear-gradient(0deg, #2497f4 0%, #3ec8f8 100%);
            box-shadow: 0px 7px 9px 0px rgba(192, 228, 255, 0.88);
            text-decoration: none;
            text-shadow: 0 1px 6px rgb(23, 137, 208);
          }
          .remainder {
            a {
              text-decoration: none;
              color: #71747a;
              font-size: 12px;
              padding-left: 6px;
              &.pedagogue {
                padding-right: 10px;
                border-right: 1px solid #ccc;
              }
            }
          }
        }
        .flexible-info-board {
          position: absolute;
          right: 145px;
          top: 52px;
          width: 223px;
          height: 146px;
        }
      }
      &-right {
        width: 384px;
        margin-left: 30px;
        .title {
          height: 42px;
          background: linear-gradient(180deg, #ffffff 0%, #f4fbff 100%);
          font-size: 16px;
          color: #333;
          font-weight: 700;
          line-height: 42px;
          padding-left: 27px;
        }
        &-kp {
          border-radius: 4px;
          border: 1px solid #eeeeee;
          .video {
            width: 352px;
            height: 240px;
            margin: 17px;
            text-align: center;
          }
        }
        &-board {
          margin-top: 16px;
          border-radius: 4px;
          border: 1px solid #eeeeee;
          .announce-list {
            padding-left: 28px;
            list-style: none;
            font-size: 14px;
            li {
              width: 320px;
              display: flex;
              align-items: center;
              position: relative;
              height: 40px;
              line-height: 40px;
              a {
                text-decoration: none;
                position: absolute;
                right: 2px;
                top: 0px;
              }
              .iicc {
                width: 22px;
                height: 22px;
                margin-right: 6px;
              }
              .news-badge {
                width: 22px;
                height: 22px;
                margin-right: 6px;
              }
              .icon-book {
                display: inline-flex;
                justify-content: center;
                width: 22px;
                height: 22px;
                line-height: 22px;
                border-radius: 50%;
                background: #409eff;
                color: #fff;
                margin-right: 6px;
              }
            }
          }
        }
      }
    }
  }
  &-brief {
    background: #fff;
    &-center {
      margin: 0 auto;
      max-width: 1200px;
      display: flex;
      .box {
        flex: 1;
        margin: 24px 12px;
        padding: 10px 36px 10px 24px;
        display: flex;
        cursor: pointer;
        border-radius: 4px;
        transition: all 200ms ease-in;
        &:hover {
          box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.16);
          transition: all 200ms ease-in;
        }
        &-text {
          flex: 1;
          &-intro {
            color: #a0a4aa;
            font-size: 14px;
          }
          &-own {
            color: #606266;
            font-size: 13px;
            font-weight: bold;
            .total {
              color: #409eff;
            }
          }
        }
        &-img {
          width: 100px;
          height: 100px;
          margin: 19px 0;
          background-repeat: no-repeat;
          background-size: auto 100px;
          background-position: 0px;
          &.create {
            background-image: url('../../assets/pblImg/create.png');
          }
          &.explore {
            background-image: url('../../assets/pblImg/explore.png');
          }
          &.study {
            background-image: url('../../assets/pblImg/bulb.png');
          }
        }
        &-word {
          display: none;
        }
      }
      .line {
        width: 1px;
        height: 156px;
        background: #eee;
        margin: 25px 14px;
      }
    }
  }
  &-cabinet {
    background: #f6f7f8;
    &-excellent {
      margin: 0 auto;
      padding-top: 16px;
      max-width: 1200px;
      .title {
        height: 60px;
        display: flex;
        &-text {
          flex: 1;
          font-size: 18px;
          color: #333;
          font-weight: 700;
          display: flex;
          align-items: center;
          .star {
            width: 32px;
            height: 32px;
            margin-right: 12px;
          }
        }
        .more {
          width: 70px;
          font-size: 12px;
          color: #909399;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
      }
    }
    .like {
      padding-bottom: 80px;
    }
  }
}
@media screen and (max-width: 768px) {
  .home-page {
    &-advertising-head {
      font-size: 12px;
      height: 30px;
      line-height: 30px;
      .iconfont {
        font-size: 12px;
      }
      .close {
        right: 10px;
        line-height: 30px;
      }
    }
    &-register-dialog {
      .el-dialog {
        width: 90%;
      }
    }
    &-simple-show {
      padding: 0;
      &-center {
        &-left {
          background-size: 100%;
          &-desc {
            &-box {
              padding-left: 10px;
              height: 160px;
              .intro {
                font-size: 12px;
                line-height: 28px;
                &-hover {
                  font-size: 16px;
                }
              }
            }
          }
          .flexible-info-board {
            right: 186px;
            top: 57px;
            img {
              width: 100%;
            }
          }
        }
      }
    }
    &-brief {
      &-center {
        .line {
          height: 60px;
        }
        .box {
          display: block;
          margin: 0;
          padding: 0;
          height: 77px;
          &-text {
            display: none;
          }
          &-img {
            margin: 0 auto;
            width: 77px;
            height: 77px;
            background-size: auto 77px;
          }
          &-word {
            display: block;
            text-align: center;
            font-size: 13px;
            color: #606266;
            font-weight: bold;
            height: 25px;
          }
        }
      }
    }
    &-cabinet {
      background: #f6f7f8;
      padding-top: 1px;
      &-excellent {
        margin-top: 8px;
        padding: 0;
        background: #fff;
        .hot-lesson {
          .lesson {
            margin: 0 auto 15px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 414px) {
  .home-page-simple-show-center-left {
    .flexible-info-board {
      right: 7px;
      top: 204px;
      img {
        width: 80%;
      }
    }
  }
}
@media screen and (max-width: 375px) {
  .home-page-simple-show-center-left {
    .flexible-info-board {
      right: -7px;
      top: 213px;
      img {
        width: 80%;
      }
    }
  }
}
@media screen and (max-width: 360px) {
  .home-page-simple-show-center-left {
    .flexible-info-board {
      right: -17px;
      top: 194px;
      img {
        width: 100%;
      }
    }
  }
}
@media screen and (max-width: 320px) {
  .home-page-simple-show-center-left {
    .flexible-info-board {
      right: -39px;
      top: 235px;
      img {
        width: 80%;
      }
    }
  }
}
</style>
