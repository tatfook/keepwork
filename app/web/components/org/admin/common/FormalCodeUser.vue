<template>
  <div class="formal-code-user">
    <el-button @click="toUseFormalCode">{{btnText}}</el-button>
    <invitation-code-warning :type="warningType" :isDialogVisible="isWarningVisible" @close="isWarningVisible = false" />
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
  },
  methods: {
    ...mapActions({
      setUseFormalCodeParams: 'org/setUseFormalCodeParams',
      checkCurrentOrgExpire: 'org/checkCurrentOrgExpire',
    }),
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
  .el-button {
    padding: 10px 16px;
    font-size: 12px;
  }
}
</style>
