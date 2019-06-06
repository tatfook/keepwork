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
    <el-table class="performance-table" :data="tableData" style="width: 100%" :default-sort="{prop: 'name', order: 'descending'}" tooltip-effect="dark" :default-expand-all="false">
      <el-table-column v-if="isHasData" fixed prop="name" :label="$t('lesson.name')" sortable min-width="140" align="center" :show-overflow-tooltip="true">
        <template slot-scope="props">
          <el-tooltip :content="statusTips(props.row.status)" placement="top">
            <div class="userinfo">
              <div class="portrait-wrap" :class="{ 'keepwork': props.row.status === 'k1', 'keepwork leave': props.row.status === 'k2', 'paracraft': props.row.status === 'p1', 'paracraft leave': props.row.status === 'p2' }">
                <img class="portrait" :class="{ 'online': checkOnline(props.row.status), 'leave': checkLeave(props.row.status), 'offline': checkOffline(props.row.status) }" :src="props.row.portrait || defaultAvatar" alt="portrait">
              </div>
              <span class="name">{{props.row.name || props.row.username}}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :fixed='!isPhoneSize' v-for="(item,index) in tableUserInfo" :key="index" :prop="item" :label="$t(`lesson.${item}`)" sortable min-width="120" align="center" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column v-for="(item, index) in tableQuizzes" :key="item" :render-header="(h, params) => renderLastHeader(h,params)" sortable min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="props">
          <span v-if="props.row[`quiz${index+1}`]['type'] === TRF" :class="['answer', props.row[`quiz${index + 1}`]['result'] ? 'right': 'wrong'  ]">{{ formatTRF(props.row[`quiz${index+1}`]['answer']) }}</span>
          <span v-else :class="['answer', props.row[`quiz${index + 1}`]['result'] ? 'right': 'wrong'  ]">{{props.row[`quiz${index+1}`]['answer'] | formatQuiz }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import avatar from '@/assets/lessonImg/default_avatar.png'
import TableHeaderPopover from './TableHeaderPopover'
export default {
  name: 'OrgTeacherLessonPerformance',
  components: {
    TableHeaderPopover
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      TRF: '2',
      defaultAvatar: avatar,
      KEEPWORK_SIGN: 'k',
      PARACRAFT_SIGN: 'p',
      _interval: null
    }
  },
  sockets: {
    async msg(data) {
      const { payload } = data
      if (payload.type === 1) {
        this.updateLearnRecordsBySocket(payload.record)
      }
    }
  },
  async created() {
    if (this.isInCurrentClass) {
      await this.copyClassroomQuiz()
      this.updateLearnRecords()
    }
  },
  async destroyed() {
    await this.clearIntervalUpdateLearnRecords()
  },
  mounted() {
    window.addEventListener('resize', this.handleWindowResize)
  },
  filters: {
    formatQuiz(value) {
      return value ? value.toString() : ''
    }
  },
  methods: {
    ...mapActions({
      updateLearnRecords: 'org/teacher/updateLearnRecords',
      leaveTheClassroom: 'org/teacher/leaveTheClassroom',
      copyClassroomQuiz: 'org/teacher/copyClassroomQuiz',
      updateLearnRecordsBySocket: 'org/teacher/updateLearnRecordsBySocket'
    }),
    async intervalUpdateLearnRecords(delay = 1000 * 60) {
      try {
        await this.updateLearnRecords()
        clearTimeout(this._interval)
        if (!this.isClassIsOver) {
          this._interval = setTimeout(
            () => this.intervalUpdateLearnRecords(),
            delay
          )
        }
      } catch (error) {
        console.error(error)
      }
    },
    async clearIntervalUpdateLearnRecords() {
      clearTimeout(this._interval)
      // await this.updateLearnRecords()
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    },
    handleRefreshLearnRecords() {
      this.$emit('intervalUpdateLearnRecords')
    },
    checkOnline(value) {
      return value ? ['k1', 'p1'].some(i => i === value) : false
    },
    checkOffline(value) {
      return value ? ['k0', 'p0'].some(i => i === value) : false
    },
    checkLeave(value) {
      return value ? ['k2', 'p2'].some(i => i === value) : false
    },
    statusTips(value) {
      if (this.checkOnline(value)) {
        return this.$t('lesson.online')
      }
      if (this.checkOffline(value)) {
        return this.$t('lesson.offline')
      }
      if (this.checkLeave(value)) {
        return this.$t('lesson.leave')
      }
      return this.$t('lesson.online')
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
    renderLastHeader(h, { column, $index }) {
      let tableHeaderIndex = $index - 3
      let quizIndex = tableHeaderIndex - 1
      let quiz = this.tableHeaderQuizzesPopover[quizIndex]
      return <TableHeaderPopover index={tableHeaderIndex} quiz={quiz} />
    },
    countState(quiz) {
      let finishCount = quiz.reduce((count, cur) => {
        cur.result !== null && count++
        return count
      }, 0)
      let state =
        finishCount === quiz.length
          ? `${this.$t('lesson.finished')}`
          : `${finishCount}/${quiz.length}`
      return state
    },
    makeQuizzes(quiz) {
      return quiz.reduce((obj, cur, index) => {
        let {
          result,
          answer,
          data: { options, type, score }
        } = cur
        obj[`quiz${index + 1}`] = { answer, result, options, type, score }
        return obj
      }, {})
    },
    getFirstLetter(chart) {
      return chart ? chart[0] : 'k'
    },
    isOutline(value) {
      return ['k0', 'p0'].some(i => i === value)
    },
    isLeave(value) {
      return ['k2', 'p2'].some(i => i === value)
    },
    verifyQuiz(quiz) {
      if (this.classroomQuiz.length > 0 && quiz.length === 0) {
        return [...this.classroomQuiz]
      }
      if (this.classroomQuiz.length !== quiz.length) {
        return [...this.classroomQuiz]
      }
      return quiz
    }
  },
  computed: {
    ...mapGetters({
      classroomId: 'org/teacher/classroomId',
      isBeInClass: 'org/teacher/isBeInClass',
      learnRecords: 'org/teacher/learnRecords',
      classroomQuiz: 'org/teacher/classroomQuiz',
      classroom: 'org/teacher/classroom',
      isClassIsOver: 'org/teacher/isClassIsOver'
    }),
    isInCurrentClass() {
      const { classId: cid, packageId: pid, lessonId: lid } = this.$route.params
      const { classId, packageId, lessonId } = this.classroom
      if (this.isBeInClass) {
        return cid == classId && pid == packageId && lid == lessonId
      }
      return true
    },
    isPhoneSize() {
      return this.windowWidth < 768
    },
    isHasData() {
      return this.learnRecords && this.learnRecords.length > 0
    },
    learnRecordsFilter() {
      return this.isHasData
        ? this.learnRecords
            .filter(i => {
              return (
                i.packageId === this.classroom.packageId &&
                i.lessonId === this.classroom.lessonId &&
                i.extra.username
              )
            })
            .map(
              ({
                userId,
                state,
                extra: {
                  name = '',
                  portrait,
                  quiz = [],
                  username = '',
                  status = 'k1',
                  world = ''
                }
              }) => {
                quiz = this.verifyQuiz(quiz)
                return {
                  userId,
                  state,
                  status,
                  world,
                  name,
                  portrait,
                  quiz,
                  username
                }
              }
            )
        : []
    },
    tableHeaderQuizzesPopover() {
      if (!this.isHasData) return []
      // let quiz =
      //   this.classroomQuiz ||
      //   this.learnRecordsFilter.filter(i => i.extra.quiz)[0].quiz
      let quiz = this.classroomQuiz
      return (
        quiz &&
        quiz.map(({ data: { answer, type, title, options, desc } }) => ({
          answer,
          type,
          title,
          options,
          desc
        }))
      )
    },
    tableDataFaker() {
      // 为了造假数据使用
      return this.tableData
        .map(item => Array.from({ length: 10 }, () => item))
        .reduce((arr, cur) => [...arr, ...cur], [])
    },
    tableData() {
      return this.isHasData
        ? this.learnRecordsFilter.map(item => {
            const { portrait, name, username, quiz, status, world = '' } = item
            let state = this.countState(quiz)
            let quizzes = this.makeQuizzes(quiz)
            return {
              portrait,
              status,
              name,
              username,
              world,
              state,
              ...quizzes
            }
          })
        : []
    },
    tableUserInfo() {
      return this.isHasData ? ['username', 'world', 'state'] : []
    },
    tableQuizzes() {
      return this.isHasData
        ? this.classroomQuiz.map((item, index) => `quiz${index + 1}`)
        : []
      // ? (
      //     this.classroomQuiz ||
      //     this.learnRecordsFilter.filter(i => i.extra.quiz)[0].quiz
      //   ).map((item, index) => `quiz${index + 1}`)
      // : []
    },
    alphabet() {
      return Array.from({ length: 26 }, (i, index) =>
        String.fromCharCode(65 + index)
      )
    }
  }
}
</script>


<style lang="scss">
$green: #27ce2f;
$red: #f53838;
.lesson-student-performance-wrap {
  max-width: 1229px;
  background: white;
  margin: 0 auto;
  font-weight: bold;
  .tips {
    padding: 10px 40px;
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
      .portrait-wrap::after {
        $size: 20px;
        display: block;

        width: $size;
        height: $size;
        line-height: $size;
        font-size: 14px;
        color: #ffffff;
        border-radius: 50%;
        position: absolute;
        bottom: 0;
        right: 0;
      }
      .portrait-wrap {
        position: relative;
        margin-right: 20px;
        .portrait {
          $size: 50px;
          display: inline-block;
          height: $size;
          width: $size;
          border-radius: 50%;
          object-fit: cover;
        }
        &.keepwork::after {
          content: 'K';
          background: #409efe;
        }
        &.leave.keepwork::after {
          content: 'K';
          background: #e6a23c;
        }
        &.paracraft::after {
          content: 'P';
          background: #409efe;
        }
        &.leave.paracraft::after {
          content: 'P';
          background: #e6a23c;
        }
        .leave {
          opacity: 0.3;
        }
        .offline {
          filter: grayscale(100%);
        }
      }
      .name {
        display: inline-block;
        white-space: initial;
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
  .quiz-pop {
    background: black;
  }
}
</style>


