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
    <el-table v-else :data="tableData" style="width: 100%" :default-sort="{prop: 'name', order: 'descending'}" tooltip-effect="dark">
      <el-table-column v-for="(item,index) in tableUserInfo" :key="index" :prop="item" :label="item" sortable>
      </el-table-column>
      <el-table-column v-for="(item) in tableQuizzes" :key="item" :label="item" :formatter="formatQuiz" sortable>
      </el-table-column>
    </el-table>
    <el-button @click="testData"> 疯狂输出</el-button>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LessonStudentPerformance',
  data() {
    return {
      fakerData: []
    }
  },
  mounted() {
    // console.log(this.tableData)
  },
  methods: {
    handleRefreshLearnRecords() {
      this.$emit('intervalUpdateLearnRecords')
    },
    formatQuiz(row, column) {
      console.log(row[0])
      return row.answer
    },
    testData() {
      console.log(this.tableData)
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
        let { result, answer, data: { options } } = cur
        obj[`quiz${index + 1}`] = { answer, result, options }
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
    learnRecordsFilter() {
      return this.learnRecords.map(
        ({ userId, state, extra: { name, portrait, quiz, username } }) => ({
          userId,
          state,
          name,
          portrait,
          quiz,
          username
        })
      )
    },
    tableData() {
      let _table = this.learnRecordsFilter.map(item => {
        const { portrait, name, username, quiz } = item
        let state = this.countState(quiz)
        let quizzes = this.makeQuizzes(quiz)
        return { portrait, name, username, state, ...quizzes }
      })
      return _table
    },
    tableUserInfo() {
      return ['portrait', 'name', 'username', 'state']
    },
    tableQuizzes() {
      const { quiz } = this.learnRecordsFilter[0]
      return quiz.map((item, index) => `quiz${index + 1}`)
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
}
</style>


