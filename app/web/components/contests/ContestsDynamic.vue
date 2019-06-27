<template>
  <div class="contests-dynamic">
    <div class="contests-dynamic-part">
      <div class="contests-dynamic-part-left">
        <img class="contests-dynamic-part-left-img" src="@/assets/contests/a1.png" alt="">
      </div>
      <div class="contests-dynamic-part-right">
        <p class="contests-dynamic-part-right-notice">“用计算机程序让汉字活起来 走向世界”内容创作大赛征集公告</p>
        <p class="contests-dynamic-part-right-hint">大赛正式启动啦，速速报名参赛吧！</p>
        <p class="contests-dynamic-part-right-time">2019 / 4 / 24<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
      </div>
    </div>
    <div class="contests-dynamic-part">
      <div class="contests-dynamic-part-left">
        <img class="contests-dynamic-part-left-img" src="@/assets/contests/a2.png" alt="">
      </div>
      <div class="contests-dynamic-part-right">
        <p class="contests-dynamic-part-right-notice">汉字大赛｜姓氏趣闻一</p>
        <p class="contests-dynamic-part-right-hint">奇葩姓氏你知道几个？</p>
        <p class="contests-dynamic-part-right-time">2019 / 5 / 24<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
      </div>
    </div>
    <div class="contests-dynamic-part">
      <div class="contests-dynamic-part-left">
        <img class="contests-dynamic-part-left-img" src="@/assets/contests/a3.png" alt="">
      </div>
      <div class="contests-dynamic-part-right">
        <p class="contests-dynamic-part-right-notice">汉字大赛 | 创作技巧大放送（一）</p>
        <p class="contests-dynamic-part-right-hint">创作时感觉力不从心，很多技巧都不会？别慌，这里有搭建汉字的速成秘诀！</p>
        <p class="contests-dynamic-part-right-time">2019 / 6 / 27<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
      </div>
    </div>
    <!-- <img class="contests-dynamic-bgpic element_text_1" src="@/assets/contests/element_text_1.png" alt=""> -->
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
  margin: 0 auto 280px;
  &-bgpic {
    position: absolute;
    z-index: -999;
    &.element_text_1 {
      right: 100px;
      top: 120px;
    }
    &.element_text_2 {
      left: 80px;
      top: 130px;
    }
    &.element_text_3 {
      right: 100px;
      bottom: 300px;
    }
  }
  &-part {
    max-width: 980px;
    min-height: 258px;
    display: flex;
    margin: 12px auto;
    box-sizing: border-box;
    padding: 22px 20px 0 22px;
    // background: url('../../assets/contests/baidi.png') no-repeat top center;
    background-size: 100%;
    border: 2px solid transparent;
    &:hover {
      border: 2px solid #043e93;
    }
    &-left {
      &-img {
        width: 380px;
        object-fit: cover;
      }
    }
    &-right {
      padding-left: 20px;
      flex: 1;
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


