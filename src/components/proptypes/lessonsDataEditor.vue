<template>
<<<<<<< HEAD
  <el-dialog title="Lessons" :visible.sync="isDialogShow" width="800px" :before-close="handleClose">
=======
  <el-dialog title="Lessons" :visible.sync="isDialogShow" width="1000px" :before-close="handleClose" class="lessons">
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
    <el-form :model="lessonsData" :rules="rules" ref="lessonsData" label-width="128px" class="demo-ruleForm">
      <!-- 课程包名称 -->
      <el-form-item label="LessonsTitle:" prop="title">
        <el-input v-model="lessonsData.title" maxlength="255" placeholder="Please Input..."></el-input>
      </el-form-item>
      <!-- 课程包封面图的URL地址 -->
<<<<<<< HEAD
      <el-form-item label="CoverImage(URL)" prop="coverImage">
        <el-input v-model="lessonsData.coverImage" maxlength="512" placeholder="Please Input..."></el-input>
=======
      <el-form-item label="CoverImage(URL)" prop="cover">
        <el-input v-model="lessonsData.cover" maxlength="512" placeholder="Please Input..."></el-input>
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
      </el-form-item>
      <!-- 课程包技能点 -->
      <el-form-item label="Skills:" prop="skills">
        <el-input type="textarea" maxlength="512" v-model="lessonsData.skills" placeholder="Please Input..."></el-input>
      </el-form-item>
      <!-- 课程包的适用年龄段 -->
      <el-form-item label="Ages:" prop="ages">
        <el-row>
<<<<<<< HEAD
          <el-col :span="10">
            <el-radio-group v-model="ages">
=======
          <el-col :span="8">
            <el-radio-group v-model="ages" @change="changeAge">
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
              <el-radio label="0">Suitable for all</el-radio>
              <el-radio label="1">Self-define</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="14">
            <el-row :gutter="20">
              <el-form-item v-if="ages == 1">
                <!-- 自定义年龄最小值 -->
<<<<<<< HEAD
                <el-col :span="12">
=======
                <el-col :span="11">
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
                  <el-form-item prop="agesMin">
                    <el-input  v-model.number="lessonsData.agesMin" placeholder="Please Input..." min="1"></el-input>
                  </el-form-item>
                </el-col>
<<<<<<< HEAD
                <!-- 自定义年龄最大值 -->
                <el-col :span="12">
=======
                <el-col :span="2">-</el-col>
                <!-- 自定义年龄最大值 -->
                <el-col :span="11">
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
                  <el-form-item prop="agesMax">
                    <el-input v-model.number="lessonsData.agesMax" placeholder="Please Input..." :min=" lessonsData.agesMin + 1"></el-input>
                  </el-form-item>  
                </el-col>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
      </el-form-item>
<<<<<<< HEAD
=======
      <!-- 课程包金币花费和获得设置 -->
      <el-row>
        <el-col :span="10">
          <el-form-item label="Cost:">
            <el-row>
              <el-col :span="18">
                <el-input-number :min="0" v-model="lessonsData.cost"></el-input-number> 
              </el-col>
              <el-col :span="6">Coins</el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Reward:">
            <el-row>
              <el-col :span="18">
                <el-input-number :min="0" v-model="lessonsData.reward"></el-input-number>
              </el-col>
              <el-col :span="6">Coins</el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 选择课程包的课程 -->
      <div>{{lessonsSelect}}</div>
      <el-form-item label="Lessons:" class="lesson-list" v-bind:class="{'unempty': lessonsSelect.length == 0 }">
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="search lessons"
          v-model="lessonsSelect"       
          :titles="['Lessons', 'Select lessons']"
          :data="lessonsListData">
         <span slot-scope="{ option }" class="lessonsTitle">
          <span>{{ option.lessonTitle }}</span>
          <a class="lesson-link" v-bind:href="option.lessonUrl">{{ option.lessonUrl }}</a>
         </span>
        </el-transfer>
      </el-form-item>
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @change="validInput" @click="submitForm('lessonsData')">submit</el-button>
      <el-button @click="handleClose">cancel</el-button>
    </span>
  </el-dialog>
