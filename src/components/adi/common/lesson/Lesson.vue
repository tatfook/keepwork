<template>

  <el-row class="index-page-lesson">
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <video controls="" width="100%" autoplay="" name="media"><source :src="properties.AnimationOfTheLesson" type="video/mp4"></video>
    </el-dialog>

    <div class="lesson-container">
      <el-row type="flex" class="mod-full-width-0-0-65">
        <el-col class="lesson-cover" @click.native="openAnimations()" :style="loadCover()"></el-col>
        <el-col>
          <div class="lessonDesc">
            <div class="lesson-title">{{$t('card.lesson')}} {{properties.LessonNo}}: {{properties.Title}}</div>
            <div class="lesson-goals-title">
              {{$t('card.lessonGoals')}}
              <el-scrollbar class="lesson-goals" :native="false">
                {{properties.LessonGoals}}
              </el-scrollbar>
            </div>
            <el-row class="lesson-button">
              <el-button @click="previewClick" type="primary" id="btnPreview" v-if="properties">{{$t('card.lessonPreview')}}</el-button>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-row class="lesson-tab mod-full-width-0-0-65">
      <el-tabs v-model="activeTab" @tab-click="tabClick">
        <el-tab-pane :lazy="true" name="first">
          <span class="tab-fake-label" slot='label'>{{$t('card.overview')}}</span>
        </el-tab-pane>
        <el-tab-pane :lazy="true" name="second">
          <span class="tab-fake-label" slot="label">{{$t('card.references')}}</span>
          <preview-data :message="references" />
        </el-tab-pane>
        <el-tab-pane :lazy="true" name="third">
          <!-- <span class="tab-fake-label" :class="{isHidden: !properties.vip}" slot="label"> {{$t('card.studentsPerformance')}}</span> -->
          <span class="tab-fake-label" slot="label"> {{$t('card.studentsPerformance')}}</span>
          <preview-data :message="student" />
        </el-tab-pane>
        <el-tab-pane :lazy="true" name="fourth">
          <span class="tab-fake-label" slot="label">{{$t('card.summary')}}</span>
          <preview-data :message="summary" />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-row>
</template>

<script>
import _ from 'lodash'
import compBaseMixin from '../comp.base.mixin'
import PreviewData from './PreviewData'
import { mapGetters } from 'vuex'
import { lessonAPI } from '@/api'
export default {
  data() {
    return {
      activeTab: 'first',
      dialogVisible: false,
      btnInfo: 'Begin the Class',
      btnTip: '(Click here to begin the class)',
      references: 'There are no references.',
      student:
        "Teaching is not started yet.There is no record of students' performance.",
      summary: 'Teaching is not started yet. There is no summary here.'
    }
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      activePageUrl: 'activePageUrl'
    })
  },
  components: {
    'preview-data': PreviewData
  },
  name: 'AdiLesson',
  mixins: [compBaseMixin],
  async mounted() {},
  methods: {
    loadCover() {
      return this.generateStyleString({
        background: 'url(' + this.properties.CoverImageOfTheLesson + ')',
        'background-position': 'center',
        'background-size': 'cover',
        'background-color': '#eee',
        opacity: '0.8',
        'border-radius': '8px'
      })
    },
    tabClick(tab, event) {
      let modQuizs = document.querySelectorAll('div[data-mod="ModQuiz"]')
      const toggleEles = (eles, flag = false) =>
        eles.forEach(ele => ele.classList[flag ? 'add' : 'remove']('hide'))
      modQuizs && toggleEles(modQuizs, tab.name !== 'first')
    },
    previewClick() {
      window.open(`${this.activePageUrl}?device=pc`, '_blank')
    },
    openAnimations() {
      this.dialogVisible = true
    }
  }
}
</script>

<style>
.hide {
  display: none;
}
.tab-fake-label {
  display: inline-block;
  padding: 0 20px;
  margin: 0 2%;
}
.tab-fake-label.isHidden {
  display: none;
}
.el-main.index-page-main {
  background-color: #fbfbfb;
}
.maxwidth-template .el-main {
  max-width: 100%;
}
.lesson-tab {
  margin-top: 20px;
  background-color: #fff;
}
.lesson-container {
  background-color: #fff;
  padding: 40px 0;
}

.lesson-cover {
  height: 340px;
  min-width: 400px;
  position: relative;
  cursor: pointer;
}
.lesson-cover::after {
  content: '';
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  background: url('/static/adi/lesson/play_btn_action.png') center center
    no-repeat;
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
  font-size: 20px;
  color: #111111;
}
.lesson-goals-title {
  font-size: 18px;
  color: #4c4c4c;
}
.lesson-goals {
  font-family: inherit;
  font-size: 16px;
  white-space: pre-line;
  line-height: 1.5;
  height: 210px;
}
.lesson-goals .el-scrollbar__wrap {
  overflow-x: hidden;
}

.lesson-goals li {
  color: #4c4c4c;
  line-height: 24px;
  font-size: 16px;
  margin-bottom: 10px;
}
.el-button:disabled {
  background: #d2d2d2;
  border: 1px solid #d2d2d2;
  cursor: not-allowed;
  color: white;
  pointer-events: none;
}
.el-tabs__header {
  margin: 0;
}
.el-tabs__item {
  padding: 0;
  font-size: 20px;
  height: 53px;
  line-height: 53px;
}
.el-tabs__active-bar {
  display: none;
}
.el-tabs__nav {
  float: none;
  display: flex;
  justify-content: center;
}
.el-tabs__item.is-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409eff;
  z-index: 1;
}
.el-tabs__content {
  overflow: inherit;
}

.student-info {
  position: absolute;
  top: -16px;
  left: 47%;
  z-index: 99;
  color: #000;
  font-size: 12px;
  color: #409efe;
  display: none;
}

.student-info span {
  color: #ff414a;
}

.el-main [mod-container] > div:not([data-mod='ModLesson']) > div {
  background-color: #fff;
}
</style>

