<template>
  <div class="comp-teachers" v-if="teacherShow">
    <span>Teachers:</span>
    <pre class="content"> {{properties.content ? properties.content : $t(options.content)}}</pre>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import  { mapGetters} from 'vuex'
import axios from 'axios'

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

const init = function(){
  let lessonMod = getMods('ModLesson');
  let overviewDom = document.getElementById("pane-first");
  let operate = document.getElementById("isTeachersContent");
  let teachersMod = getMods('ModTeachers');
  if(lessonMod.length > 0) {
      if(operate == null || operate == undefined) {
        let div = document.createElement("div");
        let button = document.createElement("button");
        div.setAttribute("class", "text-right");
        button.setAttribute("class", "el-button el-button--primary el-button--small");
        button.setAttribute("id", "isTeachersContent");
        button.innerHTML = "Hide All";
        div.appendChild(button);
        overviewDom.appendChild(div);
      }

      if(teachersMod.length > 0) {
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
  }

}

export default {
  name: 'AdiTeachers',
  mixins: [compBaseMixin],
  computed: {
    ...mapGetters({
      username: 'user/username'
    })
  },
  data () {
    return {
      teacherShow: false
    }
  },
  mounted: function(){
    init()
  },
  created: function() {
    const lessonHost = 'http://127.0.0.1:3000'
    let username = this.username
    if (location.href.indexOf('editor.html') === -1 && location.href.indexOf('viewport.html') === -1) {
      if (username) {
        axios.get(lessonHost + '/api/member/auth', {
          params: {
            username: username
          }
        }).then(response => {
          let r = response.data
          if (r.data && r.data.vipDay >= 0) {
            this.teacherShow = true
          } else {
            this.teacherShow = false
          }
          this.$forceUpdate()
        })
      } else {
        this.teacherShow = false
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style>
  [data-mod="ModTeachers"] {
    padding-top: 0;
    padding-bottom: 0;
  }
  .comp-teachers {
    margin-left: 40px;
    margin-top:25px;
    padding: 5px 3px;
    background:rgba(238,238,238, 0.5);
    border-radius: 4px;
    font-size: 16px;
    line-height:20px;
  }
  .comp-teachers span {
    color: #FF5C5C;
  }

  .comp-teachers .content {
    margin:20px 0 0;
    color: #676767;
    font-family:MicrosoftYaHeiLight;
  }
</style>
