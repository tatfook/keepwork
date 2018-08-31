<template>
  <span @mouseover="showTips" @mouseout="closeTips" @click="handleClick" class="jewel-box" :class="{ opened: isClicked }">
    <div v-show="isShowTips" @click.stop class="tips-wrap">
      <span class="tips">
        To get the coins, you must meet the following three conditions:
        1. The learning time of this lesson should be no less than 5 minutes. Have learned 00：20
        2. Answers for all quizzes should be correct.
        3. Your locked coins should be no less than the coins that you will  get.  There are 100 locked coins in your account at present. </span>
    </div>
  </span>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'JewelBox',
  props: {
    data: Object
  },
  data() {
    return {
      isClicked: false,
      isShowTips: false,
      tips: `To get the coins, you must meet the following three conditions:
            1. The learning time of this lesson should be no less than 5 minutes. Have learned  00：20
            2. Answers for all quizzes should be correct.
            3. Your locked coins should be no less than the coins that you will  get.  There are 100 locked coins in your account at present. `
    }
  },
  mounted() {
  },
  methods: {
    handleClick() {
      this.isClicked = !this.isClicked
    },
    showTips() {
      this.isShowTips = true
    },
    closeTips() {
      this.isShowTips = false
    }
  }
}
</script>

<style lang="scss">
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.jewel-box {
  display: inline-block;
  height: 38px;
  width: 49px;
  cursor: pointer;
  background: url('../../../assets/lessonImg/jewelbox.png') no-repeat center
    #fff;
  &.opened {
    background: url('../../../assets/lessonImg/jewelbox2.png') no-repeat center
      #fff;
  }
  .tips-wrap {
    $shadow: 1px 10px 40px rgb(170, 170, 170);
    display: block;
    position: absolute;
    animation: fade-in;
    animation-duration: 0.5s;
    top: 110px;
    left: -26px;
    z-index: 998;
    min-height: 60px;
    width: 800px;
    background: white;
    border: #cacaca;
    box-shadow: $shadow;
    .tips {
      z-index: 34;
      padding: 40px;
      font-size: 16px;
      display: inline-block;
      background-color: #fff;
      white-space: pre-line;
      word-wrap: break-word;
    }
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      top: -14px;
      left: 60px;
      z-index: -1;
      transform: rotate(45deg);
      height: 40px;
      width: 40px;
      background: white;
      box-shadow: $shadow;
    }
  }
}
</style>


