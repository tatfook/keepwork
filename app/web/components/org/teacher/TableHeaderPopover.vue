<template>
  <el-tooltip :hide-after="0" popper-class="table-header-pop">
    <div class="content" slot="content">
      <div>{{$t('lesson.quiz')}}{{index}}</div>
      <div class="pop-title">{{title}}</div>
      <div v-for="(item,index) in options" :class="['pop-answer',{'is-right-answer': item.isRightAnswer}]" :key="index">
        {{alphabet[index]}} : {{item.item}}
      </div>
      <div class="pop-desc">{{$t('card.explanation')}} {{desc}}</div>
    </div>
    <span>{{$t('lesson.quiz')}}{{index}}</span>
  </el-tooltip>
</template>

<script>
export default {
  name: 'TableHeaderPopover',
  data() {
    return {}
  },
  props: {
    index: Number,
    quiz: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    type() {
      return this.quiz.type
    },
    title() {
      return this.quiz.title
    },
    options() {
      return this.type === '3'
        ? this.quiz.options
        : this.quiz.options.map(({ item }, index) => {
            let isRightAnswer = this.answerIndex.indexOf(index) !== -1
            return this.type === '2'
              ? { item: this.$t(`card.${item}`), isRightAnswer }
              : { item, isRightAnswer }
          })
    },
    desc() {
      return this.quiz.desc
    },
    answer() {
      return this.quiz.answer
    },
    answerIndex() {
      // 答案是字符串'A'，转换成下标0
      return Array.isArray(this.answer)
        ? this.answer.map(item => this.alphabet.indexOf(item))
        : this.answer
    },
    alphabet() {
      return Array.from({ length: 26 }, (i, index) =>
        String.fromCharCode(65 + index)
      )
    }
  }
}
</script>

<style lang="scss">
$green: #27c12f;
.table-header-pop {
  font-size: 14px;
  padding: 20px;
  min-width: 200px;
  max-width: 500px;
  .pop-title {
    margin-top: 10px;
  }
  .pop-answer {
    margin-top: 10px;
    &.is-right-answer {
      color: $green;
    }
  }
  .pop-desc {
    margin-top: 10px;
  }
}
</style>


