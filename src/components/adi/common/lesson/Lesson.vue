<template>
  <div class="index-page-lesson">
    <el-row>
      <el-col :span="8">
        <div :style="loadCover()">
          <video :src='properties.AnimationOfTheLesson'></video>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="lessonDesc">
          <span>Lesson {{properties.LessonNo}}: {{properties.Title}}{{properties.vip}}</span><br>
          <span>Lesson Goals:</span><br>
          <span>{{properties.LessonGoals}}</span>
          <el-row>
            <el-button @click="playClick" type="primary" id="btnPlay" >Play Paracraft</el-button>
            <el-button @click="classOpClick" v-if="properties.vip" type="primary" id="btnClass">Begin the Class</el-button>
            <span v-if="properties.vip" id="tipClass">(Click here to begin the class)</span>
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
  </div>
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
        'background-size': 'cover'
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
  .lessonDesc {
    padding-left: 20px;
  }
</style>

