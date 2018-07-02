<template>
  <el-dialog :title="this.$t('card.quiz')" :visible.sync="isDialogShow" width="800px" :before-close="handleClose">
    <el-form :model="quizData" :rules="rules" ref="quizData" label-width="128px" class="demo-ruleForm">
      <el-form-item :label="this.$t('card.type')" prop="type">
        <el-radio-group v-model="quizData.type" id="quizType">
          <el-radio label="0">{{this.$t('card.singleChoice')}}</el-radio>
          <el-radio label="1">{{this.$t('card.multipleChoices')}}</el-radio>
          <el-radio label="2">{{this.$t('card.trueOrFalse')}}</el-radio>
          <el-radio label="3">{{this.$t('card.textMatch')}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="this.$t('card.question')" prop="title">
        <el-input v-model="quizData.title" maxlength="255" :placeholder="$t('card.pleaseInput')"></el-input>
      </el-form-item>
      <!-- 单选题 -->
      <el-form-item :label="this.$t('card.answerOptions')" v-if="quizData.type == 0">
        <div><el-tag type="warning">{{this.$t('card.rightAnswer')}}</el-tag></div>
        <el-radio-group :style="{width: '100%'}" v-model="quizData.answer[0]">
          <div class="flex-center-between" v-for="(opt, index) in quizData.options" :key="index">
            <el-radio :label="serialNo[index]"></el-radio>
            <el-input v-model="opt.item" class="writer-input" :placeholder="$t('card.pleaseInput')"></el-input>
            <el-button type="danger" @click.prevent="removeOption(opt, quizData.type)" icon="el-icon-delete" circle></el-button>
          </div>
          <el-button type="primary" round size="small" @click="addOption(quizData.type)">{{this.$t('card.addMoreOptions')}}</el-button>
        </el-radio-group>

      </el-form-item>

      <!-- 多选题 -->
      <el-form-item :label="this.$t('card.answerOptions')" v-if="quizData.type == 1" >
        <div><el-tag type="warning">{{this.$t('card.rightAnswer')}}</el-tag></div>

        <el-checkbox-group :style="{width: '100%'}" v-model="quizData.answer">
          <div class="flex-center-between"
            v-for="(opt, index) in quizData.options" :key="index">
            <el-checkbox name="option" :label="serialNo[index]"></el-checkbox>
            <el-input v-model="opt.item" class="writer-input" :placeholder="$t('card.pleaseInput')"></el-input>
            <el-button type="danger" @click.prevent="removeOption(opt, quizData.type)" icon="el-icon-delete" circle></el-button>
          </div>
          <el-button type="primary" round size="small" @click="addOption(quizData.type)">{{this.$t('card.addMoreOptions')}}</el-button>
        </el-checkbox-group>

      </el-form-item>

      <!-- 判断题 -->
      <el-form-item :label="this.$t('card.answerOptions')" v-if="quizData.type == 2">
        <div><el-tag type="warning">{{this.$t('card.rightAnswer')}}</el-tag></div>

        <el-radio-group v-model="quizData.answer[0]">
          <span class="el-radio" v-for="(opt, index) in judgeOptions" :key="index">
            <el-radio :label="serialNo[index]">{{opt.item}}</el-radio>
          </span>
        </el-radio-group>

      </el-form-item>

      <!-- 文本匹配题 -->
      <el-form-item :label="this.$t('card.answer')" v-if="quizData.type == 3">
        <div class="flex-center-between" v-for="(opt, index) in quizData.options" :key="index">
          <el-input type="textarea" v-model="opt.item" class="writer-input" :placeholder="$t('card.pleaseInput')"></el-input>
          <el-button type="danger" @click.prevent="removeOption(opt, quizData.type)" icon="el-icon-delete" circle></el-button>
        </div>
        <el-button type="primary" round size="small" @click="addOption(quizData.type)">{{this.$t('card.addMore')}}</el-button>
      </el-form-item>

      <el-form-item :label="this.$t('card.score')" prop="score">
        <el-input v-model.number="quizData.score" :placeholder="$t('card.pleaseInput')" :style="{ width: '20%'}"></el-input>
      </el-form-item>

      <el-form-item :label="this.$t('card.explanation')" prop="desc">
        <el-input type="textarea" maxlength="512" v-model="quizData.desc" :placeholder="$t('card.pleaseInput')"></el-input>
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @change="validInput" @click="submitForm('quizData', quizData.type)">{{this.$t('card.submit')}}</el-button>
      <el-button @click="handleClose">{{this.$t('card.cancel')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import uuid from 'uuid/v1'

const checkInputEmpty = () => {
  let opeInput = document.getElementsByClassName("writer-input")
    for(let i = 0; i < opeInput.length; i++) {
      let input = opeInput[i].children[0]
      if(input.value == undefined || input.value == "") {
          input.style.borderColor = "#f56c6c"
          return;
      }else{
          input.style.borderColor = "#67c23a"
      }
    }
}

export default {
  name: 'quizDataEditor',
  props: {
    isEditorShow: Boolean,
    originalQuizData: Array,
  },

  data() {
    const checkScore = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('card.integerThan0')))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error(this.$t('card.integerThan0')))
        } else {
          if (value < 0) {
            callback(new Error(this.$t('card.integerThan0')))
          } else {
            callback()
          }
        }
      }, 200)
    };

    return {
      // quizData: this.originalQuizData[0],

      serialNo: ['A', 'B', 'C', 'D', 'E', "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],

      judgeOptions: [{
        item: this.$t('card.true')
      },{
        item: this.$t('card.false')
      }],

      rules: {
        title: [
          { required: true, message: this.$t('card.pleaseInputTitle'), trigger: 'blur' }
        ],
        single: [
          { required: true, message: this.$t('card.pleaseSelect'), trigger: 'change'}
        ],
        singleInput: [
          { required: true, message: this.$t('card.pleaseInput'), trigger: 'blur' }
        ],
        multiple: [
          { type: 'array', required: true, message: this.$t('card.pleaseSelect'), trigger: 'change'}
        ],
        judge: [
          { required: true, message: this.$t('card.pleaseSelect'), trigger: 'change' }
        ],
        score: [
          { required: true, validator: checkScore, trigger: 'blur' }
        ],
        desc: [
          { required: true, message: this.$t('card.pleaseInputExplanation'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    quizData() {
      return this.originalQuizData[0]
    },
    isDialogShow() {
      return this.isEditorShow
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel', null)
    },
    removeOption(item, type) {  // 移除选项
      // 多选
      if(type == 1) {
        var index = this.quizData.options.indexOf(item)
        if (index !== -1) {
          this.quizData.options.splice(index, 1)
        }
      }else{ // 单选
        var index = this.quizData.options.indexOf(item)
        if (index !== -1) {
          this.quizData.options.splice(index, 1)
        }
      }
    },
    addOption(type) {  // 添加选项
      // 多选
      if(type == 1) {
        this.quizData.options.push({
          item: ''
        })
      }else{ // 单选
        this.quizData.options.push({
          item: ''
        })
      }
    },

    validInput () {
      checkInputEmpty()
    },

    submitForm(formName, type) {
      checkInputEmpty()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.quizData.id === 0 ? this.quizData.id = uuid() : this.quizData.id
          type == 2 ?  this.quizData.options = this.judgeOptions : this.quizData.options // 判断
          if( (type == 0 || type == 2) && this.quizData.answer ) {
            let singleAns =  this.quizData.answer[0]
            this.quizData.answer = [singleAns]
          } else if(type == 1) {
            // 多选
            JSON.stringify([this.quizData.answer].sort())
          }
          this.handleClose();
          this.$emit('finishEditing', [this.quizData])
        } else {
          return false
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scope>
  .flex-center-between{
    width: 100%;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .flex-center-between .el-input {
      margin: 0 20px;
  }

  .el-form-item .writer-input .el-input__inner {
    border-color: #dcdfe6;
  }
</style>