</template>
<script>
<<<<<<< HEAD
=======
import axios from 'axios'
import qs from 'qs'
import { mapGetters } from 'vuex'
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904

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
<<<<<<< HEAD
=======
const keepworkHost = 'http://localhost:8080';
const lessonHost = 'http://localhost:3000'
//markdown转json
const parseMarkDown = (item) => {
    let contentArr = item.content.split('```');
    let lessonData,itemData={};
    for(let i = 0; i < contentArr.length; i++) {
        let contentVo = contentArr[i];
        if(contentVo.substr(0, '@Lesson'.length) == '@Lesson') {
            lessonData = contentVo;
            break;
        }
    }
    if(lessonData) {
        itemData.lessonTitle = lessonData.split('Title:')[1].split('\n')[0].replace(new RegExp("'","g"),"");
        itemData.lessonUrl = keepworkHost + item.url;
        itemData.lessonCover = lessonData.split('CoverImageOfTheLesson:')[1].split('\n')[0];
        itemData.lessonNo = lessonData.split('LessonNo:')[1].split('\n')[0].replace(new RegExp("'","g"),"");
    }
    return itemData;
}
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904

export default {
  name: 'lessonsDataEditor',
  props: {
    isEditorShow: Boolean,
    originalLessonsData: Object,
  },

  data() {
<<<<<<< HEAD
=======
    //校验数值是否是整数
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
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
<<<<<<< HEAD
        coverImage: [
=======
        cover: [
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
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
<<<<<<< HEAD
      ages: '0'

    }
  },
  computed: {
=======
      ages: '0',
      //选中课程
      lessonsListData: [],
      lessonsSelect: [],
      filterMethod(query, item) {
        return item.lessonTitle.indexOf(query) > -1;
      },
    }
  },
  computed: {
    ...mapGetters({
      activePageUrl: 'activePageUrl'
    }),
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
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
<<<<<<< HEAD

    submitForm(formName) {
      checkInputEmpty();
      this.$refs[formName].validate((valid) => {
        // if (valid) {
        // } else {
        //   console.log('error submit!!');
        //   return false;
        // }
=======
    //切换年龄清空自定义的年龄
    changeAge() {
      if( this.ages == 1 ){
        this.lessonsData.agesMin = 1;
        this.lessonsData.agesMax = 2;
      }
    },
    submitForm(formName) {
      checkInputEmpty();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //课程包id
          this.lessonsData.id === '' ? this.lessonsData.id = uuid(32, 16) : this.lessonsData.id;
          //设置年龄段
          if( this.ages == 0 ){
            this.lessonsData.agesMin = '0';
            this.lessonsData.agesMax = '0';
          }
          //选择课程包的课程
          if( this.lessonsSelect.length > 0 ){
            for( var i = 0; i < this.lessonsSelect.length ; i++ ){
              let index = this.lessonsSelect[i];
              this.lessonsData.lessons.push(this.lessonsListData[index]);
            }
          }
          let params = {
            id: this.lessonsData.id,
            title: this.lessonsData.id,
            cover: this.lessonsData.cover,
            skills: this.lessonsData.skills,
            agesMin: this.lessonsData.agesMin,
            agesMax: this.lessonsData.agesMax,
            cost: this.lessonsData.cost,
            reward: this.lessonsData.reward,
            lessons: JSON.stringify(this.lessonsData.lessons),
            packageUrl: this.activePageUrl
          }
          //发送添加课程包的请求
          axios.post(lessonHost + '/api/package/createOrUpdate', qs.stringify(params),
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          })
          .then(response => {
            if( response.data.err == 0 ){
              this.handleClose();
            }else{
              console.log( response.data.msg )
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
<<<<<<< HEAD
=======
  },
  created: function(){
    //获取课程列表
    axios.get(lessonHost + '/api/class/lesson').then(response => {
      const lessonsData = response.data.hits.hits;
      lessonsData.forEach((lesson, index ) => {
        const tmp = parseMarkDown(lesson._source)
        this.lessonsListData.push({
          lessonTitle: tmp.lessonTitle,
          lessonUrl: tmp.lessonUrl,
          lessonCover: tmp.lessonCover,
          lessonNo: tmp.lessonNo,
          key: index,
        });
      })

    })
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
  }
}
</script>

<style scope>
<<<<<<< HEAD
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
=======
  .lessons .el-form-item__label:before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .lesson-list .el-transfer-panel__item{
    min-height: 30px;
    height: auto;
  }
  .unempty .el-form-item__content .el-transfer-panel:nth-child(3){
    border: 1px solid #f56c6c;
  }
  .lesson-list .el-transfer-panel{
    width: 360px;
  }
  .lessonsTitle{
    word-wrap: break-word;
    white-space: normal;
  }
  .lesson-link{
    color: #409EFF
  }
  .lesson-link:hover{
    color: #66b1ff
>>>>>>> 3c01d78d4a182622603a5e3610fd271339e2f904
  }
</style>

