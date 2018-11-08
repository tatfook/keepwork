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
            <h2 class="title">创作自己的游戏与动画</h2>
            <p class="intro">拥有自己的自己体系</p>
            <p class="intro">拥有自己的个人网站</p>
            <p class="intro">通过项目来学习编程</p>
            <p class="intro">程序员为程序员创作的教程</p>
            <el-button type="primary" round class="join-button" @click="goJoin">马上免费加入</el-button>
            <div class="remainder">
              <a href="https://keepwork.com/official/paracraft/to-educators" target="_blank" class="pedagogue">给教育者的话</a>
              <a href="https://keepwork.com/official/paracraft/to-parents" target="_blank">告家长</a>
            </div>
          </div>
          <div class="flexible-info-board"></div>
        </div>
        <div class="home-page-simple-show-center-right">
          <div class="home-page-simple-show-center-right-kp">
            <div class="title">keepwork是做什么的</div>
            <div class="video" v-if="videoHtml" v-html="videoHtml">

            </div>
            <div v-else class="video">
              <video width="100%" src="https://api.keepwork.com/storage/v0/siteFiles/1049/raw#2018-10-11_17_00_04-800-双马尾.mp4" poster="https://api.keepwork.com/storage/v0/siteFiles/1048/raw#2018-10-11_16_59_35-392-双马尾.jpg" controls></video>
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
        <el-row>
          <el-col :span="8" :xs="24">
            <div class="box" @click="goCreativityPage">
              <div class="box-text">
                <h2>创造</h2>
                <p class="box-text-intro">创造属于你自己的项目</p>
                <p class="box-text-own">已创建项目:
                  <span class="total">{{excellentProjectsCount}}</span></p>
              </div>
              <div class="box-img">
                <img src="@/assets/img/puzzle.png" alt="">
              </div>
            </div>
          </el-col>
          <el-col :span="8" :xs="24">
            <div class="box" @click="goExplorationPage">
              <div class="box-text">
                <h2>探索</h2>
                <p class="box-text-intro">发现更多有趣的作品</p>
                <p class="box-text-own">已共享内容:
                  <span class="total">123456</span></p>
              </div>
              <div class="box-img">
                <img src="@/assets/img/rocket.png" alt="">
              </div>
            </div>
          </el-col>
          <el-col :span="8" :xs="24">
            <div class="box no-line" @click="goStudyPage">
              <div class="box-text">
                <h2>学习</h2>
                <p class="box-text-intro">好好学习，天天向上</p>
                <p class="box-text-own">拥有在线课程：
                  <span class="total">{{allPackagesCount}}</span></p>
              </div>
              <div class="box-img">
                <img src="@/assets/img/bulb.png" alt="">
              </div>
            </div>
          </el-col>
        </el-row>
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
                <p class="lesson-desc-text">简介：{{lessonPackage.intro}}</p>
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
import axios from 'axios'

export default {
  name: 'HomePage',
  data() {
    return {
      projects: [],
      hotsPackages: [],
      hiddenAd: false,
      isRegisterDialogShow: false,
      locationOrigin: window.location.origin,
      newsHtml: '',
      videoHtml: ''
    }
  },
  components: {
    ProjectCell,
    RegisterDialog
  },
  async mounted() {
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
    async getNewsAndVideo() {
      // FIXME: 使用api去获取，需要等正式发布后更改
      const newsUrl = `https://git.keepwork.com/gitlab_rls_official/keepworkkeepwork/raw/master/official/keepwork/news.md?_random=${Math.random()}`
      const videoUrl = `https://api-release.keepwork.com/git/v0/projects/kevinxft%2F123321/files/kevinxft%2F123321%2Fvideo.md?_random=${Math.random()}`
      let [ news, video ] = await Promise.all([ axios.get(newsUrl), axios.get(videoUrl)])
      this.newsHtml = _.get(news, 'data', '')
      this.videoHtml = _.get(video, 'data.content', '')
    }
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
    margin: 0 auto;
    margin-top: 24px;
    height: 40px;
    line-height: 40px;
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
    transition: all 1s ease-out;
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
          .intro {
            font-size: 14px;
            color: #c0c4cc;
            margin: 11px 0;
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
          right: 104px;
          top: 68px;
          width: 223px;
          height: 146px;
          border: 1px solid #ccc;
          background: #fff;
          border-radius: 4px;
        }
      }
      &-right {
        width: 384px;
        margin-left: 30px;
        .title {
          height: 42px;
          background: rgb(245, 245, 245);
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
              .news-badge{
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
      .box {
        margin: 24px 0;
        padding: 20px 36px 20px 24px;
        display: flex;
        border-right: 1px solid #eee;
        cursor: pointer;
        &-text {
          flex: 1;
          &-intro {
            color: #a0a4aa;
            font-size: 16px;
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
          max-width: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 100%;
          }
        }
        &:hover {
          background: rgb(222, 229, 248);
        }
      }
      .no-line {
        border: none;
      }
    }
  }
  &-cabinet {
    background: #f6f7f8;
    &-excellent {
      margin: 0 auto;
      padding-top: 50px;
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
              height: 80px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 5;
              line-height: 16px;
              -webkit-box-orient: vertical;
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