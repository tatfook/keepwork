<template>
  <div class="join-class-container">
    <div class="join-class-title">请输入邀请码:</div>
    <div class="join-class-tips">
      请联系{{admissionMsg}}，获得邀请码。
    </div>
    <div class="join-class-form">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="邀请码" prop="key">
          <el-input placeholder="请输入邀请码" v-model.trim="form.key"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input placeholder="请输入姓名" v-model.trim="form.realname"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="" @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'JoinClass',
  data() {
    return {
      form: {
        key: '',
        realname: '',
      },
      rules: {
        key: [
          {
            required: true,
            message: '请输入邀请码',
            trigger: 'blur',
          },
        ],
        realname: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  async mounted() {
    if (this.isCurrentOrgToken) {
      await this.getStudentInfo()
      this.form.realname = this.orgRealName
    }
  },
  methods: {
    ...mapActions({
      recharge: 'org/student/recharge',
      getStudentInfo: 'org/student/getStudentInfo',
      getOrgClasses: 'org/student/getOrgClasses',
    }),
    onSubmit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          try {
            const classIDs = await this.recharge({
              ...this.form,
              organizationId: this.organizationId,
            })
            this.$message.success('续费成功')
            if (this.isNeedRedirect) {
              if (classIDs.length === 1) {
                this.$router.push({
                  name: 'OrgStudentClassDetail',
                  classIDs: classIDs[0],
                })
              } else if (classIDs.length === 0 || !classIDs.includes(this.currentClassID)) {
                this.$router.push({
                  name: 'OrgStudentClassSelect',
                })
              }
            }
            this.onCancel()
            return classIDs
          } catch (error) {
            const message = JSON.parse(_.get(error, 'response.data')).message
            this.$message.error(message)
          }
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.$emit('cancel')
    },
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      userinfo: 'org/student/userinfo',
      isCurrentOrgToken: 'org/isCurrentOrgToken',
      tokenInfo: 'org/tokenInfo',
    }),
    orgRealName() {
      return _.get(this.userinfo, 'realname', '')
    },
    orgName() {
      return _.get(this.currentOrg, 'name')
    },
    orgCellphone() {
      return _.get(this.currentOrg, 'cellphone')
    },
    organizationId() {
      return _.get(this.currentOrg, 'id')
    },
    orgAdmissionMsg() {
      return _.get(this.currentOrg, 'extra.admissionMsg')
    },
    admissionMsg() {
      return this.orgAdmissionMsg || this.orgCellphone || '老师'
    },
    isNeedRedirect() {
      return [
        'OrgStudentClassDetail',
        'OrgStudentEvaluations',
        'OrgStudentEvaluationDetail',
        'OrgStudentClassSelect',
      ].includes(this.$route.name)
    },
    currentClassID() {
      return _.toNumber(_.get(this.$route, 'params.classId', ''))
    },
  },
}
</script>


<style lang="scss" scoped>
.join-class-container {
  width: 400px;
  margin: 0 auto;
  text-align: center;
  .join-class {
    &-title {
      color: #333;
      font-size: 24px;
    }
    &-tips {
      color: #2397f3;
      margin-top: 24px;
    }
    &-form {
      width: 330px;
      margin: 34px auto;
      /deep/ .el-button {
        padding: 10px 34px;
      }
    }
  }
}
</style>
