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
        <div class="home-page-simple-show-center-right"></div>
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
  &-simple-show{
    border-bottom: 1px solid #eeeeee;
    &-center{
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      &-left{
        flex: 1;
        height: 455px;
        // border: 1px solid red;
        position: relative;
        &-desc{
          // border: 1px solid blue;
          position: absolute;
          .title{
            color: #2397f3;
          }
        }
      }
      &-right{
        width: 384px;
        // border: 1px solid red;
      }
    }
  }
}
</style>

