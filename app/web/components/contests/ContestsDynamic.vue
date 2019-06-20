<template>
  <div class="contests-dynamic">
    <div class="contests-dynamic-part">
      <div class="contests-dynamic-part-left">
        <img class="contests-dynamic-part-left-img" src="@/assets/contests/logo.png" alt="">
      </div>
      <div class="contests-dynamic-part-right">
        <p class="contests-dynamic-part-right-notice">“用计算机程序让汉字活起来 走向世界”内容创作大赛征集公告</p>
        <p class="contests-dynamic-part-right-hint">大赛正式启动啦，速速报名参赛吧！</p>
        <p class="contests-dynamic-part-right-time">2019 / 12 / 02<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
      </div>
    </div>
    <div class="contests-dynamic-part">
      <div class="contests-dynamic-part-left">
        <img class="contests-dynamic-part-left-img" src="@/assets/contests/logo.png" alt="">
      </div>
      <div class="contests-dynamic-part-right">
        <p class="contests-dynamic-part-right-notice">“用计算机程序让汉字活起来 走向世界”内容创作大赛征集公告</p>
        <p class="contests-dynamic-part-right-hint">大赛正式启动啦，速速报名参赛吧！</p>
        <p class="contests-dynamic-part-right-time">2019 / 12 / 02<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
      </div>
    </div>
    <img class="contests-dynamic-bgpic element_text_1" src="@/assets/contests/element_text_1.png" alt="">
    <img class="contests-dynamic-bgpic element_text_2" src="@/assets/contests/element_text_2.png" alt="">
    <img class="contests-dynamic-bgpic element_text_3" src="@/assets/contests/element_text_3.png" alt="">
  </div>
</template>
<script>
export default {
  name: 'ContestsDynamic'
}
</script>
<style lang="scss" scoped>
.contests-dynamic {
  padding-top: 40px;
  position: relative;
  max-width: 1920px;
  margin: 0 auto;
  &-bgpic {
    position: absolute;
    z-index: -999;
    &.element_text_1 {
      right: 100px;
      top: 120px;
    }
    &.element_text_2 {
      left: 80px;
      top: 100px;
    }
    &.element_text_3 {
      right: 200px;
      bottom: 400px;
    }
  }
  &-part {
    max-width: 980px;
    display: flex;
    margin: 12px auto;
    box-sizing: border-box;
    padding: 12px;
    background: #fff;
    &-left {
      &-img {
        width: 410px;
        height: 230px;
        object-fit: cover;
      }
    }
    &-right {
      padding-left: 20px;
      &-notice {
        font-size: 22px;
        color: #212121;
      }
      &-hint {
        font-size: 18px;
        color: #999;
      }
      &-time {
        color: #999;
        margin-top: 70px;
        &-right {
          float: right;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .contests-dynamic {
    &-bgpic {
      display: none;
    }
    &-part {
      display: block;
      margin: 16px;
      &-left {
        &-img {
          width: 100%;
          max-width: 400px;
          height: calc((100vw - 28px) / 317 * 179);
        }
      }
      &-right {
        padding: 0;
        &-notice {
          font-size: 16px;
        }
        &-hint {
          font-size: 14px;
        }
        &-time {
          margin: 0;
        }
      }
    }
  }
}
</style>


