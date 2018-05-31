<template>
  <el-dialog title="Lessons" :visible.sync="isDialogShow" width="800px" :before-close="handleClose">
    <el-form :model="lessonsData" :rules="rules" ref="lessonsData" label-width="128px" class="demo-ruleForm">
      <!-- 课程包名称 -->
      <el-form-item label="LessonsTitle:" prop="title">
        <el-input v-model="lessonsData.title" maxlength="255" placeholder="Please Input..."></el-input>
      </el-form-item>
      <!-- 课程包封面图的URL地址 -->
      <el-form-item label="CoverImage(URL)" prop="coverImage">
        <el-input v-model="lessonsData.coverImage" maxlength="512" placeholder="Please Input..."></el-input>
      </el-form-item>
      <!-- 课程包技能点 -->
      <el-form-item label="Skills:" prop="skills">
        <el-input type="textarea" maxlength="512" v-model="lessonsData.skills" placeholder="Please Input..."></el-input>
      </el-form-item>
      <!-- 课程包的适用年龄段 -->
      <el-form-item label="Ages:" prop="ages">
        <el-row>
          <el-col :span="10">
            <el-radio-group v-model="ages">
              <el-radio label="0">Suitable for all</el-radio>
              <el-radio label="1">Self-define</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="14">
            <el-row :gutter="20">
              <el-form-item v-if="ages == 1">
                <!-- 自定义年龄最小值 -->
                <el-col :span="12">
                  <el-form-item prop="agesMin">
                    <el-input  v-model.number="lessonsData.agesMin" placeholder="Please Input..." min="1"></el-input>
                  </el-form-item>
                </el-col>
                <!-- 自定义年龄最大值 -->
                <el-col :span="12">
                  <el-form-item prop="agesMax">
                    <el-input v-model.number="lessonsData.agesMax" placeholder="Please Input..." :min=" lessonsData.agesMin + 1"></el-input>
                  </el-form-item>  
                </el-col>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @change="validInput" @click="submitForm('lessonsData')">submit</el-button>
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
  name: 'lessonsDataEditor',
  props: {
    isEditorShow: Boolean,
    originalLessonsData: Object,
  },

  data() {
    const checkScore = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('please input an integer greater than 0'));
      }
      //如果是年龄的最大值 那么他的最小值就应该是年龄最小值加1
      if(rule.field == 'agesMax'){
        const agesmin = parseInt(this.originalLessonsData.agesMin);
        if(value <= agesmin){
            callback(new Error('please input an integer greater than agesmin'));
        }
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('please input an integer greater than 0'));
        } else {
          if(value < 0){
            callback(new Error('please input an positive integer'));
          }else{
             callback();
          }
        }
      }, 200);
    };

    return {
      // 表单规则
      rules: {
        title: [
          { required: true, message: 'please input title', trigger: 'blur' }
        ],
        score: [
          { required: true, validator: checkScore, trigger: 'blur' }
        ],
        coverImage: [
          { required: true, message: 'please input coverImage(url)', trigger: 'blur' }
        ],
        skills: [
          { required: true, message: 'please input skills', trigger: 'blur' }
        ],
        agesMin: [
          { validator: checkScore, trigger: 'blur', type: 'number' }
        ],
        agesMax: [
          { validator: checkScore, trigger: 'blur', type: 'number'}
        ]
      },
      //年龄段默认值
      ages: '0'

    }
  },
  computed: {
    lessonsData() {
      return this.originalLessonsData
    },
    isDialogShow() {
      return this.isEditorShow
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel', null)
    },
    validInput () {
      checkInputEmpty();
    },

    submitForm(formName) {
      checkInputEmpty();
      this.$refs[formName].validate((valid) => {
        // if (valid) {
        // } else {
        //   console.log('error submit!!');
        //   return false;
        // }
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

