<template>
  <div class="comp-quiz" v-bind:class="{'error': !isRight }">
      <div v-if="!isOperate" class="splic"></div>

    <div v-for="item in properties.data" :id="item.id">
      <div class="no"><i class="el-icon-edit-outline"></i> Quiz </div>

      <div class="quiz-content">
        <div class="title">{{ item.title }} <span v-if="item.type == 1">(<em>multiple choices</em>)</span></div>

        <div v-if="isOperate">
          <!-- 单选题 -->
          <el-radio-group v-if="item.type == 0" v-model="quiz.single">
            <div class="opt-item" v-for="(opt, index) in item.options">
              <el-radio :label="serialNo[index]">{{serialNo[index]}} {{opt.item}}</el-radio>
            </div>
          </el-radio-group>

          <!-- 多选题 -->
          <el-checkbox-group v-if="item.type == 1" v-model="quiz.multiple">
            <div class="opt-item" v-for="(opt, index) in item.options">
              <el-checkbox name="multipleOption" :label="serialNo[index]">{{serialNo[index]}} {{opt.item}}</el-checkbox>
            </div>
          </el-checkbox-group>

          <!-- 判断题 -->
          <el-radio-group v-if="item.type == 2" v-model="quiz.judge">
            <div class="opt-item" v-for="(opt, index) in item.options">
              <el-radio :label="serialNo[index]">{{serialNo[index]}} {{opt.item}}</el-radio>
            </div>
          </el-radio-group>

          <!-- 文本匹配题 -->
          <div v-if="item.type == 3" v-model="quiz.text">
            <div class="opt-item" v-for="(opt, index) in item.options">
              <div>Text {{index+1}}: </div>
              <pre>{{opt.item}}</pre>
            </div>
          </div>
        </div>

        <div v-if="!isOperate" :data-answer="item.answer" class="getData">
          <div class="opt-item" v-for="(opt, index) in item.options" v-if="item.type == 0 || item.type == 1 || item.type == 2">
              {{serialNo[index]}} {{opt.item}}
          </div>
          <div class="opt-item" v-for="(opt, index) in item.options" v-if="item.type == 3">
            <div>Text {{index+1}}: </div>
            <pre>{{opt.item}}</pre>
          </div>
        </div>
        <div v-if="item.type == 3 && isOperate">
          <el-input :disabled="isShow" type="textarea" maxlength="512" v-model="textAnswer" placeholder="Please Input Your Answer Here."></el-input>
        </div>
        <el-button v-if="isOperate && !isShow" size="small" type="primary" @click="submitQuiz">submit</el-button>
      </div>

      <div v-if="isShow" class="submit-show">
        <div v-if="item.type != 3" class="opt-item"><span>Right Answer:</span> {{ item.answer }}</div>
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
const quizList = []; // 试题集合
let answerSheet = []; // 保存当前答题卡
const lessonHost = 'http://localhost:3000'
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
  name: 'AdiQuiz',
  mixins: [compBaseMixin],
  data() {
    return {
      isOperate: false,
      isShow: false,
      isRight: true,
      textAnswer: '',
      serialNo: ['A', 'B', 'C', 'D', 'E', "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      quiz: {
        single: '',
        multiple: [],
        judge: ''
      }
    }
  },
  mounted: function() {
    let query = location.href.split('?')[1];
    if(query && query.indexOf('#')!= -1 ) {
      query = query.split('#')[0];
    }
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
      // 答题模式下不允许复制粘贴功能
      document.getElementsByTagName('body')[0].setAttribute('style', 'margin-top: 60px !important');
      document.oncontextmenu=new Function("event.returnValue=false");
      document.onselectstart=new Function("event.returnValue=false");
      document.onkeydown = function(){
        if (event.ctrlKey && window.event.keyCode==67){
          return false;
        }
        if (event.ctrlKey && window.event.keyCode==86){
          return false;
        }
      }
      document.body.oncopy = function (){
        return false;
      }
      let _this = this.properties.data[0];
      // console.log(_this);
      quizList.push(_this);
      let body = document.getElementsByClassName('el-main')[0];
      let ansSheet = document.getElementsByClassName('answer-sheet');
      let nodeAnswerSheet = ansSheet.length > 0 ? ansSheet[0] : document.createElement('ul');
      let ansEle = ''
      for(let i = 0; i < quizList.length; i++) {
        ansEle += '<li data-index="' + i + '"><a class="quiz-item el-button" data-id="' + quizList[i].id + '" href="#quiz_' + quizList[i].id + '">Quiz ' + (i + 1) + '</a></li>';
      }
      nodeAnswerSheet.setAttribute('class', 'answer-sheet');
      nodeAnswerSheet.innerHTML = ansEle;
      body.insertBefore(nodeAnswerSheet, body.childNodes[0]);
      let quizItems = document.getElementsByClassName('quiz-item');
      for(let i = 0; i < quizItems.length; i++) {
        quizItems[i].onclick = function(){
          let quizId = this.getAttribute('data-id');
          window.location.hash="#" + quizId;
        }
      }
      // 生成一个答题卡在顶部
      let answer = {};
      answer.quizId = _this.id;
      answer.quizScore = _this.score;
      answerSheet.push(answer);
      timer.reset().start();
    }
    if(device == 'pc') {
      this.isOperate = true;
    } else if(device == 'pad') {
      // 课堂学习 进入课堂 /class/enter
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
            if(ans && ans[0].quizId) {
              answerSheet = ans;
              // 恢复答题状态
              for(let i = 0; i < ans.length; i++) {
                var item  = ans[i];
                let data = this.properties.data;
                if(item.quizId == data[0].id && item.myAnswer) {
                  // 找到了该题目
                  this.isShow = true;
                  this.isRight = item.trueFlag;
                  if(data[0].type == 0){// 单选
                    this.quiz.single = item.myAnswer;
                  } else if(data[0].type == 1) {
                    this.quiz.multiple = item.myAnswer.split(',');
                  } else if(data[0].type == 2) {
                    this.quiz.judge = item.myAnswer;
                  } else if(data[0].type == 3) {
                    this.textAnswer = item.myAnswer;
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
    submitQuiz() {
      let data = this.properties.data;
      if(!this.quiz.single && !this.quiz.judge && !this.quiz.multiple.join(',') && data[0].type != 3) {
        this.$message.error("Please select one answer!")
        return;
      }else if(data[0].type == 3 && !this.textAnswer) {
        this.$message.error("Please input your answer!")
        return;
      }
      this.isShow = true;
      let trueFlag = false;
      let myAnswer;
      if(data[0].type == 0) {  // 单选
        myAnswer = this.quiz.single;
        if(myAnswer === data[0].answer[0]) {
          trueFlag = true;
          this.isRight = true;
        }else {
          trueFlag = false;
          this.isRight = false;
        }
      }else if(data[0].type == 2) { // 判断
        myAnswer = this.quiz.judge;
        if(myAnswer === data[0].answer[0]) {
          trueFlag = true;
          this.isRight = true;
        }else {
          trueFlag = false;
          this.isRight = false;
        }
      }else if(data[0].type == 1) { // 多选
        myAnswer = this.quiz.multiple.sort();
        let answer = data[0].answer.sort();
        if(JSON.stringify(myAnswer) === JSON.stringify(answer)) {
          trueFlag = true;
          this.isRight = true;
        }else {
          trueFlag = false;
          this.isRight = false;
        }
      }else if(data[0].type == 3) { // 文本匹配
        // 去掉所有空格回车和其他空符号之后转换为小写
        let flag = false;
        myAnswer = this.textAnswer.replace(/\r|\n|\\s/g, "").toLowerCase();
        for(let i = 0; i < data[0].options.length; i ++) {
          let opAnswer = data[0].options[i].item.replace(/\r|\n|\\s/g, "").toLowerCase();
          if(opAnswer === myAnswer) {
            flag = true;
            break;
          }
        }
        trueFlag = flag;
        this.isRight = flag;
      }
      // if(trueFlag) {
      //   this.$message({
      //     message: '恭喜你，答对了~',
      //     type: 'success'
      //   });
      // } else {
      //   this.$message.error("很遗憾，答错了~");
      // }
      let ansArr = document.getElementsByTagName('a');
      for(let i = 0; i < ansArr.length; i++) {
        console.log(data);
        if(ansArr[i].getAttribute('data-id') === data[0].id) {
          ansArr[i].classList.add('quiz-item-done');
        }
      }
      for(let i = 0; i < answerSheet.length; i++) {
        let item = answerSheet[i];
        if(item.quizId === data[0].id) {
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
            params.totalScore += parseInt(item.quizScore);
          } else {
            params.wrongCount++;
          }
        } else{
          params.emptyCount++;
        }
      }
      if(device === 'pc') { // 自学
        if(!sn) {
          // 预览模式不产生记录
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

  [data-mod="ModQuiz"] {
    padding-top: 0;
    padding-bottom: 0;
  }

  [data-mod="ModQuiz"] .no {
    font-weight: 600;
  }

  [data-mod="ModQuiz"] .no>i {
    color: #1982FF;
    font-size:22px;
    font-weight: 600;
    padding-right: 12px;
    vertical-align: middle;
  }

  [data-mod="ModQuiz"] .no:after {
    content: counters(no, '-');
    counter-increment: no;
  }

  .quiz-content {
    margin-left: 40px;
  }

  .splic {
    height: 1px;
    margin: 0 0 30px 40px;
    border-bottom: 1px dashed #BFBFBF;
  }

  [data-mod="ModQuiz"]:last-child {
    padding-bottom: 40px;
  }

  .comp-quiz {
    margin-top: 10px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #fff;
    color: #4c4c4c;
  }

  .comp-quiz .title {
    margin: 15px 0 5px;
  }

  .comp-quiz .title span {
    padding-left:10px;
  }

  em {
    color:#FF414A;
    font-style: normal;
  }

  .comp-quiz .opt-item{
    margin-top: 20px;
  }

  .quiz-content .el-radio__label,
  .quiz-content .el-checkbox__label {
    font-size: 16px;
  }
  .quiz-content .el-radio__input.is-checked+.el-radio__label,
  .quiz-content .el-checkbox__input.is-checked+.el-checkbox__label {
      color: #4C4C4C;
      font-weight: 600;
  }

  .quiz-content .el-button {
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

  .comp-quiz.error {
    margin-bottom: 20px;
    background: rgba(245,56,56,0.05);
    border: 1px solid #F53838;
  }

  .comp-quiz.error .submit-show {
    background: none;
    color: #FF414A;
    margin-bottom: 0;
    padding: 15px 20px 0;
  }
  
  .answer-sheet {
    position: fixed;
    /*固定定位*/
    top: 0;
    bottom: 0;
    left: 50%;
    height: 60px;
    transform:translate(-50%,-50%);
    z-index: 100;
    list-style-type: none;
    padding-top: 20px;
    /* overflow: hidden; */
  }

  /* .answer-sheet{
    max-height: 600px;
    text-align: center;
    margin: 20px 0;
    padding: 0 10px;
    overflow: hidden;
    box-sizing: border-box;
    list-style-type: none;
  } */
  .answer-sheet li{
    font-size: 16px;
    width: 70px;
    height: 25px;
    margin: 5px 10px;
    float: left;
    line-height: 1.5;
    background-color: #F2F2F2;
    border-radius:4px;
  }

  .answer-sheet a {
    text-decoration: none
  }

  .quiz-item-done {
    background: #409efe;
    color: white;
  }

   .quiz-item:hover {
    background: #f99523;
    border: 1px solid #f99523;
    color: white;
  }
</style>


