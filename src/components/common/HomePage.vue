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
            <div class="video"></div>
          </div>
          <div class="home-page-simple-show-center-right-board">
            <div class="title">官方公告</div>
            <ul class="announce-list">
              <li><img class="iicc" src="@/assets/img/iicc_logo.png" alt="iicc">IICC大赛火热进行中！</li>
              <li>
                <i class="iconfont icon-book-fill"></i> Lessons系统即将上线，尽情期待！</li>
            </ul>
          </div>
        </div>
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
        // border: 1px solid red;
        .title {
          height: 42px;
          background: rgb(245, 245, 245);
        }
        &-kp {
          border-radius: 4px;
          border: 1px solid #eeeeee;
        }
        &-board {
          margin-top: 16px;
          border-radius: 4px;
          border: 1px solid #eeeeee;
          .announce-list {
            li {
              display: flex;

              .iicc {
                width: 22px;
                height: 22px;
              }
            }
          }
        }
      }
    }
  }
}
</style>

