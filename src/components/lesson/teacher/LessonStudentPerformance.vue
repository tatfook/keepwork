<template>
  <div class="lesson-student-performance-wrap">
    <div class="tips">
      <span class="pointer right">
        <span class="icon"></span>
        <span class="name">{{$t('lesson.right')}}</span>
      </span>
      <span class="pointer wrong">
        <span class="icon"></span>
        <span class="name">{{$t('lesson.wrong')}}</span>
      </span>
    </div>
    <div class="refresh-data-wrap" v-if="isBeInClass && !learnRecords">
      <el-button @click="handleRefreshLearnRecords" icon="el-icon-refresh" type="warning" size="medium">{{$t('lesson.clickToRefresh')}}</el-button>
    </div>
    <el-table class="performance-table" v-else :data="tableData" style="width: 100%" :default-sort="{prop: 'name', order: 'descending'}" height="500" tooltip-effect="dark" :default-expand-all="false">
      <el-table-column v-if="isHasData" fixed prop="name" :label="$t('lesson.name')" sortable min-width="140" align="center"  :show-overflow-tooltip="true">
        <template slot-scope="props">
          <div class="userinfo">
            <img class="portrait" :src="formatAvatar(props.row.portrait)" alt="portrait">
            <span class="name">{{props.row.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed v-for="(item,index) in tableUserInfo" :key="index" :prop="item" :label="$t(`lesson.${item}`)" sortable min-width="120" align="center" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column v-for="(item, index) in tableQuizzes" :key="item" :label="item" :prop="item" sortable min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="props">
          <span v-if="props.row[`quiz${index+1}`]['type'] === TRF" :class="['answer', props.row[`quiz${index + 1}`]['result'] ? 'right': 'wrong'  ]">{{ formatTRF(props.row[`quiz${index+1}`]['answer']) }}</span>
          <span v-else :class="['answer', props.row[`quiz${index + 1}`]['result'] ? 'right': 'wrong'  ]">{{props.row[`quiz${index+1}`]['answer'] | formatQuiz }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-button @click="testData">疯狂输出</el-button> -->
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import avatar from '@/assets/lessonImg/default_avatar.png'
export default {
  name: 'LessonStudentPerformance',
  data() {
    return {
      TRF: '2',
      defaultAvatar: avatar
    }
  },
  mounted() {
    // console.log(this.tableData)
  },
  filters: {
    formatQuiz(value) {
      return value ? value.toString() : ''
    }
  },
  methods: {
    handleRefreshLearnRecords() {
      this.$emit('intervalUpdateLearnRecords')
    },
    formatAvatar(value = '') {
      return value.substr(0, 4).toLowerCase() === 'http'
        ? value
        : this.defaultAvatar
    },
    formatTRF(value) {
      if (value === 'A') {
        return this.$t('lesson.right')
      }
      if (value === 'B') {
        return this.$t('lesson.wrong')
      }
      return ''
    },
    testData() {
      console.log(this.tableData)
      console.log(this.tableDataFaker)
    },
    countState(quiz) {
      let finishCount = quiz.reduce((count, cur) => {
        cur.result !== null && count++
        return count
      }, 0)
      let state =
        finishCount === quiz.length ? 'finish' : `${finishCount}/${quiz.length}`
      return state
    },
    makeQuizzes(quiz) {
      return quiz.reduce((obj, cur, index) => {
        let { result, answer, data: { options, type, score } } = cur
        obj[`quiz${index + 1}`] = { answer, result, options, type, score }
        return obj
      }, {})
    }
  },
  computed: {
    ...mapGetters({
      classroomId: 'lesson/teacher/classroomId',
      isBeInClass: 'lesson/teacher/isBeInClass',
      learnRecords: 'lesson/teacher/learnRecords'
    }),
    isHasData() {
      return (
        this.learnRecords &&
        this.learnRecords.length > 0 &&
        this.learnRecords[0].extra['name']
      )
    },
    learnRecordsFilter() {
      return this.isHasData
        ? this.learnRecords.map(
            ({
              userId,
              state,
              extra: { name, portrait, quiz = [], username }
            }) => ({
              userId,
              state,
              name,
              portrait,
              quiz,
              username
            })
          )
        : []
    },
    tableDataFaker() {
      return this.tableData
        .map(item => Array.from({ length: 10 }, () => item))
        .reduce((arr, cur) => [...arr, ...cur], [])
    },
    tableData() {
      return this.isHasData
        ? this.learnRecordsFilter.map(item => {
            const { portrait, name, username, quiz } = item
            let state = this.countState(quiz)
            let quizzes = this.makeQuizzes(quiz)
            return { portrait, name, username, state, ...quizzes }
          })
        : []
    },
    tableUserInfo() {
      return this.isHasData ? ['username', 'state'] : []
    },
    tableQuizzes() {
      return this.isHasData
        ? this.learnRecordsFilter[0].quiz.map(
            (item, index) => `quiz${index + 1}`
          )
        : []
    }
  }
}
</script>


<style lang="scss">
$green: #27ce2f;
$red: #f53838;
.lesson-student-performance-wrap {
  max-width: 1080px;
  background: white;
  margin: 0 auto;
  font-weight: bold;
  .tips {
    padding: 10px 5px;
    .pointer {
      $size: 20px;
      display: inline-flex;
      align-items: center;
      margin-right: 20px;
      .icon {
        display: inline-block;
        height: $size;
        width: $size;
        border-radius: 50%;
        margin-right: 5px;
      }
      &.right {
        .icon {
          background: $green;
        }
      }
      &.wrong {
        .icon {
          background: $red;
        }
      }
    }
  }
  .refresh-data-wrap {
    display: flex;
    height: 200px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .performance-table {
    .userinfo {
      display: flex;
      align-items: center;
      .portrait {
        $size: 50px;
        display: inline-block;
        height: $size;
        width: $size;
        border-radius: 50%;
        margin-right: 20px;
      }
      .name {
        display: inline-block;
      }
    }
    .answer {
      text-align: center;
      &.right {
        color: $green;
      }
      &.wrong {
        color: $red;
      }
    }
  }
}
</style>


