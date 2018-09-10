<template>
    <div class="student-summary-wrap">
        <div class="summary-title">{{summary.name}}</div>
        <div class="summary-body">
            <div class="word first" v-html="$t('lesson.StudiedForManyDays', {howManyDays: `<span class='highlight'>${summary.day}</span>`,lessonTitle: `<span class='highlight'>${summary.name}</span>`})">
            </div>
            <div class="word second" v-html="$t('lesson.todayRecords', {readCodeLinesCount:`<span class='highlight'>${summary.read}</span>`, wroteCodeLinesCount: `<span class='highlight'>${summary.write}</span>`, commandLines: `<span class='highlight'>${summary.command}</span>`})">
            </div>
        </div>
        <div class="summary-share" @click="share">
            <span class="summary-share-icon"></span>
            {{$t('lesson.share')}}
        </div>
        <img class="summary-boy" src="../../../assets/lessonImg/summary/boy.png" alt="">
    </div>
</template>

<script>
import dayjs from 'dayjs'
import AdvancedFormat from 'dayjs/plugin/AdvancedFormat'
import { locale } from '@/lib/utils/i18n'
export default {
  name: 'StudentSummary',
  props: {
    summary: {}
  },
  methods: {
    share() {
      this.$emit('share')
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
    .summary {
      &-title {
        font-size: 28px;
        font-weight: 600;
        margin-top: 50px;
      }
      &-body {
        margin-top: 50px;
        .highlight {
          color: #ec761a;
          font-weight: 600;
        }
        .word {
          $heigth: 30px;
          height: 20px;
          line-height: 20px;
          margin-top: 20px;
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
</style>

