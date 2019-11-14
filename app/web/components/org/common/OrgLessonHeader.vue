<template>
  <el-row class="lesson-header-container">
    <el-row>
      <el-col :sm="12" :xm="24" class="lesson-cover" :style="loadCover()" @click.native="openAnimations">
        <img v-if="isHasVideo" src="@/assets/lessonImg/play2.png" alt="">
      </el-col>
      <el-col :sm="12" :xm="24" class="lesson-desc">
        <div class="class-id-sign-wrap">
          <div class="class-id-sign"> {{$t('lesson.lessonId')}} {{haqiCode}}</div>
          <el-tooltip placement="bottom">
            <div slot="content" style="max-width: 400px; font-size: 14px; line-height: 18px; padding:10px 20px;">
              <div v-html="$t('lesson.haqiIdExplain')"></div>
            </div>
            <span @click="handleExplanHaqiCode" class="question-mark-icon"></span>
          </el-tooltip>
        </div>

        <div class="lesson-info title">
          {{$t('card.lesson')}} {{lessonNo}}: {{lessonName}}
        </div>
        <div class="lesson-info intro" v-if="lessonGoals">
          <div class="intro-title">
            {{$t('lesson.intro')}}:
          </div>
          <div class="intro-list">
            {{lessonGoals}}
          </div>
        </div>
        <div class="lesson-info duration">
          <div class="duration-title">{{$t('lesson.duration')}}: </div>
          <div>{{lessonDuration}}</div>
        </div>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import colI18n from '@/lib/utils/i18n/column'
export default {
  name: 'LessonHeader',
  filters: {
    idPretty(value) {
      return _.map(_.chunk(value.toString().split(''), 3), i =>
        i.join('')
      ).join(' ')
    }
  },
  props: {
    lesson: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      classIdDialogVisible: false,
      classIdFullScreen: false,
      _interval: null,
      isLoading: false
    }
  },
  methods: {
    generateStyleString(style) {
      let string = ''
      _.forEach(style, (value, key) => {
        string = string + key + ':' + value + ';'
      })
      return string
    },
    loadCover() {
      return this.generateStyleString({
        background: 'url(' + this.coverUrl + ')',
        'background-position': 'center',
        'background-size': 'cover',
        'background-color': '#eee',
        opacity: '0.8',
        'border-radius': '8px'
      })
    },
    openAnimations() {
      this.isHasVideo && (this.dialogVisible = true)
    },
    classIdToFullScreen() {
      this.classIdFullScreen = true
    },
    handleExplanHaqiCode() {
      let helpUrl = 'https://keepwork.com/lesson9527/lessons/help_lessonID '
      window.open(helpUrl)
    },
    handleNoStatedTips() {
      this.$message({
        type: 'warning',
        message: '本学期还未开始'
      })
    }
  },
  computed: {
    ...mapGetters({
      userIsTeacher: 'org/isTeacher',
      orgClasses: 'org/teacher/orgClasses'
    }),
    codeReadLine() {
      return _.get(this.lesson, 'CodeReadLine', 0)
    },
    commands() {
      return _.get(this.lesson, 'Commands', 0)
    },
    codeWriteLine() {
      return _.get(this.lesson, 'CodeWriteLine', 0)
    },
    lessonName() {
      return _.get(this.lesson, 'lessonName', '')
    },
    lessonNo() {
      return _.get(this.lesson, 'packageIndex', '')
    },
    lessonGoals() {
      return _.get(this.lesson, 'goals', '')
    },
    lessonDuration() {
      let durationKey = this.lesson.duration || '45min'
      return this.$t(`lesson.${durationKey}`)
    },
    title() {
      return _.get(this.lesson, 'Title', '')
    },
    coverUrl() {
      return _.get(this.lesson, 'coverUrl', '')
    },
    haqiCode() {
      const { packageId = 0, lessonId = 0 } = this.$route.params
      return `${packageId}x${lessonId}`
    },
    className() {
      return _.get(
        _.find(
          this.orgClasses,
          item => item.id === _.toNumber(_.get(this.$route, 'params.classId'))
        ),
        'name',
        ''
      )
    }
  }
}
</script>


