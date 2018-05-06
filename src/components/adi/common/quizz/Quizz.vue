<template>
  <div class="comp-quizz" v-bind:class="{'error': !isRight }">
      <div v-if="!isOperate" class="splic"></div>

    <div v-for="item in properties.data" :data-id="item.id">
      <div class="no"><i class="el-icon-edit-outline"></i> Quiz </div>

      <div class="quizz-content">
        <div class="title">{{ item.title }} <span v-if="item.type == 1">(<em>multiple choices</em>)</span></div>

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
        <el-button v-if="isOperate && !isShow" size="small" type="primary" @click="submitQuizz">submit</el-button>
      </div>

      <div v-if="isShow" class="submit-show">
        <div class="opt-item"><span>Right Answer:</span> {{ item.answer }}</div>
        <div class="opt-item"><span>Explanation:</span> {{ item.desc }}</div>
      </div>
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
let answerSheet = []; // 保存当前答题卡
const lessonHost = 'http://127.0.0.1:3000'
let device; // 设备 pc 电脑自学 pad 课堂学习
let sn; // 试题的sn
let classId; // 课堂 Id
let username; // 用户名
let studentNo; // 学号
const timer = {
  timeout: 1000 * 60, // 60s
  timeoutObj: null,
  reset: function() {
    clearInterval(this.timeoutObj)
    return this
  },
  start: function(username) {
    this.timeoutObj = setInterval( function(){
      // 开始记录学习时长
      let params = {sn: sn}
      axios.post(lessonHost + '/api/record/study', qs.stringify(params),
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(response => {
          let r = response.data
        })
    }, this.timeout)
  },
  stop: function() {
    clearInterval(this.timeoutObj)
  }
}

export default {
  name: 'AdiQuizz',
  mixins: [compBaseMixin],
  data() {
    return {
      isOperate: false,
      isShow: false,
      isRight: true,
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
      timer.reset().start();
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
          this.isOperate = true
          if(r.data.u){
            sn = r.data.u.recordSn
            let ans = r.data.u.answerSheet
            if(ans) {
              answerSheet = ans;
              // TODO: 恢复答题状态
              for(let i = 0; i < ans.length; i++) {
                var item  = ans[i];
                let data = this.properties.data;
                if(item.quizzId == data[0].id && item.myAnswer) {
                  // 找到了该题目
                  this.isShow = true;
                  this.isRight = item.trueFlag;
                  if(data[0].type == 0){// 单选
                    this.quizz.single = item.myAnswer;
                  } else if(data[0].type == 1) {
                    this.quizz.multiple = item.myAnswer.split(',');
                  } else if(data[0].type == 2) {
                    this.quizz.judge = item.myAnswer;
                  }
                  break;
                }
              }
            }
          }
        } else {
          this.$message.error("课堂已关闭~");
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
          this.isRight = true;
        }else {
          trueFlag = false;
          this.isRight = false;
        }
      }else if(data[0].type == 2) { // 判断
        myAnswer = this.quizz.judge;
        if(myAnswer === data[0].answer) {
          trueFlag = true;
          this.isRight = true;
        }else {
          trueFlag = false;
          this.isRight = false;
        }
      }else if(data[0].type == 1) { // 多选
        myAnswer = this.quizz.multiple.sort();
        let answer = JSON.parse(data[0].answer).sort();
        if(JSON.stringify(myAnswer) === JSON.stringify(answer)) {
          trueFlag = true;
          this.isRight = true;
        }else {
          trueFlag = false;
          this.isRight = false;
        }
      }
      // if(trueFlag) {
      //   this.$message({
      //     message: '恭喜你，答对了~',
      //     type: 'success'
      //   });
      // } else {
      //   this.$message.error("很遗憾，答错了~");
      // }
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
    padding-top: 0;
    padding-bottom: 0;
  }

  [data-mod="ModQuizz"] .no {
    font-weight: 600;
  }

  [data-mod="ModQuizz"] .no>i {
    color: #1982FF;
    font-size:22px;
    font-weight: 600;
    padding-right: 12px;
    vertical-align: middle;
  }

  [data-mod="ModQuizz"] .no:after {
    content: counters(no, '-');
    counter-increment: no;
  }

  .quizz-content {
    margin-left: 40px;
  }

  .splic {
    height: 1px;
    margin: 0 0 30px 40px;
    border-bottom: 1px dashed #BFBFBF;
  }

  [data-mod="ModQuizz"]:last-child {
    padding-bottom: 40px;
  }

  .comp-quizz {
    margin-top: 10px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #fff;
    color: #4c4c4c;
  }

  .comp-quizz .title {
    margin: 20px 0;
  }

  .comp-quizz .title span {
    padding-left:10px;
  }

  em {
    color:#FF414A;
    font-style: normal;
  }

  .comp-quizz .opt-item{
    margin-top: 20px;
  }

  .quizz-content .el-radio__label,
  .quizz-content .el-checkbox__label {
    font-size: 16px;
  }
  .quizz-content .el-radio__input.is-checked+.el-radio__label,
  .quizz-content .el-checkbox__input.is-checked+.el-checkbox__label {
      color: #4C4C4C;
      font-weight: 600;
  }

  .quizz-content .el-button {
    margin: 20px 0;
  }

  .submit-show {
    margin: 20px 0 20px 20px;
    padding: 15px 25px;
    background:rgba(64,158,254,0.05);
    font-weight: 600;
    color: #409EFE;
  }

  .submit-show .opt-item {
    margin: 12px 0;
  }

  .submit-show span {
    color: #111;
  }

  .comp-quizz.error {
    margin-bottom: 20px;
    background: rgba(245,56,56,0.05);
    border: 1px solid #F53838;
  }

  .comp-quizz.error .submit-show {
    background: none;
    color: #FF414A;
    margin-bottom: 0;
    padding: 15px 20px 0;
  }
</style>


