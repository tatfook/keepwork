<template>
  <div class="formal-code-user">
    <el-button class="default-button" @click="toUseFormalCode">{{btnText}}</el-button>
    <invitation-code-warning :type="warningType" :isDialogVisible="isWarningVisible" @close="isWarningVisible = false" />
    <el-dialog class="formal-code-user-warning" :visible="isStudentWarningVisible" width="556px" :before-close="closeStudentWarning">
      <div class="title">以下学生是正式用户，不需要进行“试听转正式”操作</div>
      <div class="students">{{tryingTypeStudentStr}}</div>
      <div class="operate">
        <el-button class="confirm-button" type="primary" @click="closeStudentWarning">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import InvitationCodeWarning from './InvitationCodeWarning'
export default {
  name: 'FormalCodeUser',
  props: {
    type: {
      type: String,
      validator: function(val) {
        return ['beFormal', 'renew'].indexOf(val) !== -1
      },
    },
    students: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      isStudentWarningVisible: false,
      isWarningVisible: false,
      warningType: undefined,
    }
  },
  computed: {
    ...mapGetters({
      codeUsedStatus: 'org/codeUsedStatus',
    }),
    remainder() {
      return _.get(this.codeUsedStatus, 'remainder')
    },
    formalMaxCount() {
      return _.max(_.values(this.remainder)) || 0
    },
    btnText() {
      return this.type == 'renew' ? '续费' : '试听转正式'
    },
    tryingTypeStudents() {
      return _.filter(this.students, item => item.type == 2)
    },
    tryingTypeStudentStr() {
      return _.map(this.tryingTypeStudents, item => {
        console.log(item.users)
        return `${item.realname}(${item.users.username})`
      }).join('、')
    },
  },
  methods: {
    ...mapActions({
      setUseFormalCodeParams: 'org/setUseFormalCodeParams',
      checkCurrentOrgExpire: 'org/checkCurrentOrgExpire',
    }),
    closeStudentWarning() {
      this.isStudentWarningVisible = false
    },
    async testIsValid() {
      if (await this.checkCurrentOrgExpire({ toExpire: false })) return false
      const count = this.students.length
      if (count === 0) {
        this.$message({
          type: 'error',
          message: '请选择学生',
        })
        return false
      }
      if (this.type == 'beFormal' && this.tryingTypeStudents.length > 0) {
        this.isStudentWarningVisible = true
        return false
      }
      if (this.formalMaxCount === 0) {
        this.isWarningVisible = true
        this.warningType = 'disable'
        return false
      }
      if (this.formalMaxCount < count) {
        this.isWarningVisible = true
        this.warningType = 'maxNotEnough'
        return false
      }
      return true
    },
    async toUseFormalCode() {
      const isValid = await this.testIsValid()
      if (!isValid) return
      this.setUseFormalCodeParams({ type: this.type, students: this.students })
      this.$router.push({
        name: 'OrgUseFormalCode',
      })
    },
  },
  components: {
    InvitationCodeWarning,
  },
}
</script>
<style lang="scss" scoped>
.formal-code-user {
  display: inline-block;
  .default-button {
    padding: 10px 16px;
    font-size: 12px;
  }
  &-warning {
    /deep/.el-dialog__body {
      font-size: 16px;
      color: #303133;
    }
    .students {
      color: #2397f3;
    }
    .operate {
      text-align: center;
    }
    .confirm-button {
      width: 120px;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      padding: 0;
      margin-top: 30px;
    }
  }
}
</style>
