<template>

  <el-row class="index-page-lesson">
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%">
      <video controls="" width="100%" autoplay="" name="media"><source :src="properties.AnimationOfTheLesson" type="video/mp4"></video>
    </el-dialog>

    <div class="lesson-container">
      <el-row type="flex" class="mod-full-width-0-0-32">
        <el-col class="lesson-cover" @click.native="openAnimations()" :style="loadCover()"></el-col>
        <el-col>
          <div class="lessonDesc">
            <div class="lesson-title">Lesson {{properties.LessonNo}}: {{properties.Title}}</div>
            <div class="lesson-goals-title">
              Lesson Goals:
              <pre class="lesson-goals">{{properties.LessonGoals}}</pre>
            </div>
            <el-row class="lesson-button">
              <el-button @click="playClick" type="primary" id="btnPlay" >Play Paracraft</el-button>
              <el-tooltip class="item" effect="dark" :content="btnTip" v-if="properties.vip" placement="top">
                <el-button class="btn-begin" @click="classOpClick" type="primary" plain id="btnClass">{{btnInfo}}</el-button>
              </el-tooltip>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-row class="lesson-tab mod-full-width-0-0-32">
      <el-tabs value="first" @tab-click="tabClick">
        <div v-if="properties.vip || isShowStudent" class="student-info">learning:<span class="student-learning">0</span>,&nbsp;&nbsp;Leave learning page:<span class="student-leave">0</span>, &nbsp;&nbsp;Offline:<span class="student-offline">0</span></div>
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
  data() {
    return {
      dialogVisible: false,
      isShowStudent: false,
      btnInfo: 'Begin the Class',
      btnTip: '(Click here to begin the class)'
    };
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      userInfo: 'user/info'
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
        'background-color': '#eee',
        'opacity':'0.8',
        'border-radius': '8px'
      })
    },
    tabClick(tab) {
      this.options.tabClick(tab);
      if(tab.name !== 'third') {
          this.isShowStudent = true;
      }else{
          this.isShowStudent = false;
      }
    },
    playClick() {
      this.options.playClick()
    },
    classOpClick() {
      this.options.classOpClick()
    },
    openAnimations() {
      this.dialogVisible = true;
    }
  },
  created: function() {
    const lessonHost = 'http://127.0.0.1:3000'
    let username = this.username
    if (location.href.indexOf('editor.html') === -1 && location.href.indexOf('viewport.html') === -1) {
      if (username) {
        axios.get(lessonHost + '/api/member/auth', {
          params: {
            username: username,
            portrait: this.userInfo.userinfo.portrait
          }
        }).then(response => {
          let r = response.data
          if (r.data && r.data.vipDay >= 0) {
            this.options.updateVipView()
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
  .el-main.index-page-main {
    background-color: #fbfbfb;
  }
  .maxwidth-template .el-main {
    max-width:100%;
  }
  .lesson-tab {
    margin-top: 20px;
    background-color: #fff;
  }
  .lesson-container {
    background-color:#fff;
    padding: 40px 0;
  }

  .lesson-cover {
    height:340px;
    min-width: 400px;
    position: relative;
    cursor: pointer;
  }
  .lesson-cover::after{
    content: "";
    width: 100px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 2;
    background: url('/static/adi/lesson/play_btn_action.png') center center no-repeat;
    background-size: contain;
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
    margin-top: 15px;
    font-family: inherit;
    font-size: 16px;
    word-wrap: break-word;
    white-space: pre-wrap;
    line-height: 1.5;
  }

  .lesson-goals li {
    color:#4C4C4C;
    line-height:24px;
    font-size:16px;
    margin-bottom: 10px;
  }
  .el-button:disabled {
    background:#D2D2D2;
    border: 1px solid #D2D2D2;
    cursor: not-allowed;
    color: white;
    pointer-events: none;
  }
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__item {
    padding: 0 20px !important;
    margin: 0 2%;
    font-size: 20px;
    height: 53px;
    line-height:53px;
  }
  .el-tabs__active-bar {
    display:none;
  }
  .el-tabs__nav {
    float: none;
    display: flex;
    justify-content: center;
  }
  .el-tabs__item.is-active::after {
    content:"";
    position: absolute;
    bottom: 0;
    left: 0;
    width:100%;
    height: 2px;
    background-color: #409EFF;
    z-index: 1;
  }
  .el-tabs__content {
    overflow: inherit;
  }

  .student-info {
    position: absolute;
    top: -16px;
    left: 51%;
    z-index: 99;
    color: #000;
    font-size: 12px;
    color: #409EFE;
  }

  .student-info span {
    color: #FF414A;
  }

  .el-main [mod-container] > div:not([data-mod="ModLesson"]) > div {
    background-color:#fff;
  }

</style>