<style lang="scss">
.lesson-header-container {
  max-width: 1229px;
  margin: 50px auto;
  $green: #66cd2e;
  $grey: #d2d2d2;
  .class-id-dialog {
    .class-id {
      color: #f75858;
      font-weight: bold;
      font-size: 22px;
    }
    .performance {
      color: #1982ff;
      font-weight: 500;
    }
    .tips {
      margin-top: 20px;
      color: #a9a9a9;
      .attention {
        color: #f75858;
      }
    }
  }

  .lesson-cover {
    height: 340px;
    max-width: 600px;
    cursor: pointer;
    background: #eee;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lesson-desc {
    padding-left: 28px;
    box-sizing: border-box;
    position: relative;
    height: 340px;
    .class-id-sign-wrap {
      display: flex;
      align-items: center;
      position: absolute;
      top: -36px;
      .class-id-sign {
        font-size: 20px;
        background: #ed9f21;
        display: inline-block;
        padding: 1px 10px;
        border-radius: 3px;
        color: white;
        cursor: pointer;
      }
      .question-mark-icon {
        display: inline-block;
        cursor: pointer;
        width: 32px;
        height: 32px;
        margin-left: 5px;
        background: url('../../../assets/lessonImg/question_mark.png') no-repeat
          center center;
      }
    }

    .lesson-info {
      display: flex;
      margin-top: 10px;
      &.title {
        font-size: 20px;
        color: #111;
        width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: 'MicrosoftYaHei';
      }
      &.intro {
        color: #4c4c4c;
        font-size: 18px;
        .intro-title {
          margin-right: 10px;
        }
        .intro-list {
          flex: 1;
          line-height: 26px;
          max-height: 78px;
          word-break: break-all;
          overflow-x: none;
          overflow-y: auto;
        }
      }

      &.duration {
        color: #4c4c4c;
        font-size: 16px;
        .duration-title {
          margin-right: 10px;
        }
      }

      &.skills {
        color: #4c4c4c;
        display: flex;
        flex-direction: row;
        .skills-list {
          font-size: 16px;
          height: 90px;
          width: 70%;
          white-space: pre-line;
          line-height: 26px;
          margin-left: 12px;
          &.reset-height {
            height: 100px;
          }
          .el-scrollbar__wrap {
            overflow-x: hidden;
          }
        }
      }
    }
  }
  .lesson-button-wrap {
    margin: 10px 0;
    position: absolute;
    bottom: 0;
    .lesson-button {
      height: 36px;
      width: 190px;
      position: static;
      &.no-started {
        color: #fff;
        background-color: #a0cfff;
        border-color: #a0cfff;
      }
      &.class-is-over {
        background: #d2d2d2;
        border-color: #d2d2d2;
      }
    }
    .lesson-button-tips {
      color: #a9a9a9;
      font-size: 14px;
      margin-left: 5px;
    }
  }
  .lesson-progress-wrap {
    box-sizing: border-box;
    // background: #f8f8f8;
    padding: 26px 20px;
    display: flex;
    align-items: center;
    &.el-row {
      // fix inline elrow style margin-left and right -10px;
      margin: 0 !important;
    }
    .lesson-references {
      display: flex;
      justify-content: flex-end;
    }
  }

  .class-id-dialog {
    .lesson-confirm-button {
      height: 42px;
      width: 158px;
      font-size: 18px;
    }
  }
  .class-id-full-page {
    display: flex;
    align-items: center;
    justify-content: center;
    .full-font {
      font-size: 15vw;
      font-weight: bold;
    }
  }
}
@media screen and (max-width: 768px) {
  .lesson-header-container {
    .lesson-cover {
      height: 200px;
      width: 80%;
      margin: 0 10px;
    }
    &-video {
      .el-dialog {
        width: 90% !important;
      }
    }
    .lesson-progress-wrap {
      &.el-row {
        padding: 16px;
      }
    }
  }
  .teach-function-style {
    max-width: 86%;
  }
  .class-id-dialog {
    max-width: 90%;
  }
  .dismiss-class {
    max-width: 90%;
  }
}
</style>



