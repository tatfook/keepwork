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
            <el-button type="primary" round class="join-button">马上免费加入</el-button>
            <div class="remainder">
              <a href="/official/paracraft/to-parents" target="_blank" class="pedagogue">给教育者的话</a>
              <a href="/official/paracraft/to-educators" target="_blank">告家长</a>
            </div>
          </div>
          <div class="flexible-info-board"></div>
        </div>
        <div class="home-page-simple-show-center-right">
          <div class="home-page-simple-show-center-right-kp">
            <div class="title">keepwork是做什么的</div>
            <div class="video">
              <video src="http://flv.aoao365.com/2018/0905/198faae647a4ddc1a52e7d4c096ab307.flv.mp4" controls autoplay loop></video>
            </div>
          </div>
          <div class="home-page-simple-show-center-right-board">
            <div class="title">官方公告</div>
            <ul class="announce-list">
              <li><img class="iicc" src="@/assets/img/iicc_logo.png" alt="iicc">IICC大赛火热进行中！
                <a href="">进入</a>
              </li>
              <li>
                <span class="icon-book">
                  <i class="iconfont icon-book-fill"></i>
                </span> Lessons系统即将上线，尽情期待！
                <a href="">进入</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="home-page-brief">
      <div class="home-page-brief-center">
        <el-row>
          <el-col :span="8">
            <div class="box">
              <div class="box-text">
                <h2>创造</h2>
                <p>创造属于你自己的项目</p>
                <p>已创建项目
                  <span>123456</span>个</p>
              </div>
              <div class="box-img">
                <img src="@/assets/img/puzzle.png" alt="">
              </div>
              </div>
          </el-col>
          <el-col :span="8">
            <div class="box">
              <div class="box-text">
                <h2>探索</h2>
                <p>发现更多有趣的作品</p>
                <p>已共享内容
                  <span>123456</span>条</p>
              </div>
              <div class="box-img">
                <img src="@/assets/img/rocket.png" alt="">
              </div>
              </div>
          </el-col>
          <el-col :span="8">
            <div class="box no-line">
              <div class="box-text">
                <h2>学习</h2>
                <p>好好学习，天天向上</p>
                <p>已记录知识
                  <span>22543</span>条</p>
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
          <div class="more">查看更多&gt;</div>
        </div>
        <el-row>
          <el-col :span="6" v-for="(project,index) in handpickProjects" :key="index" v-if="index < 4">
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
          <div class="more">查看更多&gt;</div>
        </div>
        <el-row>
          <el-col :span="6" v-for="(lessonPackage,index) in hotsPackages" :key="index">
            <div class="lesson">
              <img class="lesson-cover" :src="lessonPackage.extra.coverUrl" alt="">
              <h4 class="lesson-title">{{lessonPackage.packageName}}</h4>
              <div class="lesson-desc">
                <p>包含：
                  <span>125</span>个课程</p>
                <p>年龄：{{lessonPackage.minAge}}-{{lessonPackage.maxAge}}</p>
                <p>简介：{{lessonPackage.intro}}</p>
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
          <div class="more">查看更多&gt;</div>
        </div>
        <el-row>
          <el-col :span="6" v-for="(project,index) in likesProjects" :key="index" v-if="index < 4">
            <project-cell1 :project="project"></project-cell1>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectCell from './ProjectCell'
