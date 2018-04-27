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
  }

  let teachersMod = getMods('ModTeachers');
  let overviewDom = document.getElementById("pane-first");
  if(teachersMod.length > 0) {
    let div = document.createElement("div");
    let button = document.createElement("button");
    div.setAttribute("class", "text-right");
    button.setAttribute("class", "el-button el-button--primary");
    button.setAttribute("id", "isTeachersContent");
    button.innerHTML = "Hide All";
    div.appendChild(button);
    overviewDom.appendChild(div);
  }

  let operate = document.getElementById("isTeachersContent");
  operate.addEventListener("click", function(){
    if(operate.innerHTML == "Show All") {
      operate.innerHTML = "Hide All";
      for(let i = 0, len = teachersMod.length; i < len; i++) {
        teachersMod[i].style.display = "block";
      }

    }else {
      operate.innerHTML = "Show All";
      for(let i = 0, len = teachersMod.length; i < len; i++) {
        teachersMod[i].style.display = "none";
      }
    }
  });
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
      // TODO: /class/performance 获取数据后 DOM 操作
      console.log(username)
      let params = {username: username}
      axios.post(lessonHost + '/api/class/performance', qs.stringify(params),
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(response => {
          let r = response.data
          console.log(r)
          let studentMod = getMod('ModStudent')
          if(r.data) {
            studentMod.innerHTML = JSON.stringify(r.data)
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
        const createMod = function(name, html) {
          let ele = document.createElement('div')
          ele.setAttribute('data-mod', name)
          ele.innerHTML = html
          return ele
        }
        if(firstInFlag) {
          let lessonMod = getMod('ModLesson')
          let animations = self.modData.lesson.animations
          let len = animations.length
          if(len == 0) {
            lessonMod.parentNode.appendChild(createMod('ModAnimations', "<p>没有素材<p>"))
          } else {
            let html = ""
            for(let i = 0; i < len; i++) {
              let item = animations[i]
              html += '<p>Animations:' + item.cover + "-" + item.title + "-" + item.animation + '</p><br>'
            }
            lessonMod.parentNode.appendChild(createMod('ModAnimations', html))
          }
          lessonMod.parentNode.appendChild(createMod('ModStudent', "<p>Student<p>"))
          lessonMod.parentNode.appendChild(createMod('ModSummary', "<p>Summary<p>"))
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
        console.log(self.modData)
        // TODO: 生成一个 Record， 返回做题的地址
        if(self.isLogined) {
          let params = {}
          params.username = self.username
          params.lessonUrl = self.activePageUrl
          params.lessonTitle = self.modData.lesson.Title
          params.lessonCover = self.modData.lesson.CoverImageOfTheLesson
          params.goals = self.modData.lesson.LessonGoals
          params.lessonNo = self.modData.lesson.LessonNo
          let quizzs = getMods('ModQuizz');
          console.log(quizzs);
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
        let tipClass = document.getElementById('tipClass')
        params.username = self.username
        params.lessonNo = self.modData.lesson.LessonNo
        params.lessonUrl = self.activePageUrl
        params.lessonTitle = self.modData.lesson.Title
        params.lessonCover = self.modData.lesson.CoverImageOfTheLesson
        params.goals = self.modData.lesson.LessonGoals
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
              tipClass.innerText = '(Click here to dismiss the class)'
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
              })
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
                summaryMod.innerHTML = JSON.stringify(r.data)
              }
            })
            btnClass.setAttribute('disable','true')
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

<style>
  .text-right {
    text-align: right;
  }
</style>
