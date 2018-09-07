<template>

  <el-row class="index-page-lesson" wdith="1080px">
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <video controls="" width="100%" autoplay="" name="media"><source :src="properties.AnimationOfTheLesson" type="video/mp4"></video>
    </el-dialog>

    <div class="lesson-container">
      <el-row type="flex" class="mod-full-width-0-0-65">
        <el-col class="lesson-cover" @click.native="openAnimations()" :style="loadCover()"></el-col>
        <el-col>
          <div class="lessonDesc">
            <div class="lesson-title">{{$t('card.lesson')}} {{lessonName}}</div>
            <div class="lesson-goals-title">
              {{$t('card.lessonGoals')}}
              <el-scrollbar class="lesson-goals" :native="false">
                {{lessonGoals}}
              </el-scrollbar>
            </div>
            <el-row class="lesson-button">
              <el-button @click="previewClick" type="primary" id="btnPreview" v-if="properties">{{$t('lesson.begin')}}</el-button>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>


  </el-row>
</template>

<script>
import _ from 'lodash'
import compBaseMixin from '../comp.base.mixin'
import PreviewData from './PreviewData'
import { mapGetters } from 'vuex'
import { lesson } from '@/api'
export default {
  name: 'AdiLesson',
  mixins: [compBaseMixin],
  data() {
    return {
      dialogVisible: false,
      isLinked: false,
      lessonData: {}
    }
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      activePageUrl: 'activePageUrl'
    }),
    lessonName() {
      return this.lessonData.lessonName
    },
    lessonGoals() {
      return this.lessonData.goals
    },
    lessonSkills() {
      return this.lessonData.skills
    },
    lessonExtra() {
      return this.lessonData.extra
    }
  },
  components: {
    'preview-data': PreviewData
  },
  async mounted() {
    let origin = window.location.origin
    if (origin === 'http://localhost:8080') {
      origin = 'https://stage.keepwork.com'
    }
    await lesson.lessons
      .lessonDetailByUrl({ url: `${origin}${this.activePageUrl}` })
      .then(res => {
        console.log(res)
        this.lessonData = res
        this.isLinked = true
      })
      .catch(e => console.error(e))
  },
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
.no-linked {
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  background: #e6a23c;
  color: white;
  height: 100%;
  padding: 30px 0;
}
.index-page-lesson {
  max-width: 1080px;
  box-sizing: border-box;
  margin: 0 auto;
}
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

