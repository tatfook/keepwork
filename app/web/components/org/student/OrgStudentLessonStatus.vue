<template>
  <div class="lesson-student-status" v-if="isBeInClassroom">
    <el-row class="student-info-wrap" type="flex" align="middle">
      <el-col :span="5" :sm="5">
        <span>{{$t('lesson.classId')}} C{{classroomKey}}</span>
      </el-col>
      <el-col :span="5">
        <span class="nickname-wrap">
          <span>{{$t('lesson.nickName')}} {{username}}</span>
        </span>
      </el-col>
      <el-col :span="14" :sm="14">
        <el-row type="flex" justify="end">
          <el-button class="leave-button" type="primary" @click="handleLeaveTheClass" size="mini">{{$t('lesson.leaveTheClass')}}</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgStudentLessonStatus',
  computed: {
    ...mapGetters({
      classroomKey: 'org/student/classroomKey',
      isBeInClassroom: 'org/student/isBeInClassroom',
      userinfo: 'org/userinfo'
    }),
    username() {
      return _.get(this.userinfo, 'username', '')
    }
  },
  methods: {
    ...mapActions({
      leaveTheClass: 'org/student/leaveTheClass',
      uploadLearnRecords: 'org/student/uploadLearnRecords'
    }),
    async handleLeaveTheClass() {
      this.$confirm(
        this.$t('lesson.leaveTheClassTips'),
        this.$t('lesson.leaveTheClass'),
        {
          type: 'warning',
          distinguishCancelAndClose: true,
          confirmButtonText: this.$t('common.Sure'),
          cancelButtonText: this.$t('common.Cancel'),
          customClass: 'leave-class'
        }
      )
        .then(async () => {
          await this.leaveTheClass()
            .then(res => {
              this.$router.push({ name: 'OrgStudentClass' })
            })
            .catch(e => {
              this.$message.error(this.$t('common.failure'))
            })
        })
        .catch(action => console.error(action))
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
  .student-info-wrap {
    max-width: 1080px;
    margin: 0 auto;
    height: inherit;
  }
  .leave-button {
    background: white;
    border-color: white;
    color: #424242;
    &:hover {
      background: #409eff;
      color: white;
      border-color: #409eff;
    }
  }
  .nickname-wrap {
    display: inline-flex;
    align-items: center;
    .name-input {
      // background: #409eff;
      height: 24px;
      font-weight: 500;
      .el-input__inner {
        height: 24px;
      }
    }
    .edit-status,
    .edit-cancel,
    .edit-confirm {
      cursor: pointer;
      font-size: 24px;
      margin-left: 8px;
      &:hover {
        color: #409eff;
      }
    }
    .edit-loading {
      margin-left: 8px;
    }
  }
  .input-name-dialog {
    width: 500px;
    padding: 30px 50px;
    box-sizing: border-box;
    .el-input__inner {
      border-top: none;
      border-left: none;
      border-right: none;
      border-radius: 0;
      text-align: center;
      font-size: 24px;
      color: #409eff;
    }
    .el-button--primary.is-disabled {
      background: #abadb1;
      border: none;
    }
  }
}
@media screen and (max-width: 768px) {
  .lesson-student-status {
    .input-name-dialog {
      width: 90%;
    }
  }
  .leave-class {
    width: 90%;
  }
}
</style>


