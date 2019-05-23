<template>
  <el-dialog :title="this.$t('card.quiz')" :visible.sync="isDialogShow" width="800px" :before-close="handleClose">
    <el-form :model="cloneQuiz" :rules="rules" ref="quizData" label-width="128px" class="demo-ruleForm">
      <el-form-item :label="this.$t('card.type')" prop="type">
        <el-radio-group v-model="quizType" @change="handleQuizTypeChange" id="quizType">
          <el-radio label="0">{{this.$t('card.singleChoice')}}</el-radio>
          <el-radio label="1">{{this.$t('card.multipleChoices')}}</el-radio>
          <el-radio label="2">{{this.$t('card.trueOrFalse')}}</el-radio>
          <el-radio label="3">{{this.$t('card.textMatch')}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="this.$t('card.question')" prop="title">
        <el-input v-model="cloneQuiz.title" maxlength="255" :placeholder="$t('card.pleaseInput')"></el-input>
      </el-form-item>
      <!-- 单选题 -->
      <el-form-item :label="this.$t('card.answerOptions')" v-if="quizType == 0" :error="errMsg">
        <div>
          <el-tag type="warning">{{this.$t('card.rightAnswer')}} {{rightAnswer}}</el-tag>
        </div>
        <el-radio-group class="single-wrapper" :style="{width: '100%'}" v-model="singleAnswer">
          <!-- <div class="flex-center-between" v-for="(opt, index) in singleOptions" :key="index"> -->
          <el-radio class="flex-center-between-single" v-for="(opt, index) in singleOptions" :key="index" :label="serialNo[index]">
            <span>{{serialNo[index]}}</span>
            <el-input v-model="opt.item" class="writer-input" :placeholder="$t('card.pleaseInput')"></el-input>
            <el-button type="danger" @click.prevent="removeOption(opt, quizType)" icon="el-icon-delete" circle></el-button>
          </el-radio>
          <!-- </div> -->
          <el-button type="primary" round size="small" @click="addOption(quizType)">{{this.$t('card.addMoreOptions')}}</el-button>
        </el-radio-group>

      </el-form-item>

      <!-- 多选题 -->
      <el-form-item :label="this.$t('card.answerOptions')" v-if="quizType == 1" :error="errMsg">
        <div>
          <el-tag type="warning">{{this.$t('card.rightAnswer')}} {{rightAnswer}}</el-tag>
        </div>

        <el-checkbox-group :style="{width: '100%'}" v-model="multipleAnswer">
          <div class="flex-center-between" v-for="(opt, index) in multipleOptions" :key="index">
            <el-checkbox name="option" :label="serialNo[index]"></el-checkbox>
            <el-input v-model="opt.item" class="writer-input" :placeholder="$t('card.pleaseInput')"></el-input>
            <el-button type="danger" @click.prevent="removeOption(opt, quizType)" icon="el-icon-delete" circle></el-button>
          </div>
          <el-button type="primary" round size="small" @click="addOption(quizType)">{{this.$t('card.addMoreOptions')}}</el-button>
        </el-checkbox-group>

      </el-form-item>

      <!-- 判断题 -->
      <el-form-item :label="this.$t('card.answerOptions')" v-if="quizType == 2" :error="errMsg">
        <div>
          <el-tag type="warning">{{this.$t('card.rightAnswer')}} {{rightAnswer}}</el-tag>
        </div>

        <el-radio-group v-model="judgeAnswer">
          <span class="el-radio" v-for="(opt, index) in judgeOptions" :key="index">
            <el-radio :label="serialNo[index]">{{$t(`card.${opt.item}`)}}</el-radio>
          </span>
        </el-radio-group>

      </el-form-item>

      <!-- 文本匹配题 -->
      <el-form-item :label="this.$t('card.answer')" v-if="quizType == 3" :error="errMsg">
        <div class="flex-center-between" v-for="(opt, index) in textOptions" :key="index">
          <el-input type="textarea" v-model="opt.item" class="writer-input" :placeholder="$t('card.pleaseInput')"></el-input>
          <el-button type="danger" @click.prevent="removeOption(opt, quizType)" icon="el-icon-delete" circle></el-button>
        </div>
        <el-button type="primary" round size="small" @click="addOption(quizType)">{{this.$t('card.addMore')}}</el-button>
      </el-form-item>

      <el-form-item :label="this.$t('card.score')" prop="score">
        <el-input v-model.number="cloneQuiz.score" :placeholder="$t('card.pleaseInput')" :style="{ width: '20%'}"></el-input>
      </el-form-item>

      <el-form-item :label="this.$t('card.explanation')" prop="desc">
        <el-input type="textarea" maxlength="512" v-model="cloneQuiz.desc" :placeholder="$t('card.pleaseInput')"></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @change="validInput" @click="submitForm('quizData', quizType)">{{this.$t('card.submit')}}</el-button>
      <el-button @click="handleClose">{{this.$t('card.cancel')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import uuid from 'uuid/v1'
import _ from 'lodash'

const checkInputEmpty = () => {
  let opeInput = document.getElementsByClassName('writer-input')
  for (let i = 0; i < opeInput.length; i++) {
    let input = opeInput[i].children[0]
    if (input.value == undefined || input.value == '') {
      input.style.borderColor = '#f56c6c'
      return false
    } else {
      input.style.borderColor = '#67c23a'
    }
  }
  return true
}

const clearBorderColor = () => {
  let inputs = document.querySelectorAll('.writer-input')
  inputs.forEach(ele => {
    ele.children[0].style.borderColor = ''
  })
}

export default {
  name: 'quizDataEditor',
  props: {
    isEditorShow: Boolean,
    originalQuizData: Array
  },
  mounted() {
    this.initQuizData(this.quizData)
  },
  data() {
    const checkScore = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('card.integerThan0')))
      }
      if (!Number.isInteger(value)) {
        callback(new Error(this.$t('card.integerThan0')))
      } else {
        if (value < 0) {
          callback(new Error(this.$t('card.integerThan0')))
        } else {
          callback()
        }
      }
    }
    return {
      serialNo: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ],
      singleOptions: [],
      singleOptionsBak: [{ item: 'option 1' }, { item: 'option 2' }],
      multipleOptions: [
      ],
      multipleOptionsBak: [
         { item: 'option 1' },
        { item: 'option 2' },
        { item: 'option 3' }
      ],
      judgeOptions: [
      ],
      judgeOptionsBak: [
           {
          item: true
        },
        {
          item: false
        }
      ],
      textOptions: [],
      textOptionsBak: [{ item: 'text match' }],

      singleAnswer: '',
      multipleAnswer: [],
      judgeAnswer: '',
      textAnswer: '',

      errMsg: '',
      cloneQuiz: {},
      quizType: '0',

      rules: {
        title: [
          {
            required: true,
            message: this.$t('card.pleaseInputTitle'),
            trigger: 'blur'
          }
        ],
        single: [
          {
            required: true,
            message: this.$t('card.pleaseSelect'),
            trigger: 'change'
          }
        ],
        singleInput: [
          {
            required: true,
            message: this.$t('card.pleaseInput'),
            trigger: 'blur'
          }
        ],
        multiple: [
          {
            type: 'array',
            required: true,
            message: this.$t('card.pleaseSelect'),
            trigger: 'change'
          }
        ],
        judge: [
          {
            required: true,
            message: this.$t('card.pleaseSelect'),
            trigger: 'change'
          }
        ],
        score: [{ required: true, validator: checkScore, trigger: 'blur' }],
        desc: [
          {
            required: true,
            message: this.$t('card.pleaseInputExplanation'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    quizData() {
      return _.cloneDeep(this.originalQuizData[0])
    },
    rightAnswer() {
      switch (this.quizType) {
        case '0':
          return this.singleAnswer
        case '1':
          return this.multipleAnswer.length > 1
            ? this.multipleAnswer
                .sort((a, b) => a.charCodeAt() - b.charCodeAt())
                .join(' ')
            : ''
        case '2':
          return this.judgeAnswer
            ? this.judgeAnswer === 'A'
              ? this.$t('card.true')
              : this.$t('card.false')
            : ''
      }
    },
    isDialogShow() {
      return this.isEditorShow
    }
  },
  watch: {
    quizData(quiz) {
      this.initQuizData(quiz)
    }
  },
  methods: {
    handleQuizTypeChange(type) {
      this.errMsg = ''
    },
    initQuizData(quiz) {
      this.cloneQuiz = _.cloneDeep(quiz)
      this.singleOptions = _.cloneDeep(this.singleOptionsBak)
      this.multipleOptions = _.cloneDeep(this.multipleOptionsBak)
      this.judgeOptions = _.cloneDeep(this.judgeOptionsBak)
      this.textOptions = _.cloneDeep(this.textOptionsBak)
      this.singleAnswer = ''
      this.multipleAnswer = []
      this.judgeAnswer = ''

      const { type, options, answer } = this.cloneQuiz
      this.quizType = type

      if (type === '0') {
        this.singleAnswer = answer[0]
        this.singleOptions = options
        if (options.length === 1) {
          this.singleOptions.push({ item: 'option 2' })
        }
      }

      if (type === '1') {
        this.multipleOptions = options
        this.multipleAnswer = answer.length > 1 ? answer : []
      }

      if (type === '2') {
        this.judgeAnswer = answer[0]
      }

      if (type === '3') {
        this.textOptions = options
      }
    },
    handleClose() {
      clearBorderColor()
      this.errMsg = ''
      this.singleAnswer = ''
      this.multipleAnswer = []
      this.judgeAnswer = ''
      this.resetForm('quizData')
      this.$emit('cancel', null)
    },
    removeOption(item, type) {
      if (type == '0' && this.singleOptions.length <= 2) {
        return this.$message.error(this.$t('card.keepTwoOptions'))
      }

      if (type == '1' && this.multipleOptions.length <= 3) {
        return this.$message.error(this.$t('card.keepThreeOptions'))
      }

      if (type == '3' && this.textOptions.length <= 1) {
        return this.$message.error(this.$t('card.keepOneOption'))
      }
      switch (type) {
        case '0':
          return this.singleOptions.splice(this.singleOptions.indexOf(item), 1)
        case '1':
          return this.multipleOptions.splice(
            this.multipleOptions.indexOf(item),
            1
          )
        case '3':
          return this.textOptions.splice(this.textOptions.indexOf(item), 1)
      }
    },
    addOption(type) {
      switch (type) {
        case '0':
          return this.singleOptions.push({ item: '' })
        case '1':
          return this.multipleOptions.push({ item: '' })
        case '3':
          return this.textOptions.push({ item: '' })
      }
    },

    validInput() {
      checkInputEmpty()
    },

    checkAnswer(type) {
      if (type === '0' && !this.singleAnswer) {
        return { pass: false, msg: this.$t('card.pleaseSelectOne') }
      }

      if (type === '1' && this.multipleAnswer.length < 2) {
        return { pass: false, msg: this.$t('card.chooseTwoAnswer') }
      }

      if (type === '2' && !this.judgeAnswer) {
        return { pass: false, msg: this.$t('card.pleaseSelectOne') }
      }

      return { pass: true, msg: '' }
    },

    resetData() {
      this.singleAnswer = ''
      this.multipleAnswer = []
      this.judgeAnswer = ''
      this.errMsg = ''
    },

    submitForm(formName, type) {
      if (!checkInputEmpty()) {
        return (this.errMsg = this.$t('card.cantBeEmpty'))
      }
      let { pass, msg } = this.checkAnswer(type)
      if (!pass) {
        return (this.errMsg = msg)
      }
      this.errMsg = ''
      this.cloneQuiz.type = type
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.cloneQuiz.id = this.cloneQuiz.id || uuid()
        if (type === '0') {
          if (!this.singleOptions || this.singleOptions.length < 2) {
            return this.$message.error(this.$t('card.keepTwoOptions'))
          }
          this.cloneQuiz.answer = [this.singleAnswer]
          this.cloneQuiz.options = this.singleOptions
        }
        if (type === '1') {
          if (!this.multipleOptions || this.multipleOptions.length < 3) {
            return this.$message.error(this.$t('card.keepThreeOptions'))
          }
          this.cloneQuiz.answer = this.multipleAnswer
          this.cloneQuiz.options = this.multipleOptions
        }
        if (type === '2') {
          this.cloneQuiz.answer = [this.judgeAnswer]
          this.cloneQuiz.options = this.judgeOptions
        }
        if (type === '3') {
          this.cloneQuiz.answer = this.textOptions[0].item
          this.cloneQuiz.options = this.textOptions
        }
        let _quiz = _.cloneDeep(this.cloneQuiz)
        this.handleClose()
        this.$emit('finishEditing', [_quiz])
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scope>
.flex-center-between {
  width: 100%;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.single-wrapper {
  display: felx;
  flex-direction: column;
  margin-right: 50px;
}
.flex-center-between-single {
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.flex-center-between-single.el-radio {
  margin-left: 0;
}

.flex-center-between-single .el-input {
  margin: 0 18px;
}

.flex-center-between-single .el-radio__label {
  width: 80%;
}

.flex-center-between .el-input {
  margin: 0 20px;
}

.el-form-item .writer-input .el-input__inner {
  border-color: #dcdfe6;
}
</style>

