<template>
  <div class="lesson-student-performance-wrap">
    <el-table :data="fakerData" style="width: 100%" :default-sort="{prop: 'name', order: 'descending'}" tooltip-effect="dark">
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
        },
        {
          name: '鸡屎菜',
          username: 'mango',
          state: '4/5',
          quiz1: 'A',
          quiz2: 'B',
          quiz3: 'C'
        },
        {
          name: '小丸子',
          username: 'xwz',
          state: '2/5',
          quiz1: 'B',
          quiz2: 'B',
          quiz3: 'C'
        },
        {
          name: '炮姐',
          username: 'bilibili',
          state: 'finished',
          quiz1: 'B',
          quiz2: 'B',
          quiz3: 'D'
        }
      ]
    }
  },
  methods: {
    getLearnRecords() {}
  },
  computed: {
    ...mapGetters({
      classroomId: 'lesson/teacher/classroomId'
    }),
    tableProps(value) {
      return Object.keys(this.fakerData[0])
    }
  }
}
</script>


<style lang="scss">
.lesson-student-performance-wrap {
  max-width: 1080px;
  background: white;
  margin: 0 auto;
}
</style>


