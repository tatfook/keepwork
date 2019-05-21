<template>
  <div :class="['student-summary-wrap', {'min': !isShowTitle}]">
    <div v-if="isShowTitle" class="summary-title">{{summary.name}}</div>
    <div class="summary-body">
      <div class="word first" v-html="$t('lesson.StudiedForManyDays', {howManyDays: `<span class='highlight'> ${day} </span>`,lessonTitle: `<span class='highlight'> ${summary.name} </span>`})">
      </div>
      <!-- <div v-if="isHasSkills" class="word second" v-html="$t('lesson.todayRecords', {readCodeLinesCount:`<span class='highlight'>${summary.read}</span>`, wroteCodeLinesCount: `<span class='highlight'>${summary.write}</span>`, commandLines: `<span class='highlight'>${summary.command}</span>`})">
      </div> -->
      <div v-if="isHasSkills" class="word second" v-html="skillsString">
      </div>
    </div>
    <div v-if="isShowShare" class="summary-share" @click="share">
      <span class="summary-share-icon"></span>
      {{$t('lesson.share')}}
    </div>
    <img class="summary-boy" src="../../../assets/lessonImg/summary/boy.png" alt="">
  </div>
</template>

<script>
import { locale } from '@/lib/utils/i18n'
import _ from 'lodash'
export default {
  name: 'StudentSummary',
  props: {
    summary: {},
    isShowShare: {
      type: Boolean,
      default: true
    },
    isShowTitle: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    share() {
      this.$emit('share')
    }
  },
  computed: {
    isEn() {
      return locale === 'en-US'
    },
    day() {
      const suffix = ['', 'st', 'nd', 'rd', 'th']
      let day = this.summary.day
      if (this.isEn) {
        day = day > 3 ? `${day}th` : `${day}${suffix[day]}`
      }
      return day
    },
    skills() {
      const skillName = ['代码阅读量', '代码书写量', '学习指令数']
      return this.summary.skills.filter(
        item => skillName.indexOf(item.skillName) !== -1
      )
    },
    lessonCodeReadLine() {
      let skill = this.skills.find(item => item.skillName == '代码阅读量')
      return skill ? skill.score : null
    },
    lessonWriteLine() {
      let skill = this.skills.find(item => item.skillName === '代码书写量')
      return skill ? skill.score : null
    },
    lessonCommands() {
      let skill = this.skills.find(item => item.skillName === '学习指令数')
      return skill ? skill.score : null
    },
    isHasSkills() {
      return this.skills.length > 0
    },
    isAllSkills() {
      return (
        this.lessonCodeReadLine > 0 &&
        this.lessonWriteLine > 0 &&
        this.lessonCommands
      )
    },
    skillsString() {
      let str = ''
      if (this.isHasSkills) {
        str = this.$t('lesson.todayRecords0')
        str += this.lessonCodeReadLine
          ? this.$t('lesson.todayRecords1', {
              readCodeLinesCount: `<span class='highlight'>${
                this.lessonCodeReadLine
              }</span>`
            }) + ', '
          : ''
        str += this.lessonWriteLine
          ? this.$t('lesson.todayRecords2', {
              wroteCodeLinesCount: `<span class='highlight'>${
                this.lessonWriteLine
              }</span>`
            }) + ', '
          : ''
        str += this.lessonCommands
          ? `${this.isEn && this.isAllSkills ? 'and ' : ''}${this.$t(
              'lesson.todayRecords3',
              {
                commandLines: `<span class='highlight'>${
                  this.lessonCommands
                }</span>`
              }
            )},`
          : ''
      }
      return str.trim().replace(/\,$/, this.isEn ? '.': '。')
    }
  }
}
</script>


<style lang="scss">
$blue: #4093fe;
.student-summary {
  &-wrap {
    border: 16px solid #66cd2e;
    min-height: 330px;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    max-width: 1080px;
    margin: 20px auto;
    padding: 10px;
    &.min {
      min-height: 250px;
    }
    .summary {
      &-title {
        font-size: 28px;
        font-weight: 600;
        max-width: 80%;
        margin-top: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &-body {
        margin: 50px auto 0;
        max-width: 66%;
        .highlight {
          color: #ec761a;
          font-weight: 600;
          line-height: 18px;
          font-size: 18px;
          margin-bottom: -3px;
        }
        .word {
          margin-top: 20px;
          font-size: 18px;
          line-height: 30px;
          &::before {
            $size: 10px;
            content: '';
            display: inline-block;
            height: $size;
            width: $size;
            margin-right: 10px;
            background: $blue;
            border-radius: 50%;
          }
        }
      }

      &-share {
        &-icon {
          background: url('../../../assets/lessonImg/summary/share.png')
            no-repeat center;
          display: inline-block;
          width: 20px;
          height: 22px;
        }
        cursor: pointer;
        width: 221px;
        height: 57px;
        line-height: 57px;
        font-size: 28px;
        background: $blue;
        text-align: center;
        color: white;
        font-weight: 500;
        border-radius: 57px;
        position: absolute;
        bottom: 0;
        margin-bottom: -38px;
      }

      &-boy {
        position: absolute;
        bottom: 0;
        left: 20px;
        height: auto;
        width: auto;
        z-index: 0;
        max-height: 170px;
        max-width: 100%;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .student-summary {
    &-wrap {
      border: 1px solid #66cd2e;
      border-radius: 5px;
      margin: 10px;
      box-shadow: 0px 3px 7px 0px rgba(112, 112, 112, 0.41);
      .summary {
        &-boy {
          // display: none;
          width: 40px;
        }
        &-body{
          .word{
            font-size: 12px;
          }
        }
        &-share{
          width: 95px;
          font-size: 14px;
          height: 30px;
          bottom: 25px;
          line-height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>

