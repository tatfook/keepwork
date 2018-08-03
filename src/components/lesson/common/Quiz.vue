<template>
  <div class="quiz-container" :class="{'error': isError}">
    <div class="quiz-no">
      <i class="el-icon-edit-outline"></i>
      问题
    </div>
    <div class="question">{{ question }}</div>

    <el-radio-group class="quiz" v-if="isSingleChoice" v-model="answer">
      <div class="quiz-option" v-for="(item, index) in options" :key="index">
        <el-radio :label="item.item">{{alphabet[index]}} {{item.item}}</el-radio>
      </div>
    </el-radio-group>

    <el-checkbox-group class="quiz" v-if="isMutipleChoice" v-model="mutipleAnswer">
      <div class="quiz-option" v-for="(item, index) in options" :key="index">
        <el-checkbox :label="item.item"></el-checkbox>
      </div>
    </el-checkbox-group>

    <el-radio-group class="quiz" v-if="isTFNG" v-model="answer">
      <div class="quiz-option" v-for="(item, index) in options" :key="index">
        <el-radio :label="item.item">{{item.item}}</el-radio>
      </div>
    </el-radio-group>

    <el-button class="quiz-submit" size="small" type="primary">提交</el-button>
  </div>
</template>


<script>
import _ from 'lodash'
export default {
  name: 'Quiz',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      answer: '',
      mutipleAnswer: [],
      isError: false
    }
  },
  mounted() {
    console.log(this.question)
  },
  methods: {},
  computed: {
    quizData() {
      return _.get(this.data, 'data.quiz.data[0]')
    },
    question() {
      return _.get(this.quizData, 'title')
    },
    options() {
      return _.get(this.quizData, 'options')
    },
    quizType() {
      // TODO: 应该要做到万一type错误的情况下要有提示
      return _.get(this.quizData, 'type', '0')
    },
    isSingleChoice() {
      return this.quizType === '0'
    },
    isMutipleChoice() {
      return this.quizType === '1'
    },
    isTFNG() {
      return this.quizType === '2'
    },
    isTextMatch() {
      return this.quizType === '3'
    },
    alphabet() {
      let start = 65
      return Array.from({ length: 26 }, () => String.fromCharCode(start++))
    }
  }
}
</script>

<style lang="scss">
.quiz-container {
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #fff;
  color: #4c4c4c;
  counter-reset: no;
  .quiz-no {
    font-weight: 600;
    i {
      color: #1982ff;
      font-size: 22px;
      font-weight: 600;
      padding-right: 12px;
      vertical-align: middle;
    }
  }
  $marginLeft: 40px;
  $marginTop: 20px;
  .question {
    margin-left: $marginLeft;
    margin-top: $marginTop;
    white-space: normal;
    word-wrap: break-word;
  }
  .quiz {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: 600;
    &-option {
      margin-top: $marginTop;
      font-size: 18px;
      margin-left: $marginLeft;
    }
  }
  .quiz-submit {
    margin-top: $marginTop;
    margin-left: $marginLeft;
  }
}

.el-radio__input.is-checked ~ .el-radio__label,
.el-checkbox__input.is-checked ~ .el-checkbox__label {
  font-weight: 600;
  color: black;
}

.error {
  margin-bottom: 20px;
  border: 1px solid #f53838;
  background: rgba(245, 56, 56, 0.05);
}
</style>

