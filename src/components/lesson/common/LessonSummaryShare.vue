<template>
    <div class="lesson-summary-share style-1">
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
</template>

<script>
export default {
  name: 'LessonSummaryShare',
  props: {
    isPreview: {
      type: Boolean,
      default: false
    },
    style: {
      type: Number,
      default: 0
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
.lesson-summary-share {
  max-width: 1080px;
  margin: 0 auto;
  position: relative;
  &.style-1 {
    background: #409efe;
    padding: 26px;
    position: relative;
    .left {
      position: absolute;
      z-index: 998;
      height: 350px;
      top: 16px;
      width: 120px;
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
      height: 330px;
      width: 100%;
      background: white;
      position: relative;
      .movie {
        height: 140px;
        width: 240px;
        background: grey;
        position: relative;
        left: 65px;
        top: 24px;
        border-radius: 5px;
        border: 8px solid #e8f3ff;
        box-sizing: border-box;
        z-index: 998;
      }

      .summary-word {
        margin-top: 60px;
        margin-left: 96px;
        font-size: 12px;
        &-time {
          color: black;
          font-size: 16px;
          font-weight: 600;
        }
        &-link {
          color: #111111;
          margin-top: 10px;
          margin-bottom: 20px;
        }
        &-line {
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
  }
}
</style>