import { keepwork,lesson } from '@/api'
import _ from 'lodash'
export default {
  name: 'HomePage',
  data() {
    return {
      projects: [],
      hotsPackages: [],
      hiddenAd: false
    }
  },
  components: {
    ProjectCell,
    ProjectCell1:ProjectCell
  },
  async mounted() {
    lesson.packages.getHotsPackages().then(res => {
      this.hotsPackages = res
    }).catch(err => console.error(err))
    await keepwork.projects
      .getProjects()
      .then(res => {
        console.log('res', res)
        this.projects = _.get(res, 'rows', [])
        //test data,after remove
        this.projects = [
          {
            choicenessNo: 62,
            createdAt: '2018-09-26T06:03:17.000Z',
            description: '',
            commentCount: 1252,
            extra: {
              coverUrl:
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538218843433&di=57c0eb1ae527dd3d2ca5a456d7ac01f5&imgtype=0&src=http%3A%2F%2Fwww.xingzuoba.cn%2Ffile%2Fupload%2F2000%2F20170430%2F201704301494854563122.jpg'
            },
            hotNo: 0,
            id: 1,
            name: '笑傲江湖',
            privilege: 197,
            siteId: null,
            star: 58,
            type: 0,
            updatedAt: '2018-09-27T09:20:47.000Z',
            userId: 37,
            visibility: 1,
            visit: 32,
            user: {
              description: null,
              nickname: '哈哈哈',
              portrait:
                'http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg',
              userId: 37,
              username: 'kevinxft'
            }
          },
          {
            choicenessNo: 70,
            createdAt: '2018-09-26T06:03:17.000Z',
            description: '',
            commentCount: 125258,
            extra: {
              coverUrl:
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538227073141&di=c5dd3c7604513aefe125b0c1401b129c&imgtype=0&src=http%3A%2F%2Fimg1.sc115.com%2Fuploads%2Fsc%2Fjpg%2F144%2F18383.jpg'
            },
            hotNo: 0,
            id: 2,
            name: '神雕侠侣',
            privilege: 197,
            siteId: null,
            star: 189,
            type: 0,
            updatedAt: '2018-09-27T09:20:47.000Z',
            userId: 37,
            visibility: 1,
            visit: 10,
            user: {
              description: null,
              nickname: '香香',
              portrait:
                'http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg',
              userId: 37,
              username: '香香'
            }
          },
          {
            choicenessNo: 58,
            createdAt: '2018-09-26T06:03:17.000Z',
            description: '',
            commentCount: 12,
            extra: {
              coverUrl:
                'http://dik.img.lgdsy.com/pic/5/3255/6c792afdc6db20bb.jpg'
            },
            hotNo: 0,
            id: 3,
            name: '锦绣未央',
            privilege: 197,
            siteId: null,
            star: 269,
            type: 0,
            updatedAt: '2018-09-27T09:20:47.000Z',
            userId: 37,
            visibility: 1,
            visit: 40,
            user: {
              description: null,
              nickname: '3号牛肚',
              portrait:
                'http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg',
              userId: 37,
              username: 'kevinxft'
            }
          },
          {
            choicenessNo: 12,
            createdAt: '2018-09-26T06:03:17.000Z',
            description: '',
            commentCount: 122,
            extra: {
              coverUrl:
                'http://b.zol-img.com.cn/desk/bizhi/image/2/960x600/1362383591876.jpg'
            },
            hotNo: 0,
            id: 4,
            name: '大富科技',
            privilege: 197,
            siteId: null,
            star: 255,
            type: 0,
            updatedAt: '2018-09-27T09:20:47.000Z',
            userId: 37,
            visibility: 1,
            visit: 0,
            user: {
              description: null,
              nickname: '大天亮',
              portrait:
                'http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg',
              userId: 37,
              username: '大天亮'
            }
          },
          {
            choicenessNo: 12,
            createdAt: '2018-09-26T06:03:17.000Z',
            description: '',
            commentCount: 252,
            extra: {
              coverUrl:
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538219058252&di=22546ecd50dc263271f0ffe44074c38a&imgtype=0&src=http%3A%2F%2Fimg.tupianzj.com%2Fuploads%2Fallimg%2F20170514%2F0G4ae4NwY5443.jpeg'
            },
            hotNo: 0,
            id: 7,
            name: '嘿嘿哈哈',
            privilege: 197,
            siteId: null,
            star: 255,
            type: 0,
            updatedAt: '2018-09-27T09:20:47.000Z',
            userId: 37,
            visibility: 1,
            visit: 0,
            user: {
              description: null,
              nickname: '田螺一号',
              portrait:
                'http://git-stage.keepwork.com/gitlab_www_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1533803582075.jpeg',
              userId: 37,
              username: 'kevinxft'
            }
          }
        ]
      })
      .catch(err => console.log(err))
  },
  methods: {
    closeAd(){
      this.hiddenAd = true
    }
  },
  computed: {
    handpickProjects() {
      return this.projects.map(i => i).sort(
        (obj1, obj2) => obj1.choicenessNo < obj2.choicenessNo
      )
    },
    likesProjects(){
      return this.projects.map(i => i).sort(
        (obj1, obj2) => obj1.star < obj2.star
      )
    }
  }
}
</script>

<style lang="scss">
.home-page {
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
  .hidden-ad{
    // display: none;
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
              }
              .iicc {
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
        margin-top: 24px;
        padding: 20px 36px 20px 24px;
        display: flex;
        border-right: 1px solid #eee;
        &-text {
          flex: 1;
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
        }
      }
      .el-row {
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
          }
          &-title {
            font-size: 14px;
            margin: 10px 0;
          }
          &-desc {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
    .like {
      padding-bottom: 80px;
    }
  }
}
</style>