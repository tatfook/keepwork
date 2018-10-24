<template>
  <div class="lesson-student-status">
    <el-row class="student-info" type="flex" align="middle">
      <el-col :span="5" :sm="5">
        <span>{{$t('lesson.classId')}} {{enterClassId}}</span>
      </el-col>
      <!-- <el-col :span="5" :sm="5" v-if="isVisitor">
        <span class="nickname-wrap">
          <span>{{$t('lesson.nickName')}} visitor</span>
        </span>
      </el-col> -->
      <el-col :span="5">
        <span class="nickname-wrap" v-if="isEditNickName">
          <span style="display:inline-block; width: 70px">{{$t('lesson.nickName')}}</span>
          <el-input class="name-input" :autofocus="true" :value="name" v-model="name">
          </el-input>
          <i v-show="isLoading" class="el-icon-loading edit-loading"></i>
          <i v-show="!isLoading" @click="setNicknameHandle" class="el-icon-circle-check-outline edit-confirm"></i>
          <!-- <i v-show="!isLoading" @click="switchEdit" class="el-icon-circle-close-outline edit-cancel"></i> -->
        </span>
        <span class="nickname-wrap" v-else>
          <span>{{$t('lesson.nickName')}} {{nickname}}</span>
          <i @click="switchEdit" class="el-icon-edit-outline edit-status"></i>
        </span>
      </el-col>
      <el-col :span="14" :sm="14">
        <el-row type="flex" justify="end">
          <el-button v-if="!isVisitor" class="leave-button" type="primary" @click="handleLeaveTheClass" size="mini">{{$t('lesson.leaveTheClass')}}</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog :title="$t('lesson.pleaseInputName')" center custom-class="input-name-dialog" :visible.sync="isDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-input v-model="name" :placeholder="$t('lesson.name')" :autofocus="true"></el-input>
      <div slot="footer">
        <el-button @click="handleSetNickname" :disabled="name && !name.trim()" style="width: 140px" type="primary">{{$t('common.OK')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LessonStudentStatus',
  props: {
    classKey: {
      type: String,
      default: ''
    },
    isVisitor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDialogVisible: false,
      name: '',
      editInput: '',
      isEditNickName: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      classroomId: 'lesson/student/classroomId',
      studentName: 'lesson/student/studentName',
      isBeInClassroom: 'lesson/student/isBeInClassroom',
      enterClassInfo: 'lesson/student/enterClassInfo',
      userinfo: 'lesson/userinfo',
      visitorInfo: 'lesson/student/visitorInfo'
    }),
    enterClassId() {
      return this.isVisitor
        ? this.classKey
        : _.get(this.enterClassInfo, 'key', '')
    },
    nickname() {
      return this.isVisitor
        ? _.get(this.visitorInfo, 'nickname', 'visitor')
        : _.get(this.userinfo, 'nickname', '')
    },
    username() {
      return _.get(this.userinfo, 'username', '')
    },
    isNeedToSetNickname() {
      return !this.nickname
    }
  },
  mounted() {
    if (
      this.isBeInClassroom &&
      (this.isNeedToSetNickname || this.$route.query.dialog)
    ) {
      this.isDialogVisible = true
    }
    this.name = this.nickname || this.username
  },
  methods: {
    ...mapActions({
      setNickname: 'lesson/setNickname',
      leaveTheClass: 'lesson/student/leaveTheClass',
      switchSummary: 'lesson/student/switchSummary',
      setVisitorNickname: 'lesson/student/setVisitorNickname',
      uploadLearnRecords: 'lesson/student/uploadLearnRecords',
    }),
    switchEdit() {
      this.isEditNickName = !this.isEditNickName
    },
    async setNicknameHandle() {
      if (this.name.trim() === '') return
      if (this.isVisitor) {
        this.setVisitorNickname(this.name)
        return this.switchEdit()
      }
      this.isLoading = true
      await this.setNickname(this.name)
        .then(() => {
          this.isLoading = false
          this.switchEdit()
        })
        .catch(e => {
          this.isLoading = false
          this.switchEdit()
        })
    },
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
          this.switchSummary(false)
          this.$router.push(`/student`)
        })
        .catch(action => console.log(action))
    },
    async handleSetNickname() {
      if (this.name && this.name.trim() !== '') {
        await this.setNickname(this.name)
          .then(res => {
            this.isDialogVisible = false
            window.location.href = this.$router.resolve(this.$route.path).href
            this.uploadLearnRecords().catch(e => console.error(e))
          })
          .catch(e => {
            console.error(e)
            this.$message.error(this.$t('common.failure'))
          })
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


