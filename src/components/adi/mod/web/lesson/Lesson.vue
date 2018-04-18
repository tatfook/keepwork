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
      // Tab 被点击的回调
      options.callback = function(tab) {
        const mods = ['ModMarkdown', 'ModAnimations', 'ModStudent', 'ModSummary']
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
          for(let i = 0; i < mods.length; i ++) {
            let t = mods[i]
            if(t == name){
              hideMod(t)
            }else{
              hideMod(t, true)
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
          lessonMod.parentNode.appendChild(createMod('ModAnimations', "<p>Ralated Animations<p>"))
          lessonMod.parentNode.appendChild(createMod('ModStudent', "<p>Student<p>"))
          lessonMod.parentNode.appendChild(createMod('ModSummary', "<p>Summary<p>"))
          firstInFlag = false
        }
        switch( tab.index ){
          case '0': // Overview
            sliceMod('ModMarkdown')
            break;
          case '1': // Ralated Animations
            sliceMod('ModAnimations')
            break;
          case '2': // Student's Performance
            sliceMod('ModStudent')
            break;
          case '3': // Summary
            sliceMod('ModSummary')
            break;
        }
      }
      return options
    }
  }
}
</script>

<style>
  video {
    height: 200px;
  }
</style>
