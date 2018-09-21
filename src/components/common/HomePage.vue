<template>
  <div class="home-page">
    <div class="home-page-advertising-head">
      <i class="iconfont icon-sound-fill"></i>3D创作工具：Paracraft 永久免费！
      <span class="close">&times;</span>
    </div>
    <div class="home-page-simple-show">
      <div class="home-page-simple-show-center">
        <div class="home-page-simple-show-center-left">
          <div class="home-page-simple-show-center-left-desc">
            <h2 class="title">创作自己的游戏与动画</h2>
            <p>拥有自己的自己体系</p>
            <p>拥有自己的个人网站</p>
            <p>通过项目来学习编程</p>
            <p>程序员为程序员创作的教程</p>
          </div>
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
                <i class="iconfont icon-book-fill"></i> Lessons系统即将上线，尽情期待！
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
              <h2>创造</h2>
              <p>创造属于你自己的项目</p>
              <p>已创建项目<span>123456</span>个</p>
              <img class="brief-img" src="https://git-stage.keepwork.com/gitlab_www_keepgo1230/keepworkdatasource/raw/master/keepgo1230_images/img_1530177473927.png" alt="">
            </div>
          </el-col>
          <el-col :span="8">
            <div class="box">
              <h2>探索</h2>
              <p>发现更多有趣的作品</p>
              <p>已共享内容<span>123456</span>条</p>
              <img class="brief-img" src="https://git-stage.keepwork.com/gitlab_www_keepgo1230/keepworkdatasource/raw/master/keepgo1230_images/img_1530177473927.png" alt="">
            </div>
          </el-col>
          <el-col :span="8">
            <div class="box">
              <h2>学习</h2>
              <p>好好学习，天天向上</p>
              <p>已记录知识<span>22543</span>条</p>
              <img class="brief-img" src="https://git-stage.keepwork.com/gitlab_www_keepgo1230/keepworkdatasource/raw/master/keepgo1230_images/img_1530177473927.png" alt="">
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
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
      width: 4 0px;
      height: 38px;
      line-height: 42px;
      font-size: 28px;
      position: absolute;
      right: 20px;
    }
  }
  &-simple-show {
    margin-top: 16px;
    border-bottom: 1px solid #eeeeee;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      &-left {
        flex: 1;
        height: 455px;
        border: 1px solid red;
        position: relative;
        &-desc {
          border: 1px solid blue;
          position: absolute;
          .title {
            color: #2397f3;
          }
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
              .icon-book-fill {
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
      .box{
        padding: 28px;
        position: relative;
        .brief-img{
          position: absolute;
          right: 66px;
          top: 66px;
          max-width: 77px;
        }
      }
      .box:hover{
        background: #eee;
      }
    }
  }
}
</style>

