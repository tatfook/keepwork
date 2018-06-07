<template>
  <div class="comp-lesson-share" v-if="show">
    <pre class="content">{{properties.content ? properties.content : $t(options.content)}}</pre>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { mapGetters } from 'vuex'
import axios from 'axios'

const lessonHost = 'http://lesson.keepwork.com/'
export default {
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      isLogined: 'user/isLogined',
      activePageUrl: 'activePageUrl'
    })
  },
  name: 'AdiLessonShare',
  mixins: [compBaseMixin],
  mounted: function() {
    if (location.href.indexOf('editor.html') === -1 && location.href.indexOf('viewport.html') === -1) {
      let query = location.href.split('?')[1]
      if(query && query.indexOf('#') != -1){
        query = query.split('#')[0]
      }
      let lessonUrl = this.activePageUrl.substring(0, this.activePageUrl.length - 6)
      let username
      if(query) {
        query = query.split('&')
        for (var i = 0; i < query.length; i++) {
          var ary = query[i].split('=');
          if (ary[0] == 'username' && ary[1]) {
              username = ary[1];
              break;
          }
        }
      }
      if(username) {
        // TODO: 网络请求获取数据后替换
        let params = {
          params: {
            lessonUrl: lessonUrl,
            username: username
          }
        }
        axios.get(lessonHost + '/api/record/share', params)
          .then(response => {
            let r = response.data
            if(r.err == 0) {
              let mainE = document.getElementsByClassName('el-main')[0]
              let html = mainE.innerHTML
              html = html.replace('{{lessonTitle}}', r.data.lessonTitle)
              html = html.replace('{{learnTime}}', r.data.beginTime)
              html = html.replace('{{username}}', r.data.username)
              html = html.replace('{{learnedDays}}', r.data.learnedDays)
              html = html.replace('{{codeWriteLine}}', r.data.codeWriteLine)
              html = html.replace('{{codeReadLine}}', r.data.codeReadLine)
              html = html.replace('{{commands}}', r.data.commands)
              mainE.innerHTML = html
            }else {
              this.$alert('该地址已失效，请重试', {
                confirmButtonText: '确定'
              });
            }
          })
      }else {
        // 非法链接
        this.$alert('无效的地址，请重试', {
          confirmButtonText: '确定'
        });
      }
      this.show = false
    }else {
      this.show = true
      this.$forceUpdate()
    }
  }
}
</script>

<style>
  [data-mod="ModLessonShare"]{
    padding-top: 0;
    padding-bottom: 0;
  }

  .comp-lesson-share {
    margin: 25px 40px;
  }

  .comp-lesson-share .content {
    margin-top:25px;
    font-size: 16px;
    color:#333;
    font-family: inherit;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

</style>
