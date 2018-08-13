<template>
  <div class="lesson-summary-share-wrap" :class="`style-${styleIndex}`">
    <div class="lesson-summary-share" :class="`style-${styleIndex}`">
      <div class="left">
        <div class="shadow"></div>
      </div>
      <div class="main">
        <div class="movie"></div>
        <div class="summary-word">
          <div class="summary-word-time">{{time}}</div>
          <div class="summary-word-link">{{link}}</div>
          <div class="summary-word-line">{{line1}}</div>
          <div class="summary-word-line">{{line2}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    }
  },
  data() {
    return {
      time: 'Today is 20th Apr. 2018.',
      link:
        'I am learning computer science on Keepwork. Click here to join and learn with me',
      line1: 'This is my 1st day of learning computer science on Keepwork.',
      line2:
        'Today, I read 20 lines of code, wrote 5 lines of code, and learned 1 computer command.'
    }
  },
  mounted() {}
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
  min-width: 1080px;
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
    max-width: 1150px;
    min-width: 720px;
    min-height: 720px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
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
      $mainHeight: 460px;
      display: flex;
      max-width: 100%;
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


