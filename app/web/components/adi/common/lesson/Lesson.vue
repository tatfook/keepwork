<template>
  <el-row class="index-page-lesson" wdith="1080px">
    <div class="lesson-container">
      <el-row type="flex" class="mod-full-width-0-0-65">
        <el-col class="lesson-cover">
          <img class="lesson-cover-image" :src="lessonCoverUrl">
        </el-col>
        <el-col>
          <div class="lessonDesc">
            <div class="lesson-info title">
              {{$t('card.lesson')}} {{lessonNo}}: {{lessonName}}
            </div>
            <div class="lesson-info intro">
              <div class="intro-title">
                {{$t('lesson.intro')}}:
              </div>
              <el-scrollbar class="intro-list" :native="false">
                {{lessonGoals}}
              </el-scrollbar>
            </div>
            <div class="lesson-info duration">{{$t('lesson.duration')}}: {{lessonDuration}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-row>
</template>

<script>
import _ from 'lodash'
import compBaseMixin from '../comp.base.mixin'
import { mapGetters } from 'vuex'
import { lesson } from '@/api'
export default {
  name: 'AdiLesson',
  mixins: [compBaseMixin],
  data() {
    return {
      isLinked: false,
      lessonData: {}
    }
  },
  watch: {
    async updated(value) {
      await this.getLessonData()
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
    lessonNo() {
      return this.lessonData.id
    },
    lessonGoals() {
      return this.lessonData.goals
    },
    lessonDuration() {
      let durationKey = this.lessonData.duration || '45min'
      return this.$t(`lesson.${durationKey}`)
    },
    lessonExtra() {
      return this.lessonData.extra || {}
    },
    lessonCoverUrl() {
      return this.lessonExtra.coverUrl
    },
    updated() {
      return this.properties.updated
        ? this.properties.updated
        : this.options.updated
    }
  },
  async mounted() {
    this.getLessonData()
  },
  methods: {
    async getLessonData() {
      let origin = window.location.origin
      const url = `${origin}${this.activePageUrl}`
      const [urls, coursewares] = await Promise.all([
        lesson.lessons.lessonDetailByUrl({ url }),
        lesson.lessons.lessonDetailByUrl({ coursewareUrl: url })
      ])
      if (urls.rows.length) {
        this.lessonData = _.get(urls, 'rows[0]', {})
      }
      if (coursewares.rows.length) {
        this.lessonData = _.get(coursewares, 'rows[0]', {})
      }
    },
    loadCover() {
      return this.generateStyleString({
        background: 'url(' + this.lessonCoverUrl + ')',
        'background-position': 'center',
        'background-size': 'contain',
        'background-color': '#eee',
        'background-repeat': 'no-repeat',
        opacity: '0.8',
        'border-radius': '8px'
      })
    }
  }
}
</script>

<style lang="scss">
.index-page-lesson {
  .el-main {
    background-color: #fbfbfb;
    padding: 0;
  }

  .lesson-button {
    .el-button {
      margin-right: 10px;
      margin-top: 10px;
      margin-left: 0;
    }
  }

  .lessonDesc {
    .el-scrollbar__wrap {
      overflow-x: hidden;
      word-break: break-all;
    }
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

  .el-main [mod-container] > div:not([data-mod='ModLesson']) > div {
    background-color: #fff;
  }
}
</style>


<style lang="scss" scoped>
.adi-lesson-button:hover {
  cursor: not-allowed;
  #btnPreview {
    background: #d2d2d2;
    border: 1px solid #d2d2d2;
    cursor: not-allowed;
    color: white;
    pointer-events: none;
  }
}
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
  &-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
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
  background: url('/assets/adi/lesson/play_btn_action.png') center center
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

.lesson-goals li {
  color: #4c4c4c;
  line-height: 24px;
  font-size: 16px;
  margin-bottom: 10px;
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

.lesson-info {
  &.title {
    font-size: 20px;
    color: #4c4c4c;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &.intro {
    margin-top: 20px;
    color: #606266;
    display: flex;
    flex-direction: row;
    .intro-list {
      font-size: 16px;
      max-height: 120px;
      min-height: 80px;
      width: 80%;
      white-space: normal;
      line-height: 30px;
      margin-left: 18px;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }

  &.duration {
    color: #909399;
    font-size: 16px;
  }

  &.skills {
    color: #909399;
    display: flex;
    flex-direction: row;
    .skills-list {
      font-size: 16px;
      height: 140px;
      width: 80%;
      white-space: pre-line;
      line-height: 30px;
      margin-left: 18px;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }
}
</style>

