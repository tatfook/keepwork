<template>
  <el-row class="index-page-lesson">
    <el-row type="flex">
      <el-col class="lesson-cover" :style="loadCover()"></el-col>
      <el-col>
        <div class="lessonDesc">
          <div class="lesson-title">Lesson {{properties.LessonNo}}: {{properties.Title}}</div>
          <div class="lesson-goals-title">
            Lesson Goals:
            <ol class="lesson-goals">
              <li>{{properties.LessonGoals}}</li>
            </ol>
          </div>
          <el-row class="lesson-button">
            <el-button @click="playClick" type="primary" id="btnPlay" >Play Paracraft</el-button>
            <el-button class="btn-begin" @click="classOpClick" type="primary" plain id="btnClass">Begin the Class</el-button>
            <!-- <span v-if="properties.vip" id="tipClass">(Click here to begin the class)</span> -->
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-tabs class="tabs" value="first" @tab-click="tabClick">
        <el-tab-pane label="Overview" name="first"></el-tab-pane>
        <el-tab-pane label="Related Animations" name="second"></el-tab-pane>
        <el-tab-pane label="Students' Performance" v-if="properties.vip" name="third"></el-tab-pane>
        <el-tab-pane label="Summary" name="fourth"></el-tab-pane>
      </el-tabs>
    </el-row>
  </el-row>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { mapGetters } from 'vuex'
import axios from 'axios'
export default {
  computed: {
    ...mapGetters({
      username: 'user/username'
    })
  },
  name: 'AdiLesson',
  mixins: [compBaseMixin],
  methods: {
    loadCover() {
      return this.generateStyleString({
        background: 'url(' + this.properties.CoverImageOfTheLesson + ')',
        'background-position': 'center',
        'background-size': 'cover',
        'opacity':'0.8',
        'border-radius': '8px'
      })
    },
    tabClick(tab) {
      this.options.tabClick(tab)
    },
    playClick() {
      this.options.playClick()
    },
    classOpClick() {
      this.options.classOpClick()
    }
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
            this.properties.vip = true
          } else {
            this.properties.vip = false
          }
          this.$forceUpdate()
        })
      } else {
        this.properties.vip = false
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style>
  .lesson-cover {
    height:340px;
  }
  .lessonDesc {
    margin-left: 20px;
    position: relative;
    height: 100%;
  }
  .lesson-button {
    position: absolute;
    bottom: 0;
    z-index: 2;
  }
  .lesson-button .el-button {
    margin-right: 10px;
    margin-top: 10px;
    margin-left: 0;
  }
  .lesson-title {
    margin-bottom: 20px;
    font-size:20px;
    color:#111111;
  }
  .lesson-goals-title {
    font-size:18px;
    color:#4C4C4C;
  }
  .lesson-goals {
    padding-left: 20px;
    margin-top: 20px;
  }

  .lesson-goals li {
    color:#4C4C4C;
    line-height:24px;
    font-size:16px;
    margin-bottom: 10px;
  }
  .tabs {
    padding-top: 20px;
  }
  .btn-begin:disabled {
    background:#D2D2D2;
    cursor: not-allowed;
    color: white;
    pointer-events: none;
  }
</style>

