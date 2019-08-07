<template>
  <div class="contests-dynamic-news">
    <div class="contests-dynamic-part" @click="openLink(i.url)" v-for="(i,index) in newsData" :key="index">
      <div class="contests-dynamic-part-left">
        <img class="contests-dynamic-part-left-img" :src="i.cover" alt="">
      </div>
      <div class="contests-dynamic-part-right">
        <p class="contests-dynamic-part-right-notice">{{i.title}}</p>
        <p class="contests-dynamic-part-right-hint">{{i.desc}}</p>
        <p class="contests-dynamic-part-right-time">{{i.date}}<span class="contests-dynamic-part-right-time-right"><img src="@/assets/contests/toRight.png" alt=""></span></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ContestsDynamicNews',
  data() {
    return {
      newsData: [
        {
          title: '为未知而教，为未来而学',
          desc: '汉字大赛走进淅川，让科技为文化传承赋能。',
          date: '2019/8/6',
          cover: require('@/assets/contests/newsImg/为未知而教，为未来而学0806.jpg'),
          url: 'https://mp.weixin.qq.com/s?__biz=MzU5MDU1MzM0Ng==&mid=2247484402&idx=1&sn=823973ff9373a5916e08db650a7f72dd&chksm=fe3dcb9fc94a42893668ab73e1f346b4e74f1298c9ec8c8d765c476b96e715a3c00e4bb7cc2e&token=360524135&lang=zh_CN#rd'
        },
        {
          title: '汉字大赛 | 作品赏析 -“孙”姓',
          desc: '记得在视频中找亮点喔~',
          date: '2019/8/2',
          cover: require('@/assets/contests/newsImg/汉字大赛-作品赏析 -“孙”姓.jpg'),
          url: 'https://mp.weixin.qq.com/s?__biz=MzU5MDU1MzM0Ng==&mid=2247484392&idx=1&sn=32eebff8520458b60508e99a0413b96a&chksm=fe3dcb85c94a42931aff5c66c713949e244a9957b459318f92a643482895f12f28977092d954&token=44448191&lang=zh_CN#rd'
        },
        {
          title: '汉字大赛 | 报名流程及注意事项',
          desc: '暑假，创作作品的黄金时间，速速报名参赛吧！',
          date: '2019 / 7 / 15',
          cover: require('@/assets/contests/newsImg/汉字大赛-报名流程及注意事项.jpg'),
          url: 'https://mp.weixin.qq.com/s?__biz=MzU5MDU1MzM0Ng==&mid=2247484378&idx=1&sn=c154d20d0470415695b7ffc7d2eb20ad&chksm=fe3dcbb7c94a42a1c1a43f574cf2193efc341b991e45a3c251cd0428854369570a9f52fa17ee&token=44448191&lang=zh_CN#rd'
        },
        {
          title: '“汉字大赛 | 创作技巧大放送（一）',
          desc:
            '创作时感觉力不从心，很多技巧都不会？别慌，这里有搭建汉字的速成秘诀！',
          date: '2019 / 6 / 27',
          cover: require('@/assets/contests/a1.png'),
          url: 'https://mp.weixin.qq.com/s/5npjVGyKdpEMhG1UK82sLQ'
        },
        {
          title: '汉字大赛｜姓氏趣闻一',
          desc: '奇葩姓氏你知道几个？',
          date: '2019 / 5 / 24',
          cover: require('@/assets/contests/a3.png'),
          url: 'https://mp.weixin.qq.com/s/7vmA5tEkAZ1wyUwRV7NzNQ'
        },
        {
          title: '“用计算机程序让汉字活起来 走向世界”内容创作大赛征集公告',
          desc: '大赛正式启动啦，速速报名参赛吧！',
          date: '2019 / 4 / 24',
          cover: require('@/assets/contests/a2.png'),
          url: 'https://mp.weixin.qq.com/s/F64qcFRRqdAbC25AwdAIcw'
        }
      ]
    }
  },
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
    padding: 22px 20px 22px 22px;
    background-size: 100%;
    border: 2px solid transparent;
    cursor: pointer;
    &:hover {
      border: 2px solid #043e93;
    }
    &-left {
      &-img {
        width: 380px;
        height: 213px;
        object-fit: cover;
        border-radius: 5px;
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
      margin: 16px;
      padding: 0;
      min-height: auto;
      &:hover {
        border: none;
      }
      &-left {
        width: 56%;
        &-img {
          width: 90%;
          max-width: 400px;
          height: 120px;
          border-radius: 5px;
        }
      }
      &-right {
        padding: 0;
        &-notice {
          font-size: 16px;
          height: 63px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-height: 21px;
          -webkit-box-orient: vertical;
          margin-top: 10px;
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
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>


