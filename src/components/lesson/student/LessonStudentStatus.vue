<template>
  <div class="lesson-student-status">
    <el-row class="student-info" type="flex" align="middle">
      <el-col :span="5">
        <span>Class ID: {{enterClassId}}</span>
      </el-col>
      <el-col :span="5">
        <span>Name: {{studentName}}</span>
      </el-col>
      <el-col :span="14" :push="10">
        <el-button type="primary" size="mini">Leave the class</el-button>
      </el-col>
    </el-row>
    <el-dialog title="Please input your name here" center :visible.sync="isDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"  >
      <el-input v-model="name" placeholder="name" :autofocus="true"></el-input>
      <div slot="footer">
        <el-button @click="handleSetStudentName" type="primary">OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LessonStudentStatus',
  data() {
    return {
      isDialogVisible: false,
      name: ''
    }
  },
  computed: {
    ...mapGetters({
      classroomId: 'lesson/student/classroomId',
      studentName: 'lesson/student/studentName',
      isBeInClassroom: 'lesson/student/isBeInClassroom',
      enterClassId: 'lesson/student/enterClassId'
    })
  },
  mounted() {
    if (!this.studentName && this.isBeInClassroom) {
      this.isDialogVisible = true
    }
  },
  methods: {
    ...mapActions({
      setStudentName: 'lesson/student/setStudentName'
    }),
    handleSetStudentName() {
      if (this.name.trim() !== '') {
        this.setStudentName(this.name)
        this.isDialogVisible = false
      }
    }
  }
}
</script>

<style lang="scss">
.lesson-student-status {
  height: 50px;
  background: #424242;
  width: 100%;
  color: white;
  .student-info {
    width: 1080px;
    margin: 0 auto;
    height: inherit;
  }
}
</style>


