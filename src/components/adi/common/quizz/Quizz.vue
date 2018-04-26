<template>
  <div class="comp-quizz">
    <div v-for="item in properties.data" :data-id="item.id">
      <div class="no">Quiz </div>
      <h3>{{ item.title }}</h3>

      <div v-if="isOperate">
        <!-- 单选题 -->
        <el-radio-group v-if="item.type == 0" v-model="quizz.single">
          <div class="opt-item" v-for="(opt, index) in item.options">
            <el-radio :label="serialNo[index]">{{serialNo[index]}} {{opt.item}}</el-radio>
          </div>
        </el-radio-group>

        <!-- 多选题 -->
        <el-checkbox-group v-if="item.type == 1" v-model="quizz.multiple">
          <div class="opt-item" v-for="(opt, index) in item.options">
            <el-checkbox name="multipleOption" :label="serialNo[index]">{{serialNo[index]}} {{opt.item}}</el-checkbox>
          </div>
        </el-checkbox-group>

        <!-- 判断题 -->
        <el-radio-group v-if="item.type == 2" v-model="quizz.judge">
            <div class="opt-item" v-for="(opt, index) in item.options">
              <el-radio :label="serialNo[index]">{{serialNo[index]}} {{opt.item}}</el-radio>
            </div>
        </el-radio-group>
      </div>

      <div v-if="!isOperate">
        <div class="opt-item" v-for="(opt, index) in item.options">
            {{serialNo[index]}} {{opt.item}}
        </div>
      </div>

      <div v-if="isShow" class="opt-item"><span>Answer:</span> {{ item.answer }}</div>
      <div v-if="isShow" class="opt-item"><span>Score:</span> {{ item.score }}</div>
      <div v-if="isShow" class="opt-item"><span>Analysis:</span> {{ item.desc }}</div>

      <el-button v-if="isOperate && !isShow" type="primary" @click="submitQuizz">submit</el-button>
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import axios from 'axios'
import qs from 'qs'

const hideMod = function(name, flag) {
  let eles = document.getElementsByTagName('div');
  for(let i =0; i < eles.length; i++) {
    let ele = eles[i];
    if(ele.getAttribute('data-mod')==name){
      if(flag) {
        ele.setAttribute('hidden', 'hidden');
      }else {
        ele.removeAttribute('hidden');
      }
    }
  }
}

const saveQuiz = []; // 保存所提交的题型
const quizzList = []; // 试题集合
const answerSheet = []; // 保存当前答题卡
const lessonHost = 'http://127.0.0.1:3000'
let device; // 设备 pc 电脑自学 pad 课堂学习
let sn; // 试题的sn
let classId; // 课堂 Id
let username; // 用户名
let studentNo; // 学号

export default {
  name: 'AdiQuizz',
  mixins: [compBaseMixin],
  data() {
    return {
      isOperate: false,
      isShow: false,
      serialNo: ['A', 'B', 'C', 'D', 'E', "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      quizz: {
        single: '',
        multiple: [],
        judge: ''
      }
    }
  },
  mounted: function() {
    let query = location.href.split('?')[1];
    if (query) {
        query = query.split('&');
        for (var i = 0; i < query.length; i++) {
            var ary = query[i].split('=');
            if (ary[0] == 'device' && ary[1]) {
              device = ary[1];
            } else if(ary[0] == 'sn' && ary[1]) {
              sn = ary[1];
            } else if(ary[0] == 'classId' && ary[1]) {
              classId = ary[1];
            } else if(ary[0] == 'username' && ary[1]) {
              username = ary[1];
            } else if(ary[0] == 'studentNo' && ary[1]) {
              studentNo = ary[1];
            }
        }
    }
    if (device == 'pc' || device == 'pad') {
      let _this = this.properties.data[0];
      quizzList.push(_this);
      let answer = {};
      answer.quizzId = _this.id;
      answer.quizzScore = _this.score;
      answerSheet.push(answer);
    }
    if(device == 'pc') {
      this.isOperate = true;
    } else if(device == 'pad') {
      // 课堂学习 TODO: 进入课堂 /class/enter
      let params = {
        device: 'pad',
        classId: classId,
        username: username,
        studentNo: studentNo
      }
      axios.post(lessonHost + '/api/class/enter', qs.stringify(params),
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .then(response => {
        let r = response.data
        if(r.err == 0) {
          this.isOperate = true;
        } else {
          this.$message.error("课堂已关闭或数据异常~");
        }
      })
    }
  },
  methods: {
    submitQuizz() {
      this.isShow = true;
      let data = this.properties.data;
      let trueFlag = false;
      let myAnswer;
      if(data[0].type == 0) {  // 单选
        myAnswer = this.quizz.single;
        if(myAnswer === data[0].answer) {
          trueFlag = true;
        }else {
          trueFlag = false;
        }
      }else if(data[0].type == 2) { // 判断
        myAnswer = this.quizz.judge;
        if(myAnswer === data[0].answer) {
          trueFlag = true;
        }else {
          trueFlag = false;
        }
      }else if(data[0].type == 1) { // 多选
        myAnswer = this.quizz.multiple;
        if(JSON.stringify(myAnswer) === data[0].answer) {
          trueFlag = true;
        }else {
          trueFlag = false;
        }
      }
      if(trueFlag) {
        this.$message({
          message: '恭喜你，答对了~',
          type: 'success'
        });
      } else {
        this.$message.error("很遗憾，答错了~");
      }
      for(let i = 0; i < answerSheet.length; i++) {
        let item = answerSheet[i];
        if(item.quizzId === data[0].id) {
          item.trueFlag = trueFlag;
          if(myAnswer instanceof Array) {
            item.myAnswer = myAnswer.join(',');
          }else {
            item.myAnswer = myAnswer;
          }
          break;
        }
      }
      saveQuiz.push(JSON.stringify(data));
      // console.log('ssssssssssssssssssssssss')
      // console.log(saveQuiz)
      // console.log(quizzList)
      // console.log('answerSheet:')
      // console.log(answerSheet)
      let params = {};
      params.answerSheet = JSON.stringify(answerSheet);
      params.totalScore = 0;
      params.rightCount = 0;
      params.wrongCount = 0;
      params.emptyCount = 0;
      params.sn = sn;
      for(let i = 0; i < answerSheet.length; i++) {
        let item = answerSheet[i];
        if(item.myAnswer) {
          if(item.trueFlag) {
            params.rightCount++;
            params.totalScore += parseInt(item.quizzScore);
          } else {
            params.wrongCount++;
          }
        } else{
          params.emptyCount++;
        }
      }
      if(device === 'pc') { // 自学
        if(!sn) {
          // 异常
          return;
        }
        axios.post(lessonHost + '/api/record/saveOrUpdate', qs.stringify(params),
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          })
          .then(response => {

          })
      } else if(device === 'pad') { // 课堂学习
        params.username = username
        axios.post(lessonHost + '/api/class/replay', qs.stringify(params),
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          })
          .then(response => {

          })
      }
    }
  }
}
</script>

<style>
  [mod-container], .viewport-container {
    counter-reset: no;
  }
  [data-mod="ModQuizz"] {
    padding: 30px 0;
  }
  [data-mod="ModQuizz"] .no:after {
    content: counters(no, '-');
    counter-increment: no;
  }

  .comp-quizz .opt-item{
    margin-bottom: 15px;
  }
</style>


