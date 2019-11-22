<template>
  <div class="new-message">
    <div class="new-message-header">
      校园OA
      <i class="el-icon-arrow-right"></i>
      <router-link class="new-message-header-link" :to="{}">发消息</router-link>
      <div class="new-message-header-operate">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button size="mini" type="primary" @click="saveData">发送</el-button>
      </div>
    </div>
    <div class="new-message-form">
      <div class="new-message-item">
        <span class="new-message-item-star">*</span>
        <label class="new-message-item-label">发送对象:</label>
        <el-button class="new-message-item-button" :class="{'danger': !isReceiverValid}" type="primary" @click="showMemberDialog">选择对象</el-button>
        <el-tag v-for="classItem in tagArr" :key="classItem.classId" closable effect="plain" type="info" @close="removeClass(classItem)">
          {{classItem.className}}（{{classItem.count}}人）
        </el-tag>
        <div class="new-message-item-checkbox-row">
          <el-checkbox v-model="isSendMessage">短信提醒学生家长</el-checkbox>
        </div>
      </div>
      <div class="new-message-item">
        <span class="new-message-item-star">*</span>
        <label class="new-message-item-label">消息内容:</label>
        <el-input :class="{'danger': !isMsgValid}" type="textarea" placeholder="请输入内容..." resize="none" v-model="messageText">
        </el-input>
      </div>
    </div>
    <el-dialog :visible.sync="isMemberDialogShow" width="278px" center :before-close="closeMemberDialog">
      <member-selector :selectedMembers="selectedMembers" @cancel="closeMemberDialog" @save="saveReceivers"></member-selector>
    </el-dialog>
  </div>
</template>
<script>
import MemberSelector from './MemberSelector'
export default {
  name: 'NewMessage',
  data() {
    return {
      selectedMembers: [],
      checkedUserIdsObj: [],
      isSendMessage: true,
      messageText: '',
      isMemberDialogShow: false,
    }
  },
  computed: {
    selectedClassArr() {
      return _.groupBy(this.selectedMembers, 'classId')
    },
    tagArr() {
      return _.map(this.selectedClassArr, classDetail => {
        return {
          classId: classDetail[0].classId,
          className: classDetail[0].className,
          count: classDetail.length,
        }
      })
    },
    newMessageData() {
      return {
        msg: {
          type: 2,
          text: this.messageText,
        },
        userIds: _.map(this.selectedMembers, member => {
          let { userId, roleId } = member
          return { userId, roleId }
        }),
        sendSms: this.isSendMessage ? 1 : 0,
      }
    },
    isReceiverValid() {
      return this.selectedMembers.length > 0
    },
    isMsgValid() {
      return Boolean(this.messageText)
    },
    isNewDataValid() {
      return this.isMsgValid && this.isReceiverValid
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    saveData() {
      if (!this.isNewDataValid) {
        this.$message({
          type: 'warning',
          message: '发送对象及消息内容是必填项',
        })
        return
      }
      this.$emit('save', this.newMessageData)
    },
    showMemberDialog() {
      this.isMemberDialogShow = true
    },
    closeMemberDialog() {
      this.isMemberDialogShow = false
    },
    saveReceivers(receivers) {
      this.selectedMembers = receivers
      this.closeMemberDialog()
    },
    removeClass(classItem) {
      this.selectedMembers = _.filter(this.selectedMembers, member => member.classId != classItem.classId)
    },
  },
  components: {
    MemberSelector,
  },
}
</script>
<style lang="scss" scoped>
.new-message {
  padding: 0 20px;
  background-color: #fff;
  height: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  &-header {
    position: relative;
    border-bottom: 1px solid #d9d9d9;
    padding-right: 190px;
    color: #303133;
    font-size: 16px;
    height: 70px;
    line-height: 70px;
    &-link {
      text-decoration: none;
      color: #8c8c8c;
    }
    &-operate {
      position: absolute;
      right: 0;
      top: 24px;
      line-height: 1;
      .el-button {
        width: 90px;
        font-size: 14px;
        padding: 6px 15px;
      }
    }
    .el-icon-arrow-right {
      color: #8c8c8c;
    }
  }
  &-form {
    padding-top: 30px;
    .el-tag {
      height: 24px;
      line-height: 24px;
      margin: 0 8px 8px 0;
    }
  }
  &-item {
    margin-bottom: 32px;
    font-size: 14px;
    color: #303133;
    &-star {
      color: #fb1d1d;
    }
    &-label {
      width: 67px;
      display: inline-block;
    }
    &-button {
      font-size: 12px;
      height: 24px;
      line-height: 24px;
      padding: 0 18px;
      &.danger {
        background-color: #f5222d;
        border-color: #f5222d;
      }
    }
    &-checkbox-row {
      margin-top: 20px;
      padding-left: 80px;
    }
    .el-textarea {
      padding-left: 80px;
      box-sizing: border-box;
      top: -20px;
      font-size: 12px;
      /deep/ &.danger > .el-textarea__inner {
        border-color: #f5222d;
      }
    }
    /deep/.el-textarea__inner {
      height: 300px;
    }
  }
}
</style>