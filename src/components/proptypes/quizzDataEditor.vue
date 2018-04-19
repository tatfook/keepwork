<template>
  <el-dialog title="Quiz" :visible.sync="isDialogShow" width="800px" :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="Type:" prop="type">
        <el-radio-group v-model="ruleForm.type">
          <el-radio label="0">Single Choices</el-radio>
          <el-radio label="1">Mutiple Choices</el-radio>
          <el-radio label="2">True or False</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Question:" prop="title">
        <el-input v-model="ruleForm.title" placeholder="Please Input..."></el-input>
      </el-form-item>

      <!-- 单选题 -->
      <el-form-item label="Answer options:" prop="single" v-if="ruleForm.type == 0">
        <div><el-tag type="warning">The selected is the right answer.</el-tag></div>

        <el-radio-group :style="{width: '100%'}" v-model="ruleForm.single">
          <div class="flex-center-between" v-for="(opt, index) in ruleForm.singleOptions">
            <el-radio :label="serialNo[index]"></el-radio>
            <el-input v-model="opt.item" placeholder="Please Input..."></el-input>
            <el-button type="danger" @click.prevent="removeOption(opt, ruleForm.type)" icon="el-icon-delete" circle></el-button>
          </div>
          <el-button type="primary" round size="small" @click="addOption(ruleForm.type)">Add More Options</el-button>
        </el-radio-group>

      </el-form-item>

      <!-- 多选题 -->
      <el-form-item label="Answer options:" prop="mutiple" v-if="ruleForm.type == 1">
        <div><el-tag type="warning">The selected is the right answer.</el-tag></div>


        <el-checkbox-group :style="{width: '100%'}" v-model="ruleForm.mutiple">

          <div class="flex-center-between" v-for="(opt, index) in ruleForm.mutipleOptions">
            <el-checkbox name="option" :label="serialNo[index]"></el-checkbox>
            <el-input v-model="opt.item" placeholder="Please Input..."></el-input>
            <el-button type="danger" @click.prevent="removeOption(opt, ruleForm.type)" icon="el-icon-delete" circle></el-button>
          </div>
          <el-button type="primary" round size="small" @click="addOption(ruleForm.type)">Add More Options</el-button>
        </el-checkbox-group>

      </el-form-item>


      <!-- 判断题 -->
      <el-form-item label="Answer options:" prop="judge" v-if="ruleForm.type == 2">
        <div><el-tag type="warning">The selected is the right answer.</el-tag></div>

        <el-radio-group v-model="ruleForm.judge">
            <el-radio label="A True"></el-radio>
            <el-radio label="B False"></el-radio>
        </el-radio-group>

      </el-form-item>

      <el-form-item label="Score:" prop="score">
        <el-input v-model="ruleForm.score" placeholder="Please Input..." :style="{ width: '20%'}"></el-input>
      </el-form-item>

      <el-form-item label="Explanation:" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc" placeholder="Please Input..."></el-input>
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm', ruleForm.type)">submit</el-button>
      <el-button @click="handleClose">cancel</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'quizzDataEditor',
  props: {
    isEditorShow: Boolean,
  },

  data() {
    return {
      quizzData: [],

      serialNo: ['A', 'B', 'C', 'D', 'E', "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],

      ruleForm: {
        type: '0',
        title: '',
        single: '',
        mutiple: [],
        judge: '',
        singleOptions: [{
          item: ''
        }],
        mutipleOptions: [{
          item: ''
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
        mutiple: [
          { type: 'array', required: true, message: 'please select', trigger: 'change'}
        ],
        judge: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        score: [
          { required: true, message: 'please input score', trigger: 'blur'}
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
    handleClose() {
      this.$emit('cancel', null)
    },
    removeOption(item, type) {  // 移除选项
      // 多选
      if(type == 1) {
        var index = this.ruleForm.mutipleOptions.indexOf(item)
        if (index !== -1) {
          this.ruleForm.mutipleOptions.splice(index, 1)
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
        this.ruleForm.mutipleOptions.push({
          item: ''
        });
      }else{ // 单选
        this.ruleForm.singleOptions.push({
          item: ''
        });
      }

    },
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let writerQA = {
            type: this.ruleForm.type,
            title: this.ruleForm.title,
            score: this.ruleForm.score,
            desc: this.ruleForm.desc,
          }

          if(type == 0) { //单选
            writerQA.options = this.ruleForm.singleOptions;
            writerQA.answer = this.ruleForm.single;
          }else if(type == 1) { // 多选
             writerQA.options = this.ruleForm.mutipleOptions;
             writerQA.answer = this.ruleForm.mutiple;
          }else {  // 判断题
             writerQA.answer = this.ruleForm.judge;
          }

          this.quizzData.push(writerQA);
          this.handleClose();
          this.$emit('finishEditing', this.quizzData);
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
</style>

