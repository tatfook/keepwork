<script>
import _ from 'lodash'
import baseMixin from '../../base/base.mixin'

export default {
  mixins: [baseMixin],
  methods: {
    compWrapperOptions(name) {
      let options = {}
      let self = this
      let firstInFlag = true
      options = _.merge(options, this.generateOptionsStyle(name))
      const mods = []
      // Tab 被点击的回调
      options.tabClick = function(tab) {
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
          console.log("---------------------")
          console.log(mods)
          firstInFlag = false
        }
        switch( tab.index ){
          case '0': // Overview
            sliceMod('ModOverview')
            break;
          case '1': // Ralated Animations
            sliceMod('ModAnimations')
            console.log(self.modData.lesson.animations)
            break;
          case '2': // Student's Performance
            sliceMod('ModStudent')
            break;
          case '3': // Summary
            sliceMod('ModSummary')
            break;
        }
      }

      options.playClick = function() {
        console.log('Play Click')
      }

      options.classOpClick = function() {
        console.log('class Op Click')
      }

      return options
    }
  }
}
</script>
