<template>
  <div class="home-page">
    <div :class="['home-page-advertising-head',{'hidden-ad':hiddenAd}]">
      <i class="iconfont icon-sound-fill"></i>3D创作工具：Paracraft 永久免费！
      <span class="close" @click="closeAd">&times;</span>
    </div>
    <div class="home-page-simple-show">
      <div class="home-page-simple-show-center">
        <div class="home-page-simple-show-center-left">
          <div class="home-page-simple-show-center-left-desc">
            <div class="home-page-simple-show-center-left-desc-box">
              <p :class="['intro',{'intro-hover': currIndex == index}]" v-for="(item,index) in briefPic" :key="index" @mouseover="switchPic(index)" @mouseout="continueTextAnimation(index)">{{item.text}}</p>
            </div>
            <el-button type="primary" round class="join-button" @click="goJoin">马上免费加入</el-button>
            <div class="remainder">
              <a href="https://keepwork.com/official/paracraft/to-educators" target="_blank" class="pedagogue">致教育工作者</a>
              <a href="https://keepwork.com/official/paracraft/to-parents" target="_blank">给父母们的话</a>
            </div>
          </div>
          <div class="flexible-info-board">
            <img :src="boardImgUrl" alt="">
          </div>
        </div>
        <div class="home-page-simple-show-center-right">
          <div class="home-page-simple-show-center-right-kp">
            <div class="title">keepwork是做什么的</div>
            <div class="video" v-if="videoHtml" v-html="videoHtml">

            </div>
            <div v-else class="video">
              <video width="100%" src="https://api.keepwork.com/storage/v0/siteFiles/770/raw#宣传视频01.mp4" poster="" controls></video>
            </div>
          </div>
          <div class="home-page-simple-show-center-right-board">
            <div class="title">官方公告</div>
            <ul class="announce-list" v-if="newsHtml" v-html="newsHtml"></ul>
            <ul v-else class="announce-list">
              <li><img class="iicc" src="@/assets/img/iicc_logo.png" alt="iicc">IICC大赛火热进行中！
                <a href="//iicc.keepwork.com" target="_blank">进入</a>
              </li>
              <li>
                <span class="icon-book">
                  <i class="iconfont icon-book-fill"></i>
                </span> Lessons系统即将上线，尽情期待！
                <a href="/l/student/center" target="_blank">进入</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="home-page-brief">
      <div class="home-page-brief-center">
        <div class="box" @click="goCreativityPage" @mouseover="combinedPic('create', -1200,0)" @mouseout="combinedPic('create', -2000,0, 'leave')">
          <div class="box-text">
            <h2>创造</h2>
            <p class="box-text-intro">每个人都应该拥有自己的作品</p>
            <!-- <p class="box-text-own">已创建项目:
              <span class="total">{{excellentProjectsCount}}</span></p> -->
          </div>
          <div class="box-img create" ref="create_box_img">
          </div>
        </div>
        <div class="line"></div>
        <div class="box" @click="goExplorationPage" @mouseover="combinedPic('explore', -1200,1)" @mouseout="combinedPic('explore', -2000,1, 'leave')">
          <div class="box-text">
            <h2>探索</h2>
            <p class="box-text-intro">打开一扇扇的门发现有趣的世界</p>
            <!-- <p class="box-text-own">已共享内容:
              <span class="total">123456</span></p> -->
          </div>
          <div class="box-img explore" ref="explore_box_img">
          </div>
        </div>
        <div class="line"></div>
        <div class="box" @click="goStudyPage" @mouseover="combinedPic('study', -1200,2)" @mouseout="combinedPic('study', -2000,2, 'leave')">
          <div class="box-text">
            <h2>学习</h2>
            <p class="box-text-intro">学习起于探索成于创造</p>
            <!-- <p class="box-text-own">拥有在线课程：
              <span class="total">{{allPackagesCount}}</span></p> -->
          </div>
          <div class="box-img study" ref="study_box_img">
          </div>
        </div>
      </div>
    </div>
    <div class="home-page-cabinet">
      <div class="home-page-cabinet-excellent selected">
        <div class="title">
          <div class="title-text">
            <span class="star">
              <img src="@/assets/img/hp_select_project.png" alt="">
            </span>精选项目</div>
          <div class="more" @click="viewMore">查看更多&gt;</div>
        </div>
        <el-row>
          <el-col :sm="12" :md="6" v-for="(project,index) in handpickProjects" :key="index">
            <project-cell :project='project'></project-cell>
          </el-col>
        </el-row>
      </div>
      <div class="home-page-cabinet-excellent hot">
        <div class="title">
          <div class="title-text">
            <span class="star">
              <img src="@/assets/img/hp_hot_lesson.png" alt="">
            </span>热门课程</div>
          <div class="more" @click="viewMore">查看更多&gt;</div>
        </div>
        <el-row>
          <el-col class="hot-lesson" :sm="12" :md="6" v-for="(lessonPackage,index) in hotsPackages" :key="index">
            <div class="lesson">
              <img class="lesson-cover" :src="lessonPackage.extra.coverUrl" alt="" @click="goLessonPackage(lessonPackage)">
              <h4 class="lesson-title" @click="goLessonPackage(lessonPackage)">{{lessonPackage.packageName}}</h4>
              <div class="lesson-desc">
                <p>包含：
                  <span>125</span>个课程</p>
                <p>年龄：{{lessonPackage.minAge}}-{{lessonPackage.maxAge}}</p>
                <p class="lesson-desc-text" :title="lessonPackage.intro">简介：{{lessonPackage.intro}}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="home-page-cabinet-excellent like">
        <div class="title">
          <div class="title-text">
            <span class="star">
              <img src="@/assets/img/hp_people_like.png" alt="">
            </span>大家都觉得赞</div>
          <div class="more" @click="viewMore">查看更多&gt;</div>
        </div>
        <el-row>
          <el-col :sm="12" :md="6" v-for="(project,index) in likesProjects" :key="index">
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
import ProjectCell from './ProjectCell'
import { lesson } from '@/api'
import RegisterDialog from './RegisterDialog'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { showRawForGuest as gitlabShowRawForGuest } from '@/api/gitlab'

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
          text: '创作3D游戏与动画作品'
        },
        {
          image: require('@/assets/pblImg/game1.png'),
          text: '基于玩与创造的自主学习'
        },
        {
          image: require('@/assets/pblImg/game2.png'),
          text: '建立个人知识体系、探索他人知识'
        },
        {
          image: require('@/assets/pblImg/game3.png'),
          text: '拥有个人网站展示自己的作品'
        },
        {
          image: require('@/assets/pblImg/game4.png'),
          text: '基于项目的学习'
        },
        {
          image: require('@/assets/pblImg/game5.png'),
          text: '来自职业程序员的知识传授'
        }
      ],
      boardImgUrl: require('@/assets/pblImg/game1.png'),
      newsHtml: '',
      videoHtml: ''
    }
  },
  components: {
    ProjectCell,
    RegisterDialog
  },
  async mounted() {
    this.textAnimation()
    lesson.packages
      .getHotsPackages()
      .then(res => {
        this.hotsPackages = res
      })
      .catch(err => console.error(err))
    let payload = { perPage: 1, page: 1 }
    await Promise.all([
      this.getExcellentProjects(),
      this.getPackagesList(payload)
    ])
    // await this.getNewsAndVideo()
  },
  computed: {
    ...mapGetters({
      excellentProjects: 'pbl/excellentProjects',
      allPackages: 'lesson/center/packagesList'
    }),
    allPackagesCount() {
      return _.get(this.allPackages, 'count', 0)
    },
    excellentProjectsCount() {
      return _.get(this.excellentProjects, 'count', 0)
    },
    projectsRows() {
      return _.cloneDeep(_.get(this.excellentProjects, 'rows', []))
    },
    handpickProjects() {
      let tempArr = this.projectsRows
        .map(i => i)
        .sort(this.sortByKey('choicenessNo'))
      let tempArr2 = _.cloneDeep(tempArr.slice(0, 4))
      return _.forEach(tempArr2, i => {
        i.name_title = i.name || '未命名'
      })
    },
    likesProjects() {
      let tempArr = this.projectsRows
        .map(i => i)
        .sort(this.sortByKey('lastStar'))
      let tempArr2 = _.cloneDeep(tempArr.slice(0, 4))
      tempArr2 = this.sortByKeys(tempArr2, 'lastStar', 'updatedAt')
      return _.forEach(tempArr2, i => {
        i.name_title = i.name || '未命名'
      })
    }
  },
  methods: {
    ...mapActions({
      getExcellentProjects: 'pbl/getExcellentProjects',
      getPackagesList: 'lesson/center/getPackagesList'
    }),
    textAnimation() {
      this.subtitleAnimation = setInterval(() => {
        this.boardImgUrl = this.briefPic[this.currIndex].image
        this.currIndex += 1
        if (this.currIndex > 5) {
          this.currIndex = 0
        }
      }, 1500)
    },
    continueTextAnimation(index){
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
      this.boardImgUrl = this.briefPic[index].image
    },
    closeAd() {
      this.hiddenAd = true
    },
    viewMore() {
      this.$router.push('/exploration')
    },
    goJoin() {
      this.isRegisterDialogShow = true
    },
    closeRegisterDialog() {
      this.isRegisterDialogShow = false
    },
    goCreativityPage() {
      this.$router.push(`/creativity`)
      // window.location.href=`${this.locationOrigin}/creativity`
    },
    goExplorationPage() {
      this.$router.push(`/exploration`)
      // window.location.href=`${this.locationOrigin}/exploration`
    },
    goStudyPage() {
      this.$router.push(`/study`)
      // window.location.href=`${this.locationOrigin}/study`
    },
    goLessonPackage(lessonPackage) {
      window.open(`/l/student/package/${lessonPackage.id}`)
    },
    sortByKey(key) {
      return (obj1, obj2) => {
        return obj1[key] >= obj2[key] ? -1 : 1
      }
    },
    sortByKeys(arr, groupKey, sortKey) {
      let group = _.reduce(
        arr,
        (obj, prv) => {
          _.isArray(obj[prv[groupKey]])
            ? obj[prv[groupKey]].push(prv)
            : (obj[prv[groupKey]] = [prv])
          return obj
        },
        {}
      )
      _.forEach(group, item => item.sort(this.sortByKey(sortKey)))
      let keysArr = _.keys(group).sort((a, b) => b - a)
      let likesArray = []
      _.forEach(keysArr, key => {
        likesArray = [...likesArray, ...group[key]]
      })
      return likesArray
    },
    async getNewsAndVideo() {
      // FIXME: 使用线上的markdown地址
      const HomePageInfo = {
        apiPrefix: 'https://api-release.keepwork.com/git/v0',
        projectName: 'kevinxft/123321',
        newsPath: 'kevinxft/123321/news.md',
        videoPath: 'kevinxft/123321/video.md'
      }
      let [news = '', video = ''] = await Promise.all([
        gitlabShowRawForGuest(
          HomePageInfo.apiPrefix,
          HomePageInfo.projectName,
          HomePageInfo.newsPath
        ),
        gitlabShowRawForGuest(
          HomePageInfo.apiPrefix,
          HomePageInfo.projectName,
          HomePageInfo.videoPath
        )
      ])
      this.newsHtml = news
      this.videoHtml = video
    }
  },
  beforeDestroy() {
    clearinterval(this.subtitleAnimation)
  }
}
</script>

