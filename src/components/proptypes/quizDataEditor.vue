<template>
  <el-dialog title="Quiz" :visible.sync="isDialogShow" width="800px" :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px" class="demo-ruleForm">
      <el-form-item label="Type:" prop="type">
        <el-radio-group v-model="ruleForm.type">
          <el-radio label="0">Single Choice</el-radio>
          <el-radio label="1">Multiple Choices</el-radio>
          <el-radio label="2">True or False</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Question:" prop="title">
        <el-input v-model="ruleForm.title" maxlength="255" placeholder="Please Input..."></el-input>
      </el-form-item>

      <!-- 单选题 -->
      <el-form-item label="Answer options:" prop="single" v-if="ruleForm.type == 0">
        <div><el-tag type="warning">The selected is the right answer.</el-tag></div>

        <el-radio-group :style="{width: '100%'}" v-model="ruleForm.single">
          <div class="flex-center-between" v-for="(opt, index) in ruleForm.singleOptions">
            <el-radio :label="serialNo[index]"></el-radio>
            <el-input v-model="opt.item" class="writer-input" placeholder="Please Input..."></el-input>
            <el-button type="danger" @click.prevent="removeOption(opt, ruleForm.type)" icon="el-icon-delete" circle></el-button>
          </div>
          <el-button type="primary" round size="small" @click="addOption(ruleForm.type)">Add More Options</el-button>
        </el-radio-group>

      </el-form-item>

      <!-- 多选题 -->
      <el-form-item label="Answer options:" prop="multiple" v-if="ruleForm.type == 1" >
        <div><el-tag type="warning">The selected is the right answer.</el-tag></div>

        <el-checkbox-group :style="{width: '100%'}" v-model="ruleForm.multiple">
          <div class="flex-center-between"
            v-for="(opt, index) in ruleForm.multipleOptions">
            <el-checkbox name="option" :label="serialNo[index]"></el-checkbox>
            <el-input v-model="opt.item" class="writer-input" placeholder="Please Input..."></el-input>
            <el-button type="danger" @click.prevent="removeOption(opt, ruleForm.type)" icon="el-icon-delete" circle></el-button>
          </div>
          <el-button type="primary" round size="small" @click="addOption(ruleForm.type)">Add More Options</el-button>
        </el-checkbox-group>

      </el-form-item>


      <!-- 判断题 -->
      <el-form-item label="Answer options:" prop="judge" v-if="ruleForm.type == 2">
        <div><el-tag type="warning">The selected is the right answer.</el-tag></div>

        <el-radio-group v-model="ruleForm.judge">
          <span class="el-radio" v-for="(opt, index) in ruleForm.judgeOptions">
            <el-radio :label="serialNo[index]">{{opt.item}}</el-radio>
          </span>
        </el-radio-group>

      </el-form-item>

      <el-form-item label="Score:" prop="score">
        <el-input v-model.number="ruleForm.score" placeholder="Please Input..." :style="{ width: '20%'}"></el-input>
      </el-form-item>

      <el-form-item label="Explanation:" prop="desc">
        <el-input type="textarea" maxlength="512" v-model="ruleForm.desc" placeholder="Please Input..."></el-input>
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm', ruleForm.type)">submit</el-button>
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

export default {
  name: 'quizDataEditor',
  props: {
    isEditorShow: Boolean
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
      quizData: [],

      serialNo: ['A', 'B', 'C', 'D', 'E', "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],

      ruleForm: {
        type: '0',
        title: '',
        single: '',
        multiple: [],
        judge: '',
        singleOptions: [{
          item: ''
        },
        {
          item: ''
        },
        {
          item: ''
        },
        {
          item: ''
        }],
        multipleOptions: [{
          item: ''
        },
        {
          item: ''
        },
        {
          item: ''
        },
        {
          item: ''
        }],
        judgeOptions: [{
          item: 'True'
        },{
          item: 'False'
        }],
        score: '',
        desc: '',
      },
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
    isDialogShow() {
      return this.isEditorShow
    }
  },
  methods: {
    addDomain() {
        this.ruleForm.singleOptions.push({
          value: '',
          key: Date.now()
        });
      },
    handleClose() {
      this.$emit('cancel', null)
    },
    removeOption(item, type) {  // 移除选项
      // 多选
      if(type == 1) {
        var index = this.ruleForm.multipleOptions.indexOf(item)
        if (index !== -1) {
          this.ruleForm.multipleOptions.splice(index, 1)
        }
      }else{ // 单选
        var index = this.ruleForm.singleOptions.indexOf(item)
        if (index !== -1) {
          this.ruleForm.singleOptions.splice(index, 1)
        }
      }
    },
    addOption(type) {  // 添加选项
      // 多选
      if(type == 1) {
        this.ruleForm.multipleOptions.push({
          item: ''
        });
      }else{ // 单选
        this.ruleForm.singleOptions.push({
          item: ''
        });
      }

    },

    submitForm(formName, type) {
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

      this.$refs[formName].validate((valid) => {
        if (valid) {
          let writerQA = {
            id: uuid(8, 16),
            type: this.ruleForm.type,
            title: this.ruleForm.title,
            score: this.ruleForm.score,
            desc: this.ruleForm.desc,
          }

          if(type == 0) { //单选
            writerQA.options = this.ruleForm.singleOptions;
            writerQA.answer = this.ruleForm.single;
          }else if(type == 1) { // 多选
             writerQA.options = this.ruleForm.multipleOptions;
             writerQA.answer = JSON.stringify(this.ruleForm.multiple.sort());
          }else {  // 判断题
             writerQA.options = this.ruleForm.judgeOptions;
             writerQA.answer = this.ruleForm.judge;
          }

          this.quizData = [writerQA];
          this.handleClose();
          this.$emit('finishEditing', this.quizData);
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
    border-color: rgb(245, 108, 108);
  }
</style>

