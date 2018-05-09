<script>
import _ from 'lodash'
import baseMixin from '../../base/base.mixin'
import { mapGetters } from 'vuex'
import axios from 'axios'
import qs from 'qs'

const hideMod = function(name, flag) {
  let eles = document.getElementsByTagName('div')
  for(let i =0; i < eles.length; i++) {
    let ele = eles[i]
    if(ele.getAttribute('data-mod')==name){
      if(flag) {
        ele.setAttribute('style', 'display:none')
      }else {
        ele.setAttribute('style', 'display:block')
      }
    }
  }
}

const getMods = function(name) {
  let eles = document.getElementsByTagName('div')
  let rets = []
  for(let i = 0; i < eles.length; i++) {
    let ele = eles[i]
    if(ele.getAttribute('data-mod')==name){
      rets.push(ele)
    }
  }
  return rets
}

const createMod = function(name, html) {
  let ele = document.createElement('div')
  ele.setAttribute('data-mod', name)
  ele.setAttribute('hidden', 'true')
  ele.innerHTML = html
  return ele
}

// get the first mod
const getMod = function(name) {
  let eles = document.getElementsByTagName('div')
  for(let i = 0; i < eles.length; i++) {
    let ele = eles[i]
    if(ele.getAttribute('data-mod')==name){
      return ele
    }
  }
  return null
}

const lessonHost = 'http://localhost:3000'
let vuex = {}
let firstInFlag = true
let self
let btnClass
let classState = 0 // 0 未开始 1 已开始 2 已结束
let classId // classID
let currentTab = 'ModOverview' // 当前选中的页卡
let quizLen
let orderBy // 当前排序
let sortFlag // 'false' 正序 'true' 倒序
let lastResponse

