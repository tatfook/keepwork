<template>
  <div class="lesson-summary-share-wrap" :class="[isPreview ? `style-${styleIndex}`: `style-${style}`, {'small': isSmall}]">
    <div class="lesson-summary-share" :class="[isPreview ? `style-${styleIndex}`: `style-${style}`, {'small': isSmall}]">
      <div class="left">
        <div class="shadow"></div>
      </div>
      <div class="main">
        <div class="movie"></div>
        <div v-if="isEn" class="summary-word">
          <div class="summary-word-time">
            {{$t('lesson.todayIs', {date: today})}}
          </div>
          <div class="summary-word-link">
            I am learning {{summary.name}} on Keepwork. Click
            <a @click.prevent="toAboutPage" href="" class="highlight link">here</a> to join and learn with me
          </div>
          <div class="summary-word-line">
            This is my
            <span class="highlight">{{summary.day}}st</span> day of learning
            <span class="highlight">{{summary.name}}</span> on Keepwork.
          </div>
          <div class="summary-word-line">
            Today, I read
            <span class="highlight">{{summary.read}}</span> lines of code, wrote
            <span class="highlight">{{summary.write}}</span> lines of code, and learned
            <span class="highlight">{{summary.command}}</span> computer command.
          </div>
        </div>
        <div v-else class="summary-word">
          <div class="summary-word-time">
            {{$t('lesson.todayIs', {date: today})}}
          </div>
          <div class="summary-word-link">
            我正在keepwork学习 {{summary.name}} . 点击
            <a @click.prevent="toAboutPage" href="" class="highlight link">这里</a> 加入，并和我一起学习
          </div>
          <div class="summary-word-line">
            这是我第在keepwork学习
            <span class="highlight">{{summary.name}}</span> 的第
            <span class="highlight">{{summary.day}}</span> 天
          </div>
          <div class="summary-word-line">
            今天，我读了
            <span class="highlight">{{summary.read}}</span> 行代码, 写了
            <span class="highlight">{{summary.write}}</span> 行代码, 学习了
            <span class="highlight">{{summary.command}}</span> 个电脑命令
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { locale } from '@/lib/utils/i18n'
export default {
  name: 'LessonSummaryShare',
  props: {
    isPreview: {
      type: Boolean,
      default: false
    },
    styleIndex: {
      type: Number,
      default: 1
    },
    lessonSummary: {
      type: Object,
      default() {
        return {}
      }
    },
    isSmall: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      style: 1,
      summary: {}
    }
  },
  mounted() {
    if (this.isPreview) {
      this.summary = _.merge(this.summary, this.lessonSummary)
    } else {
      this.style = Number(this.$route.params.styleId) || 1
      this.$set(this.summary, _.merge(this.summary, this.$route.query))
    }
  },
  computed: {
    today() {
      const MONTH = [
        'Jan',
        'Feb',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
      let time = new Date()
      let year = time.getFullYear()
      let month = time.getMonth()
      let day = time.getDate()
      return this.isEn
        ? `${day}th ${MONTH[month]}. ${year}.`
        : `${year}年 ${month}月 ${day}日`
    },
    isEn() {
      return locale === 'en-US'
    }
  },
  methods: {
    toAboutPage() {
      this.$router.push({ path: '/student/about' })
    }
  }
}
</script>

<style lang="scss">
$timeSize: 30px;
$lineSize: 20px;
$mainHeight: 630px;
.lesson-summary-share-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  &.style-1 {
    background: #409efe;
  }
  &.style-2 {
    background: #ffb983;
  }
  &.style-3 {
    background: #5fffff;
  }
  &.small {
    height: 350px;
  }
  .lesson-summary-share {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &.small {
      transform: scale(0.4);
    }
    .main {
      height: $mainHeight;
      padding: 26px;
      .movie {
        $scale: 1.64;
        $width: 430px;
        height: ($width / $scale);
        width: $width;
        background: grey;
        border-radius: 5px;
        border: 8px solid #eeeeee;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: 0 0 30px 5px rgba(66, 66, 66, 0.5);
        &::after {
          $icon-size: 100px;
          content: '';
          display: block;
          height: $icon-size;
          width: $icon-size;
          background: url('../../../assets/lessonImg/play2.png') no-repeat
            center;
          background-size: $icon-size $icon-size;
        }
      }
      .summary-word {
        margin-top: 50px;
        min-width: 660px;
        color: black;
        .highlight {
          color: #409efe;
          font-weight: 600;
        }
        .link {
          color: #ec761a;
        }
        &-time {
          font-size: 28px;
          font-weight: 600;
        }
        &-link {
          margin: 40px 0;
        }
        &-line {
          line-height: 30px;
          &::before {
            $size: 8px;
            content: '';
            display: inline-block;
            height: $size;
            width: $size;
            background: #409efe;
            border-radius: 50%;
            margin-right: 6px;
          }
        }
      }
    }
    &.style-1 {
      $left-width: 340px;
      $padding: 26px;
      background: #409efe;
      padding: $padding;
      position: relative;
      .left {
        position: absolute;
        z-index: 998;
        left: ($padding - 1);
        height: ($mainHeight + 100);
        width: $left-width;
        filter: drop-shadow(10px 0px 2px rgba(66, 66, 66, 0.5));
        .shadow {
          clip-path: polygon(0 0, 100% 0, 45% 100%, 0 100%);
          background-color: #2e7dc9;
          color: white;
          height: 100%;
          position: fixed;
          text-align: center;
          top: 0;
          width: 100%;
          z-index: 100;
        }
      }
      .main {
        height: $mainHeight;
        width: 100%;
        background: white;
        position: relative;
        .movie {
          background: grey;
          position: relative;
          left: 200px;
          top: 24px;
          border-radius: 5px;
          border: 8px solid #e8f3ff;
          box-sizing: border-box;
          z-index: 998;
        }

        .summary-word {
          margin-left: ($left-width - 60);
          // margin-right: 70px;
        }
      }
    }

    &.style-2 {
      background: #ffb983;
      .left {
        display: none;
      }
      .main {
        box-sizing: border-box;
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        padding: 0 60px;

        .summary-word {
          &-time {
            color: #409efe;
            font-size: 26px;
            text-align: center;
            font-weight: 600;
          }
          &-link {
            margin-top: 20px;
          }
        }
      }
    }

    &.style-3 {
      // $mainHeight: 630px;
      display: flex;
      min-width: 100%;
      .left {
        flex: 1;
        background: #409efe;
        height: $mainHeight;
        .shadow {
          display: none;
        }
        &::after {
          content: '';
          height: $mainHeight;
          overflow-y: hidden;
          display: block;
          min-width: 200px;
          background: url('../../../assets/lessonImg/summary/bg-left.png')
            no-repeat right bottom;
          background-size: auto $mainHeight;
        }
      }
      .main {
        flex: 2;
        box-sizing: border-box;
        height: $mainHeight;
        background: white;
        display: flex;
        align-items: center;
        .movie {
          $scale: 1.64;
          $width: 360px;
          width: $width;
          height: ($width / $scale);
          margin-left: ($width / -2 - 22);
        }
        .summary-word {
          margin: 30px 0 0;
          margin-left: 34px;
          &-time {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>


