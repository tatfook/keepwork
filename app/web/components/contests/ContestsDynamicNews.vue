<template>
  <div class="contests-dynamic-news">
    <div class="contests-dynamic-part" @click="openLink('https://mp.weixin.qq.com/s/5npjVGyKdpEMhG1UK82sLQ')">
      <div class="contests-dynamic-part-left">
        <img class="contests-dynamic-part-left-img" src="@/assets/contests/a1.png" alt="">
      </div>
      <div class="contests-dynamic-part-right">
        <p class="contests-dynamic-part-right-notice">汉字大赛 | 创作技巧大放送（一）</p>
        <p class="contests-dynamic-part-right-hint">创作时感觉力不从心，很多技巧都不会？别慌，这里有搭建汉字的速成秘诀！</p>
        <p class="contests-dynamic-part-right-time">2019 / 6 / 27<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
      </div>
    </div>
    <div class="contests-dynamic-part" @click="openLink('https://mp.weixin.qq.com/s/7vmA5tEkAZ1wyUwRV7NzNQ')">
      <div class="contests-dynamic-part-left">
        <img class="contests-dynamic-part-left-img" src="@/assets/contests/a3.png" alt="">
      </div>
      <div class="contests-dynamic-part-right">
        <p class="contests-dynamic-part-right-notice">汉字大赛｜姓氏趣闻一</p>
        <p class="contests-dynamic-part-right-hint">奇葩姓氏你知道几个？</p>
        <p class="contests-dynamic-part-right-time">2019 / 5 / 24<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
      </div>
    </div>
    <div class="contests-dynamic-part" @click="openLink('https://mp.weixin.qq.com/s/F64qcFRRqdAbC25AwdAIcw')">
      <div class="contests-dynamic-part-left">
        <img class="contests-dynamic-part-left-img" src="@/assets/contests/a2.png" alt="">
      </div>
      <div class="contests-dynamic-part-right">
        <p class="contests-dynamic-part-right-notice">“用计算机程序让汉字活起来 走向世界”内容创作大赛征集公告</p>
        <p class="contests-dynamic-part-right-hint">大赛正式启动啦，速速报名参赛吧！</p>
        <p class="contests-dynamic-part-right-time">2019 / 4 / 24<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ContestsDynamicNews',
  methods: {
    openLink(url) {
      window.open(url)
    }
  }
}
</script>
<style lang="scss" scoped>
.contests-dynamic {
  &-part {
    max-width: 980px;
    min-height: 258px;
    display: flex;
    margin: 12px auto;
    box-sizing: border-box;
    padding: 22px 20px 0 22px;
    background-size: 100%;
    border: 2px solid transparent;
    cursor: pointer;
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
    &-part {
      // display: block;
      margin: 16px;
      padding: 0;
      min-height: auto;
      &-left {
        width: 56%;
        &-img {
          width: 90%;
          max-width: 400px;
          height: 120px;
        }
      }
      &-right {
        padding: 0;
        &-notice {
          font-size: 14px;
          height: 56px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          line-height: 14px;
          -webkit-box-orient: vertical;
        }
        &-hint {
          font-size: 14px;
          display: none;
        }
        &-time {
          margin: 0;
          &-right {
            img {
              width: 50px;
            }
          }
        }
      }
    }
  }
}
</style>