<style lang="scss">
.home-page {
  &-register-dialog {
    .el-dialog {
      max-width: 352px;
    }
  }
  &-advertising-head {
    max-width: 1200px;
    box-sizing: border-box;
    margin: 0 auto;
    margin-top: 16px;
    height: 42px;
    line-height: 42px;
    text-align: center;
    background: rgba(35, 151, 243, 0.2);
    border-radius: 4px;
    border: solid 1px #2397f3;
    color: #2397f3;
    position: relative;
    .iconfont {
      font-size: 20px;
      margin-right: 6px;
    }
    .close {
      display: inline-block;
      width: 40px;
      height: 38px;
      line-height: 42px;
      font-size: 28px;
      position: absolute;
      right: 20px;
      cursor: pointer;
    }
  }
  .hidden-ad {
    height: 0;
    overflow: hidden;
    border: none;
    transition: all 0.2s ease-out;
  }
  &-simple-show {
    margin-top: 16px;
    padding-bottom: 40px;
    border-bottom: 1px solid #eeeeee;
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
            padding: 0 28px;
            height: 36px;
            margin: 24px 0 12px;
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
            height: 193px;
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
      .hot-lesson {
        .lesson {
          width: 290px;
          padding: 16px;
          box-sizing: border-box;
          border: 1px solid #e8e8e8;
          background: #fff;
          margin: 0 auto 16px;
          border-radius: 4px;
          transition: all 200ms ease-in;
          &:hover {
            box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.16);
            transition: all 200ms ease-in;
          }
          &-cover {
            width: 100%;
            height: 143px;
            object-fit: cover;
            border-radius: 4px;
            cursor: pointer;
          }
          &-title {
            font-size: 14px;
            margin: 10px 0;
            cursor: pointer;
          }
          &-desc {
            font-size: 12px;
            color: #909399;
            &-text {
              height: 60px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              line-height: 20px;
              -webkit-box-orient: vertical;
              margin-bottom: 0;
            }
          }
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
    &-cabinet {
      &-excellent {
        .hot-lesson {
          .lesson {
            margin: 0 auto 15px;
          }
        }
      }
    }
  }
}
</style>