const init = function(){
  console.log('init')
  if (localStorage && localStorage.vuex) {
    vuex = JSON.parse(localStorage.vuex)
  }
  let query = location.href.split('?')[1]
  let device
  if (query) {
      query = query.split('&');
      for (var i = 0; i < query.length; i++) {
          var ary = query[i].split('=');
          if (ary[0] == 'device' && ary[1]) {
              device = ary[1];
              break;
          }
      }
  }
  if (device == 'pc' || device == 'pad') {
    document.getElementsByClassName('index-page-header')[0].setAttribute('hidden', 'hidden')
    document.getElementsByClassName('tool-header')[0].setAttribute('hidden', 'hidden')
    hideMod('ModLesson', true)
  } else {
    let lessonMod = getMod('ModLesson')
    if(lessonMod && lessonMod.parentNode != null) {
      let studentHtm =  '<div class="el-row mod-full-width-0-0-32">'
                        + '<div class="no-data">Teaching is not started yet.There is no record of students\' performance.</div>'
                      + '</div>';
      let summaryHtm =  '<div class="el-row mod-full-width-0-0-32">'
                        + '<div class="no-data">Learning is not started yet. There is no summary here.</div>'
                      + '</div>';
      lessonMod.parentNode.appendChild(createMod('ModStudent', studentHtm));
      lessonMod.parentNode.appendChild(createMod('ModSummary', summaryHtm));
    }
    // 询问服务端是否存在可恢复的课堂内容
    let params = {}
    params.username = self.username
    params.lessonUrl = self.activePageUrl
    if (location.href.indexOf('editor.html') === -1 && location.href.indexOf('viewport.html') === -1) {
      axios.post(lessonHost + '/api/class/resurme', qs.stringify(params),
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .then(response => {
        let r = response.data
        if(r.err === 0) {
          // 可以恢复状态
          beginClass(r.data.classId);
        }
      })
    }
  }
}

const timer = {
  timeout: 3000, // 3s
  timeoutObj: null,
  reset: function() {
    clearInterval(this.timeoutObj)
    return this
  },
  start: function() {
    this.timeoutObj = setInterval( function () {
      // /class/performance 获取数据后 DOM 操作
      let params = {username: self.username}
      axios.post(lessonHost + '/api/class/performance', qs.stringify(params),
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(response => {
          let r = response.data;
          lastResponse = r;
          updateStudentsView(r);
        })
    }, this.timeout)
  },
  stop: function() {
    clearInterval(this.timeoutObj)
  }
}

// 更新 Students'Performance 下的视图
const updateStudentsView = function(r) {
  r = (typeof r !== 'undefined') ?  r : lastResponse; // r 缺省时为 lastResponse
  let theadHtm = '', tbodyHtm = '', quizHtm = [], myanswer = '';  //thead tbody 题目答案
  let total = 0, progress = 0, count = 0; // 题目总数 答题进度 答题数量
  if(r.data) {
    let data = r.data;
    for(let i = 0; i < data.length; i++) {
      let item = data[i]
      item.count = 0
      item.total = (item.answerSheet ? item.answerSheet.length : quizLen)
      if(item.rightCount || item.wrongCount) {
        item.count =  parseInt(item.rightCount) + parseInt(item.wrongCount)
      }
    }
    if(orderBy) { // 需要排序该数据
      const compare = function(prop, ascFlag) {
         String.prototype.startWith = function(s) {
          if (s == null || s == "" || this.length == 0 || s.length > this.length)
            return false
          if (this.substr(0, s.length) == s)
            return true
          else
            return false
          return true
        }
        return function(a,b){
          let value1 = a[prop];
          let value2 = b[prop];
          if( prop.startWith('quiz') ) {
            let idx = parseInt(prop.split('-')[1]) - 1
            value1 = 0
            value2 = 0
            if(a && a.answerSheet && a.answerSheet[idx]) {
              value1 = a.answerSheet[idx].trueFlag ? 2 : 1
            }
            if(b && b.answerSheet && b.answerSheet[idx]) {
              value2 = b.answerSheet[idx].trueFlag ? 2 : 1
            }
          }
          let ret = 0;
          value1 > value2 ? ret = 1 : ret = -1;
          return ascFlag ? ret : -ret;
        }
      }
      const sortList = function(prop, ascFlag) {
        data.sort(compare(prop, ascFlag));
      }
      sortList(orderBy, sortFlag)
    }
    let learningCount = 0; // 正在学习人数
    let leaveCount = 0; // 离开的人数
    let offlineCount = 0; // 离线的人数
    for(let i  = 0; i < data.length; i++) {
      let item = data[i];
      quizHtm[i] = '';
      if(item.state === 1) { // 1.learning 2.Leave learning page 3.Offline
        learningCount++;
      } else if(item.state === 2) {
        leaveCount++;
      } else if(item.state === 3) {
        offlineCount++;
      }
      let answerItem = item.answerSheet;
      if(answerItem) {
        for(let j = 0; j < answerItem.length; j++) {
          myanswer = answerItem[j].myAnswer ? answerItem[j].myAnswer : " ";
          quizHtm[i] += '<td class="' + (answerItem[j].trueFlag ? 'right' : 'wrong') + '">'+ myanswer +'</td>'; // 对错样式
        }
      } else {
        for(let j = 0; j < quizLen; j++) {
          quizHtm[i] += '<td></td>';
        }
      }
      progress = item.count + '/' + item.total; // 完成进度
      if(item.total != 0 && item.count === item.total) {
        progress = "finished";
      }

      let quiz = quizHtm[i] == undefined ? " " : quizHtm[i];

      tbodyHtm += '<tr><td>'+ item.username +'</td>'
                      + '<td>'+ item.studentNo +'</td>'
                      + '<td>'+ progress +'</td>'
                      + quiz
                + '</tr>';
    }
    if(currentTab === 'ModStudent') {
      // 隐藏学习信息
      document.getElementsByClassName('student-info')[0].setAttribute('style', 'display:none');
    } else {
      // 显示学习信息
      document.getElementsByClassName('student-info')[0].setAttribute('style', 'display:block');
      document.getElementsByClassName('student-learning')[0].innerText = learningCount;
      document.getElementsByClassName('student-leave')[0].innerText = leaveCount;
      document.getElementsByClassName('student-offline')[0].innerText = offlineCount;
    }
    document.querySelector(".student-taughted-details .tbl-body").innerHTML = tbodyHtm // 表格主体
  }
}

const bindSortEvent = function() {
  // Sort Start
  let nameSortFlag = false,
      noSortFlag = false,
      totalSortFlag = false,
      quizSortFlag = []; //数组存储题目排序
  for(let i = 0; i < quizLen; i++) {
    quizSortFlag.push(false)
  }
  const active = function(p, c) {
    function hasClass(ele, cls) {
      cls = cls || '';
      if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
      return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ');
    }
    function addClass(ele, cls) {
      if (!hasClass(ele, cls)) {
        ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
      }
    }
    function removeClass(ele, cls) {
      if (hasClass(ele, cls)) {
        var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
          newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        ele.className = newClass.replace(/^\s+|\s+$/g, '');
      }
    }
    let childEles = p.getElementsByClassName('sort-icon');
    for(let i = 0; i < childEles[0].childNodes.length; i++) {
      let ele = childEles[0].childNodes[i];
      if(ele.getAttribute('class') == c) {
        addClass(ele, 'active');
      }else {
        removeClass(ele, 'active');
      }
    }
  }
  document.getElementsByClassName('sort-by-name')[0].addEventListener('click', function(e) {
    console.log('SortByName');
    orderBy = 'username'
    if(nameSortFlag) {
      // 倒序
      active(this, 'el-icon-caret-top')
      nameSortFlag = false
      sortFlag = false
    } else {
      // 正序
      active(this, 'el-icon-caret-bottom')
      nameSortFlag = true
      sortFlag = true
    }
    updateStudentsView()
  });
  document.getElementsByClassName('sort-by-no')[0].addEventListener('click', function(e) {
    orderBy = 'studentNo'
    if(noSortFlag) {
      // 倒序
      active(this, 'el-icon-caret-top')
      noSortFlag = false
      sortFlag = false
    } else {
      // 正序
      active(this, 'el-icon-caret-bottom')
      noSortFlag = true
      sortFlag = true
    }
    updateStudentsView()
  });
  document.getElementsByClassName('sort-by-total')[0].addEventListener('click', function(e) {
    orderBy = 'count'
    if(totalSortFlag) {
      // 倒序
      active(this, 'el-icon-caret-top')
      totalSortFlag = false
      sortFlag = false
    } else {
      // 正序
      active(this, 'el-icon-caret-bottom')
      totalSortFlag = true
      sortFlag = true
    }
    updateStudentsView()
  });
  let quizSortEles = document.getElementsByClassName('sort-by-quiz');
  for(let i = 0; i < quizSortEles.length; i++) {
    quizSortEles[i].addEventListener('click', function(e) {
      let idx = parseInt( this.getAttribute('idx') )
      orderBy = 'quiz-' + idx
      if(quizSortFlag[idx]) {
        // 倒序
        active(this, 'el-icon-caret-top')
        quizSortFlag[idx] = false
        sortFlag = false
      } else {
        // 正序
        active(this, 'el-icon-caret-bottom')
        quizSortFlag[idx] = true
        sortFlag = true
      }
      updateStudentsView()
    });
  }
  // Sort End
}

const beginClass = function(classId) {
  // tipClass.innerText = '(Click here to dismiss the class)'
  classState = 1
  classId = classId
  timer.reset().start(self.username)
  // 弹窗显示 ClassId
  self.$alert("<div class='txt-one'>The class ID is <span>" + classId + "</span><br/>Please let your students login with this identifier to play paracraft. And you could view students' real-time information below the menu<br/> <a href='javascript:;'>Students' Performance</a></div>"
            + "<div class='txt-two'><span>Attention</span>: Class ID is the unique identifier for this class. Students in this class need to login with this identifier to start learning the lesson. This ensures the student learning data is sent to the system correctly.</div>", {
    dangerouslyUseHTMLString: true,
    confirmButtonText: 'OK',
    callback: action => {
      self.$notify.info({
        title: 'Class ID:',
        dangerouslyUseHTMLString: true,
        message: '<div class="showMessage"><strong>'+ classId +'</strong><div class="prompt el-popover">Class ID is the unique identifier for this class.'
                  + 'Students in this class need to login with this identifier to start learning the lesson. '
                  + 'This ensures the student learning data is sent to the system correctly.</div></div>',
        duration: 0,
        showClose: false
      })
    }
  });

  let studentMod = getMod('ModStudent');
  let quizNo = ''; // 题目编号
  quizLen = getMods('ModQuiz').length;
  for(let i = 0; i < quizLen; i++) { // 题目序号
    let quizContent = getMods('ModQuiz')[i].getElementsByClassName("quiz-content")[0];
    let dataAnswer = quizContent.getElementsByClassName("getData")[0].getAttribute("data-answer");
    let optItem = quizContent.getElementsByClassName("opt-item"); //获取所有题目选项
    let resetData = dataAnswer.replace("[","").replace("]","").replace(/\"/g, "").split(","); // 将字符串转换成数组

    for(let j = 0; j < optItem.length; j++) {
      let resetHtm = optItem[j].innerHTML.replace(/\s+/g,"")[0];
      for(let k = 0; k < resetData.length; k++) {
        if(resetData[k] == resetHtm) {
          optItem[j].className += ' state';
        }
      }
    }

    quizNo += '<td><div class="sort-btn sort-by-quiz" idx="'+ parseInt(i+1) +'">'
            + '<span>Quiz'+ parseInt(i+1) +'</span>'
            + '<span class="sort-icon"><i class="el-icon-caret-top active"></i><i class="el-icon-caret-bottom"></i></span>'
            + '<div class="quizContent">' + quizContent.innerHTML + '</div>'
            + '</div></td>';
  }

  let studetDataHtm = '<div class="student-taughted-details mod-full-width-0-0-32">'
        + '<div class="express">'
          + '<span class="r">right</span>'
          + '<span class="w">wrong</span>'
      + '</div>'
      + '<table class="table-wrap" cellspacing="0" border="0">'
          + '<thead>'
            + '<tr class="tbl-head">'
              + '<td><div class="sort-btn sort-by-name"><span>Name</span><span class="sort-icon"><i class="el-icon-caret-top active"></i><i class="el-icon-caret-bottom"></i></span></div></td>'
              + '<td><div class="sort-btn sort-by-no"><span>Student No.</span><span class="sort-icon"><i class="el-icon-caret-top active"></i><i class="el-icon-caret-bottom"></i></span></div></td>'
              + '<td><div class="sort-btn sort-by-total"><span>Quizes(Total:'+ quizLen +')</span><span class="sort-icon"><i class="el-icon-caret-top active"></i><i class="el-icon-caret-bottom"></i></span></div></td>'
              + quizNo
            +'</tr>'
          + '</thead>'
          + '<tbody class="tbl-body"></tbody>'
      + '</table>'
  + '</div>';
  studentMod.innerHTML = studetDataHtm;
  bindSortEvent();
  let summaryMod = getMod('ModSummary');
  summaryMod.innerHTML = '<div class="el-row mod-full-width-0-0-32">'
                        + '<div class="no-data">Please wait… The summary will be generated after the teaching is finished.</div>'
                      + '</div>';

  document.getElementById('btnClass').lastChild.innerText = 'Dismiss the Class';
}

export default {
  computed: {
    ...mapGetters({
      username: 'user/username',
      isLogined: 'user/isLogined',
      activePageUrl: 'activePageUrl'
    })
  },
  mounted: function(){
    init()
  },
  mixins: [baseMixin],
  methods: {
    compWrapperOptions(name) {
      let options = {}
      self = this
      options = _.merge(options, this.generateOptionsStyle(name))
      const mods = []
      options.defaultCover = require('@/../static/adi/imgLoop/imgCarouselOne.jpg')
      options.tempAnimations = []
      // Tab 被点击的回调
      options.tabClick = function(tab) {
        // 切换显示的页卡
        const sliceMod = function(name) {
          currentTab = name
           // ["ModLesson", "ModMarkdown", "ModQuiz", "ModAnimations", "ModStudent", "ModSummary", "ModAnimations", "ModStudent", "ModSummary"]
          if(name == 'ModOverview') {
            // 显示除了 ModAnimations ModStudent ModSummary 之外所有的 Mod
            for(let i = 0; i < mods.length; i ++) {
              let t = mods[i]
              if(t != 'ModAnimations' && t != 'ModStudent' && t != 'ModSummary'){
                hideMod(t)
              }else {
                hideMod(t, true)
              }
            }
          } else {
            for(let i = 0; i < mods.length; i ++) {
              let t = mods[i]
              if(t == name){
                hideMod(t)
              }else {
                hideMod(t, true)
              }
            }
          }
        }
        if(firstInFlag) {
          let lessonMod = getMod('ModLesson')
          let animations = self.modData.lesson.animations
          let len = animations.length
          if(lessonMod && lessonMod.parentNode != null) {
            if(len == 0) {
              let htm = '<div class="el-row mod-full-width-0-0-32">'
                        + '<div class="no-data">There are no related animations.</div>'
                      + '</div>'
              lessonMod.parentNode.appendChild(createMod('ModAnimations', htm))
            } else {
              let html = '<div class="el-row mod-full-width-0-0-32 animations-list">'
              for(let i = 0; i < len; i++) {
                let item = animations[i];
                html += '<div class="el-col el-col-12 el-col-xs-12 el-col-sm-8 el-col-lg-8">'
                          + '<a href="'+ item.animation +'" target="_blank" class="animations-cover">'
                           + '<div style="background-image: url('+ item.coverImage +')"></div>'
                          + '</a>'
                          + '<a href="'+ item.animation +'" target="_blank" class="animations-title">'+ item.title +'</a>'
                      + '</div>';
              }
              html += '</div>';

              lessonMod.parentNode.appendChild(createMod('ModAnimations', html))
            }
          }
          let eles = document.getElementsByTagName('div')
          for(let i = 0; i < eles.length; i++) {
            let ele = eles[i]
            let modName = ele.getAttribute('data-mod')
            if(modName != null && modName != '' && modName != undefined && modName != 'ModLesson'){
              mods.push(modName)
            }
          }
          firstInFlag = false
        }
        switch( tab.name ){
          case 'first': // Overview
            sliceMod('ModOverview')
            break;
          case 'second': // Ralated Animations
            sliceMod('ModAnimations')
            break;
          case 'third': // Student's Performance
            sliceMod('ModStudent')
            break;
          case 'fourth': // Summary
            sliceMod('ModSummary')
            break;
        }
      }

      options.playClick = function() {
        console.log('Play Click')
        // 生成一个 Record，返回做题的地址
        // 如存在课程总结 params 追加一个 lessonPerformance
        if(self.isLogined) {
          let btnPaly = document.getElementById('btnPlay');
          let params = {}
          params.username = self.username
          params.lessonUrl = self.activePageUrl
          params.lessonTitle = self.modData.lesson.Title
          params.lessonCover = self.modData.lesson.CoverImageOfTheLesson
          params.goals = self.modData.lesson.LessonGoals
          params.lessonNo = self.modData.lesson.LessonNo
          let quizs = getMods('ModQuiz')
          let lessonGet = getMod('ModLessonGet')
          let lessonPerformance = ''
          if(lessonGet) {
            let eles = lessonGet.getElementsByTagName('pre')
            for(let i =0; i < eles.length; i++) {
              let ele = eles[i]
              if(ele.getAttribute('class')=='content'){
                lessonPerformance = ele.innerText
              }
            }
            params.lessonPerformance = lessonPerformance
          }
          console.log(quizs)
          // lessonPerformance、
          console.log(params)
          axios.post(lessonHost + '/api/record/saveOrUpdate', qs.stringify(params),
            {
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(response => {
              let r = response.data
              if(r.err == 0) {
                // TODO:open客户端传递我们的地址，启动一个 timer: record/learnDetailBySn 如果 record 已经状态变为结束 View Summary
                let mRecordSn =  r.data.recordSn
                btnPaly.setAttribute("disabled","true")
                window.open(r.data.url + '?device=pc&sn=' + mRecordSn,'_blank')
                let timerLearnState = setInterval( function () {
                  // record/learnDetailBySn 获取数据后 DOM 操作
                  let params = {
                    params: {sn: mRecordSn }
                  }
                  axios.get(lessonHost + '/api/record/learnDetailBySn', params)
                    .then(response => {
                      let r = response.data
                      if(r.data.state == 2) {
                        // 自学已结束，嵌入自学的 Summary 页面 /learnedRecord/1184
                        let summaryMod = getMod('ModSummary')
                        document.domain = 'localhost'; // TODO: 后面需要修改为 keepwork
                        let link = lessonHost + '/learnedRecord/' + mRecordSn;
                        summaryMod.innerHTML = "<iframe id='summaryContainer' frameborder='0' width='100%' src = "+ link +"></iframe>";
                        clearInterval(timerLearnState)
                      }
                    })
                }, 5000) // 5s
              }
            })
        } else {
          self.$message.error("未登录~");
        }
      }
      options.classOpClick = function() {
        btnClass = document.getElementById('btnClass');
        let params = {}
        // let tipClass = document.getElementById('tipClass')
        params.username = self.username
        params.lessonNo = self.modData.lesson.LessonNo
        params.lessonUrl = self.activePageUrl
        params.lessonTitle = self.modData.lesson.Title
        params.lessonCover = self.modData.lesson.CoverImageOfTheLesson
        params.goals = self.modData.lesson.LessonGoals
        let lessonGet = getMod('ModLessonGet')
        let lessonPerformance = ''
        if(lessonGet) {
          let eles = lessonGet.getElementsByTagName('pre')
          for(let i =0; i < eles.length; i++) {
            let ele = eles[i]
            if(ele.getAttribute('class')=='content'){
              lessonPerformance = ele.innerText
            }
          }
          params.lessonPerformance = lessonPerformance
          params.quizNum = getMods('ModQuiz').length
        }
        if( classState == 0 ) {
          // begin class
          axios.post(lessonHost + '/api/class/begin', qs.stringify(params),
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          })
          .then(response => {
            let r = response.data
            if(r.err == 0) {
              beginClass(r.data.classId);
            } else {
              // error
            }
          })
        } else if ( classState == 1 ) {
          // finish class
          console.log(this);
          btnClass.lastChild.innerText = 'Dismiss the Class';
          self.$confirm('Are you sure you want to dismiss the class? It is irrevocable.', 'Info', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            // yes
            axios.post(lessonHost + '/api/class/finish', qs.stringify(params),
            {
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(response => {
              let r = response.data
              // 展现 Summary 数据
              timer.stop()
              let summaryMod = getMod('ModSummary')
              if(r.data) {
                document.domain = 'localhost';// TODO: 后面需要修改为 keepwork
                let link = lessonHost + '/taughtedRecord/' + r.data.classId;
                summaryMod.innerHTML = "<iframe id='summaryContainer' frameborder='0' width='100%' src = "+ link +"></iframe>";
              }
            })
            btnClass.setAttribute('disabled','true')
          }).catch(() => {
            // cancel
          })
        }
      }
      return options
    }
  }
}
</script>

<style lang="scss">
 [data-mod="ModLesson"] {
   padding-bottom: 0;

 }
.text-right {
  text-align: right;
}

.animations-list {
    padding: 0 60px 20px;
}

.animations-list .el-col {
  padding: 20px 16px 15px;
}

.animations-cover {
  display: block;
  height: 160px;
}

.animations-cover > div{
    width: 100%;
    height: 100%;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 6px;
    -webkit-border-radius: 6px;
    position: relative;
}

.animations-cover:hover div:before {
    content: "";
    width: 64px;
    height: 64px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 2;
    background: url('/static/adi/lesson/play_btn_action.png') center center no-repeat;
    background-size: contain;
}

.animations-title {
    display: block;
    margin-top: 12px;
    color: #333;
    font-size: 17px;
    text-decoration: none;
    text-align: center;
}

.animations-title:hover {
   color: #409EFE;
}

.no-data {
  padding-top: 230px;
  margin: 5% auto;
  background: url(/static/adi/lesson/search.png) no-repeat top center;
  background-size: 200px;
  font-size: 24px;
  line-height: 30px;
  color: #b8b8b8;
  text-align: center;
}
.student-taughted-details {
    padding: 40px 20px;
    min-height: 500px;
    box-sizing: border-box;
}
.express >span {
    margin-right: 10px;
    font-size: 14px;
    color: #676767;
}
.express span.r::before, .express span.w::before {
    content: "";
    width: 12px;
    height: 12px;
    display: inline-block;
    margin: 0 15px;
    vertical-align: middle;
    border-radius:50%;
}
span.r::before {
    background-color: #27CE2F;
}
span.w::before {
    background-color: #F53838;
}
.table-wrap {
    margin-top: 15px;
    width: 100%;
    border:1px solid #BFBFBF;
    border-radius: 8px;
}

.table-wrap td {
    height: 50px;
    padding: 8px 5px;
    text-align: center;
    font-size: 14px;
}

.table-wrap thead td {
    position: relative;
    border-right:1px solid #BFBFBF;
    border-bottom: 2px solid #bfbfbf;
    font-size: 16px;
    color:#333;
}
.table-wrap thead td:hover .quizContent {
  display:block;
}

.table-wrap .quizContent {
    display: none;
    position: absolute;
    top: 70px;
    background-color: #fff;
    border: 2px solid #98CBFF;
    border-radius: 4px;
    width: 100%;
    min-width: 380px;
    right: 0;
    padding: 15px 10px 0;
    text-align: left;
    font-size: 14px;
    color: #101010;
}
.table-wrap .quizContent .title {
    font-size: 15px;
    font-weight: bold;
}

.table-wrap .quizContent .opt-item {
  margin: 15px 0;
}
.table-wrap .quizContent .opt-item.state {
  color: #27CE2F;
}

.table-wrap .quizContent.quizContent::before {
  content: "";
  position: absolute;
  border: 2px solid #98cbff;
  width: 20px;
  height: 20px;
  border-left: 0;
  border-bottom: 0;
  transform: rotate(-45deg);
  right: 60px;
  background-color: #fff;
  top: -13px;
}

.table-wrap thead td:last-child {
    border-right: none;
}

.table-wrap .sort-btn {
    display: flex;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    user-select: none;
    justify-content: center;
}

.table-wrap .sort-icon {
    padding-left: 5px;
}

.table-wrap .sort-icon i {
   display: block;
   line-height: 8px;
   color: #CCC;
}

.table-wrap .sort-icon i.active{
    color: #49A5F8;
}

.table-wrap .sort-by-quiz i {
    color: #F53838;
}
.table-wrap .sort-by-quiz i.active {
    color: #27CE2F;
}

.table-wrap tbody tr:nth-child(even) {
    background:rgba(64,158,254, .1);
}

.table-wrap .user-img {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    border-radius:50%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
}
.table-wrap .right {
    color: #27CE2F;
}
.table-wrap .wrong {
    color: #F53838;
}
.el-notification {
    overflow: inherit;
}
.el-notification:hover .showMessage .prompt{
    display: block;
}
.el-notification__content .showMessage {
    position: relative;
}
.el-notification__content .showMessage .prompt {
    display: none;
    top: 40px;
    left: 0;
    z-index: 9;
}
.el-notification__content .showMessage .prompt::after {
    content: "";
    position: absolute;
    top: -15px;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 8px;
    -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    border-bottom-color: #b3b4b7;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-color: #fff;
}
.el-notification__content .showMessage > strong{
    color: #FF414A;
    font-weight: bold;
}
.txt-one {
  padding: 10px 10px 15px;
  font-size: 16px;
  color: #000;
}
.txt-two {
  padding: 10px 10px 15px;
  font-size: 14px;
  color:#999;
}
.txt-one a {
  text-decoration: none;
  color: #409EFF;
}
.txt-one span, .txt-two span {
  color: #F75858;
}
</style>
