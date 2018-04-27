<template>
  <div class="comp-teachers">
    <div>Teachers:</div>
    <div class="content"> {{properties.content ? properties.content : $t(options.content)}}</div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

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
        button.setAttribute("class", "el-button el-button--primary");
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
  mounted: function(){
    init()
  }
}
</script>

<style>
  .comp-teachers .content {
    margin-top:25px;
    font-size: 16px;
    color:#333;
  }
</style>
