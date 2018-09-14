<template>
  <div class="lesson-summary-share-wrap" :class="[isPreview ? `style-${styleIndex}`: `style-${style}`, {'small': isSmall}]">
    <div class="lesson-summary-share" :class="[isPreview ? `style-${styleIndex}`: `style-${style}`, {'small': isSmall}]">
      <div class="left">
      </div>
      <div class="main">
        <div class="movie">
          <video controls="" width="100%" autoplay="" name="media">
            <source :src="summary.videoUrl" type="video/mp4">
          </video>
        </div>
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
            这是我第<span class="highlight">{{summary.day}}</span> 天在keepwork学习<span class="highlight">{{summary.name}}</span>
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
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <video controls="" width="100%" autoplay="" name="media">
        <source :src="summary.videoUrl" type="video/mp4">
      </video>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { locale } from '@/lib/utils/i18n'
import moment from 'moment'
import 'moment/locale/zh-cn'
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
      summary: {},
      dialogVisible: false
    }
  },
  beforeMount() {
    if (this.isPreview) {
      this.summary = _.merge(this.summary, this.lessonSummary)
    } else {
      this.style = Number(this.$route.params.styleId) || 1
      this.$set(this.summary, _.merge(this.summary, this.$route.query))
    }
  },
  computed: {
    today() {
      this.isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment().format('LL')
    },
    isEn() {
      return locale === 'en-US'
    }
  },
  methods: {
    toAboutPage() {
      this.$router.push({ path: '/student/about' })
    },
    playVideo() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss">
$timeSize: 30px;
$lineSize: 20px;
$mainHeight: 430px;
.lesson-summary-share-wrap {
  display: flex;
  padding: 30px;
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
  .lesson-summary-share {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: white;
    width: 678px;
    .main {
      height: $mainHeight;
      .movie {
        $scale: 1.64;
        $width: 230px;
        height: 140px;
        width: 230px;
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
        color: black;
        padding: 0 15px 0 30px;
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
          margin: 10px 0;
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
      $padding: 10px;
      padding: $padding;
      position: relative;
      .left {
        position: absolute;
        z-index: 998;
        left: -12px;
        height: 475px;
        width: 180px;
        background: url('../../../assets/lessonImg/share_shadow.png') no-repeat;
        background-size: 100% 100%;
        img {
          height: 100%;
          object-fit: contain;
        }
      }
      .main {
        height: 410px;
        width: 100%;
        background: white;
        position: relative;
        .movie {
          background: grey;
          position: relative;
          left: 88px;
          top: 24px;
          border-radius: 5px;
          border: 8px solid #e8f3ff;
          box-sizing: border-box;
          z-index: 998;
        }
        .summary-word {
          margin-left: 88px;
        }
      }
    }

    &.style-2 {
      .left {
        display: none;
      }
      .main {
        background: white;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        .summary-word {
          &-time {
            color: #409efe;
            font-size: 26px;
            text-align: center;
            font-weight: 600;
          }
          &-link {
            margin-top: 10px;
          }
        }
      }
    }

    &.style-3 {
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
        height: $mainHeight;
        background: white;
        display: flex;
        align-items: center;
        .movie {
          width: 250px;
          height: 140px;
          margin-left: -200px;
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


