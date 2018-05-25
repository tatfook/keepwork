<template>
  <el-dialog title="Quiz" :visible.sync="isDialogShow" width="800px" :before-close="handleClose">
    <el-form :model="quizData" :rules="rules" ref="quizData" label-width="128px" class="demo-ruleForm">
      <el-form-item label="Type:" prop="type">
        <el-radio-group v-model="quizData.type" id="quizType">
          <el-radio label="0">Single Choice</el-radio>
          <el-radio label="1">Multiple Choices</el-radio>
          <el-radio label="2">True or False</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Question:" prop="title">
        <el-input v-model="quizData.title" maxlength="255" placeholder="Please Input..."></el-input>
      </el-form-item>
      #aaaaaaaaaaaaaaaaaaaaaaa{{quizData}}<br>
      #bbbbbbbbbbbbbbbbbbbbbbb{{originalQuizData}}
      <!-- 单选题 -->
      <el-form-item label="Answer options:" v-if="quizData.type == 0">
        <div><el-tag type="warning">The selected is the right answer.</el-tag></div>
        <el-radio-group :style="{width: '100%'}" v-model="quizData.answer[0]">
          <div class="flex-center-between" v-for="(opt, index) in quizData.options">
            <el-radio :label="serialNo[index]"></el-radio>
            <el-input v-model="opt.item" class="writer-input" placeholder="Please Input..."></el-input>
            <el-button type="danger" @click.prevent="removeOption(opt, quizData.type)" icon="el-icon-delete" circle></el-button>
          </div>
          <el-button type="primary" round size="small" @click="addOption(quizData.type)">Add More Options</el-button>
        </el-radio-group>

      </el-form-item>

      <!-- 多选题 -->
      <el-form-item label="Answer options:" v-if="quizData.type == 1" >
        <div><el-tag type="warning">The selected is the right answer.</el-tag></div>

        <el-checkbox-group :style="{width: '100%'}" v-model="quizData.answer">
          <div class="flex-center-between"
            v-for="(opt, index) in quizData.options">
            <el-checkbox name="option" :label="serialNo[index]"></el-checkbox>
            <el-input v-model="opt.item" class="writer-input" placeholder="Please Input..."></el-input>
            <el-button type="danger" @click.prevent="removeOption(opt, quizData.type)" icon="el-icon-delete" circle></el-button>
          </div>
          <el-button type="primary" round size="small" @click="addOption(quizData.type)">Add More Options</el-button>
        </el-checkbox-group>

      </el-form-item>

      <!-- 判断题 -->
      <el-form-item label="Answer options:" v-if="quizData.type == 2">
        <div><el-tag type="warning">The selected is the right answer.</el-tag></div>

        <el-radio-group v-model="quizData.answer[0]">
          <span class="el-radio" v-for="(opt, index) in judgeOptions">
            <el-radio :label="serialNo[index]">{{opt.item}}</el-radio>
          </span>
        </el-radio-group>

      </el-form-item>

      <el-form-item label="Score:" prop="score">
        <el-input v-model.number="quizData.score" placeholder="Please Input..." :style="{ width: '20%'}"></el-input>
      </el-form-item>

      <el-form-item label="Explanation:" prop="desc">
        <el-input type="textarea" maxlength="512" v-model="quizData.desc" placeholder="Please Input..."></el-input>
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @change="validInput" @click="submitForm('quizData', quizData.type)">submit</el-button>
      <el-button @click="handleClose">cancel</el-button>
    </span>
  </el-dialog>
</template>
<script>

/* GUID 算法
  len: 指定长度
  radix: 基数
*/
function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

const checkInputEmpty = () => {
  let opeInput = document.getElementsByClassName("writer-input");
    for(let i = 0; i < opeInput.length; i++) {
      let input = opeInput[i].children[0];
      if(input.value == undefined || input.value == "") {
          input.style.borderColor = "#f56c6c";
          return;
      }else{
          input.style.borderColor = "#67c23a";
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
        return callback(new Error('please input an integer greater than 0'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('please input an integer greater than 0'));
        } else {
          if (value < 0) {
            callback(new Error('please input an integer greater than 0'));
          } else {
            callback();
          }
        }
      }, 200);
    };

    return {
      // quizData: this.originalQuizData[0],

      serialNo: ['A', 'B', 'C', 'D', 'E', "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],

      judgeOptions: [{
        item: 'True'
      },{
        item: 'False'
      }],

      rules: {
        title: [
          { required: true, message: 'please input title', trigger: 'blur' }
        ],
        single: [
          { required: true, message: 'please select', trigger: 'change'}
        ],
        singleInput: [
          { required: true, message: 'please input', trigger: 'blur' }
        ],
        multiple: [
          { type: 'array', required: true, message: 'please select', trigger: 'change'}
        ],
        judge: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        score: [
          { required: true, validator: checkScore, trigger: 'blur' }
        ],
        desc: [
          { required: true, message: 'please input explanation', trigger: 'blur' }
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
        });
      }else{ // 单选
        this.quizData.options.push({
          item: ''
        });
      }
    },

    validInput () {
      checkInputEmpty();
    },

    submitForm(formName, type) {
      checkInputEmpty();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.quizData.id === 0 ? this.quizData.id = uuid(8, 16) : this.quizData.id;
          type == 2 ?  this.quizData.options = this.judgeOptions : this.quizData.options; // 判断
          if( (type == 0 || type == 2) && this.quizData.answer ) {
            let singleAns =  this.quizData.answer[0];
            this.quizData.answer = [singleAns];
          } else if(type == 1) {
            // 多选
            JSON.stringify([this.quizData.answer].sort())
          }
          this.handleClose();
          this.$emit('finishEditing', [this.quizData]);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
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

