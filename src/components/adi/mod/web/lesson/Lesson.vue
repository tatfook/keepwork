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
        ele.setAttribute('hidden', 'hidden')
      }else {
        ele.removeAttribute('hidden')
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

const lessonHost = 'http://127.0.0.1:3000'
let vuex = {}
let firstInFlag = true

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
                        + '<div class="no-data">no summary.</div>'
                      + '</div>';
      lessonMod.parentNode.appendChild(createMod('ModStudent', studentHtm));
      lessonMod.parentNode.appendChild(createMod('ModSummary', summaryHtm));
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
  start: function(username) {
    this.timeoutObj = setInterval( function () {
      // /class/performance 获取数据后 DOM 操作
      let params = {username: username}
      axios.post(lessonHost + '/api/class/performance', qs.stringify(params),
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(response => {
          let r = response.data;
          let theadHtm = '', tbodyHtm = '', quizzHtm = [''], myanswer = '', quizzNo = '';  //thead tbody 题目答案 题目编号
          let total = 0, progress = 0, count = 0; // 题目总数 答题进度 答题数量

          if(r.data) {
            let data = r.data;
            for(var i in data) {
              let answerItem = data[i].answerSheet;
              if(answerItem) {
                for(let j = 0; j < answerItem.length; j++) {
                  myanswer = answerItem[j].myAnswer ? answerItem[j].myAnswer : " ";
                  quizzHtm[i] += '<td class="' + (answerItem[j].trueFlag ? 'right' : 'wrong') + '">'+ myanswer +'</td>'; // 对错样式
                  total = answerItem.length; // 题目总计
                }
              }

             if(data[i].rightCount || data[i].wrongCount) {
               count =  parseInt(data[i].rightCount) + parseInt(data[i].wrongCount);
             }
              progress = count + '/' + total; // 完成进度
              if(total != 0 && count === total) {
                progress = "finished";
              }

              tbodyHtm += '<tr><td>'+ data[i].username +'</td>'
                             + '<td>'+ data[i].studentNo +'</td>'
                             + '<td>'+ progress +'</td>'
                             + quizzHtm[i]
                        + '</tr>';
            }

            theadHtm = '<td><div class="sort-btn sort-by-name"><span>Name</span><span class="sort-icon"><i class="el-icon-caret-top active"></i><i class="el-icon-caret-bottom"></i></span></div></td>'
                              + '<td><div class="sort-btn sort-by-no"><span>Student No.</span><span class="sort-icon"><i class="el-icon-caret-top active"></i><i class="el-icon-caret-bottom"></i></span></div></td>'
                              + '<td><div class="sort-btn sort-by-total"><span>Quizzes(Total:'+ total +')</span><span class="sort-icon"><i class="el-icon-caret-top active"></i><i class="el-icon-caret-bottom"></i></span></div></td>';

            for(let i = 0; i < total; i++) { // 题目序号
              quizzNo += '<td><div class="sort-btn sort-by-quizz'+ parseInt(i+1) +'"><span>Quiz'+ parseInt(i+1) +'</span><span class="sort-icon"><i class="el-icon-caret-top active"></i><i class="el-icon-caret-bottom"></i></span></div></td>';
            }

            document.querySelector(".student-taughted-details .tbl-head").innerHTML = theadHtm + quizzNo;  // 表格头部
            document.querySelector(".student-taughted-details .tbl-body").innerHTML = tbodyHtm // 表格主体

          }
        })
    }, this.timeout)
  },
  stop: function() {
    clearInterval(this.timeoutObj)
  }
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
      let self = this
      options = _.merge(options, this.generateOptionsStyle(name))
      const mods = []
      options.defaultCover = require('@/../static/adi/imgLoop/imgCarouselOne.jpg')
      options.tempAnimations = []
      // Tab 被点击的回调
      options.tabClick = function(tab) {
        // 切换显示的页卡
        const sliceMod = function(name) {
           // ["ModLesson", "ModMarkdown", "ModQuizz", "ModAnimations", "ModStudent", "ModSummary", "ModAnimations", "ModStudent", "ModSummary"]
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
                        + '<div class="no-data">no animations</div>'
                      + '</div>'
              lessonMod.parentNode.appendChild(createMod('ModAnimations', htm))
            } else {
              let html = '<div class="el-row mod-full-width-0-0-32 animations-list">'
              for(let i = 0; i < len; i++) {
                let item = animations[i];
                html += '<div class="el-col el-col-12 el-col-xs-12 el-col-sm-8 el-col-lg-8">'
                          + '<a href="'+ item.animation +'" class="animations-cover">'
                           + '<div style="background-image: url('+ item.coverImage +')"></div>'
                          + '</a>'
                          + '<a href="'+ item.animation +'" class="animations-title">'+ item.title +'</a>'
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
            console.log(self.modData.lesson.animations)
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
        // TODO: 如存在课程总结 params 追加一个 lessonPerformance
        if(self.isLogined) {
          let params = {}
          params.username = self.username
          params.lessonUrl = self.activePageUrl
          params.lessonTitle = self.modData.lesson.Title
          params.lessonCover = self.modData.lesson.CoverImageOfTheLesson
          params.goals = self.modData.lesson.LessonGoals
          params.lessonNo = self.modData.lesson.LessonNo
          let quizzs = getMods('ModQuizz')
          let lessonGet = getMod('ModLessonGet')
          let lessonPerformance = ''
          if(lessonGet) {
            let eles = lessonGet.getElementsByTagName('div')
            for(let i =0; i < eles.length; i++) {
              let ele = eles[i]
              if(ele.getAttribute('class')=='content'){
                lessonPerformance = ele.innerText
              }
            }
            params.lessonPerformance = lessonPerformance
          }
          console.log(quizzs)
          // lessonPerformance、
          console.log(params)
          axios.post(lessonHost + '/api/record/saveOrUpdate', qs.stringify(params),
            {
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then(response => {
              console.log(response)
              let r = response.data
              if(r.err == 0) {
                // TODO:open客户端传递我们的地址
                window.location = r.data.url + '?device=pc&sn=' + r.data.recordSn
              }
            })
        } else {
          console.log('未登录')
        }
      }

      let classState = 0 // 0 未开始 1 已开始 2 已结束
      let classId
      options.classOpClick = function() {
        console.log('class Op Click')
        let params = {}
        let btnClass = document.getElementById('btnClass')
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
          let eles = lessonGet.getElementsByTagName('div')
          for(let i =0; i < eles.length; i++) {
            let ele = eles[i]
            if(ele.getAttribute('class')=='content'){
              lessonPerformance = ele.innerText
            }
          }
          params.lessonPerformance = lessonPerformance
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
              btnClass.lastChild.innerText = 'Dismiss the Class'
              // tipClass.innerText = '(Click here to dismiss the class)'
              classState = 1
              classId = r.data.classId
              // TODO: 开始轮询获取 Students' Performance 数据
              timer.reset().start(self.username)
              // 弹窗显示 ClassId
              self.$alert("The class ID is " + r.data.classId + ".<br/>Please let your students login with this identifier to play paracraft. And you could view students' real-time information below the menu Students' Performance.OK<br/>Attention: Class ID is the unique identifier for this class. Students in this class need to login with this identifier to start learning the lesson. This ensures the student learning data is sent to the system correctly.", 'Info', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: 'OK',
                callback: action => {
                  self.$notify({
                    title: 'ClassId:',
                    message: r.data.classId,
                    duration: 0,
                    showClose: false
                  })
                }
              });

               let studentMod = getMod('ModStudent');
               let studetDataHtm = '<div class="student-taughted-details">'
                      + '<div class="express">'
                        + '<span class="r">right</span>'
                        + '<span class="w">wrong</span>'
                    + '</div>'
                    + '<table class="table-wrap" cellspacing="0" border="0">'
                        + '<thead>'
                          + '<tr class="tbl-head"></tr>'
                        + '</thead>'
                        + '<tbody class="tbl-body"></tbody>'
                    + '</table>'
                + '</div>';

                studentMod.innerHTML = studetDataHtm;

            } else {
              // error
            }
          })
        } else if ( classState == 1 ) {
          // finish class
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
              console.log(r)
              // TODO: 展现 Summary 数据
              timer.stop()
              let summaryMod = getMod('ModSummary')
              if(r.data) {
                let htm = ''
                summaryMod.innerHTML = JSON.stringify(r.data)
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
    background-size: contain
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
    margin-top: 40px;
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
    border-right:1px solid #BFBFBF;
    border-bottom: 2px solid #bfbfbf;
    font-size: 16px;
    color:#333;
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

.table-wrap .sort-icon.active i{
    color: #49A5F8;
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

</style>
