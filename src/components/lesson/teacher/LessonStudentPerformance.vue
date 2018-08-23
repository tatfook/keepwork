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
      <el-button @click="handleRefreshLearnRecords" icon="el-icon-refresh" size="medium">点击刷新数据</el-button>
    </div>
    <el-table v-else :data="fakerData" style="width: 100%" :default-sort="{prop: 'name', order: 'descending'}" tooltip-effect="dark">
      <el-table-column v-for="(item,index) in tableProps" :key="index" :prop="item" :label="item" sortable>

      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LessonStudentPerformance',
  data() {
    return {
      fakerData: [
        {
          name: '王小八',
          username: 'keep2',
          state: '3/5',
          quiz1: 'A',
          quiz2: 'A',
          quiz3: 'B'
        }
      ]
    }
  },
  mounted() {
  },
  methods: {
    handleRefreshLearnRecords() {
      this.$emit('intervalUpdateLearnRecords')
    }
  },
  watch: {
    learnRecords(value) {
      console.dir(value)
    }
  },
  computed: {
    ...mapGetters({
      classroomId: 'lesson/teacher/classroomId',
      isBeInClass: 'lesson/teacher/isBeInClass',
      learnRecords: 'lesson/teacher/learnRecords'
    }),
    tableProps(value) {
      return Object.keys(this.fakerData[0])
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


