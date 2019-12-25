<template>
  <div class="join-org-container">
    <div class="join-org-title">
      欢迎来到 {{orgName}} ，学习优质课程，请输入邀请码：
    </div>
    <div class="join-org-tips">
      请联系{{admissionMsg}}，获得邀请码。
    </div>
    <div class="join-org-form">
      <el-form ref="form" :model="form" :rules="rules" label-width="5em" :hide-required-asterisk="true">
        <el-form-item label="邀请码" prop="key">
          <el-input placeholder="请输入邀请码" v-model.trim="form.key"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input placeholder="请输入姓名" v-model.trim="form.realname"></el-input>
        </el-form-item>
      </el-form>
      <parent-phone-binder ref="parentPhoneBinderRef" class="join-org-form-binder"></parent-phone-binder>
      <div class="join-org-form-operate">
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ParentPhoneBinder from './common/ParentPhoneBinder'
export default {
  name: 'JoinOrg',
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
    await this.getStudentInfo()
    this.form.realname = this.orgRealName
  },
  methods: {
    ...mapActions({
      joinOrg: 'org/student/joinOrgClass',
      getStudentInfo: 'org/student/getStudentInfo',
    }),
    onSubmit() {
      this.$refs['form'].validate(async valid => {
        let parentPhoneBinderRef = this.$refs.parentPhoneBinderRef
        let isPhoneDataValid = parentPhoneBinderRef.isPhoneDataValid
        if (valid && isPhoneDataValid) {
          let { phone, verifCode } = parentPhoneBinderRef.parentPhone
          const classIDs = await this.joinOrg(
            _.omitBy(
              {
                ...this.form,
                organizationId: this.organizationId,
                parentPhoneNum: phone ? phone : null,
                verifCode: verifCode ? verifCode : null,
              },
              _.isNull,
            ),
          )
          if (classIDs.length === 1) {
            const url = this.$router.resolve({
              name: 'OrgStudentClassDetail',
              params: {
                classId: classIDs[0],
              },
            }).href
            window.location.href = url
          } else {
            const url = this.$router.resolve({
              name: 'OrgStudentClassSelect',
            }).href
            window.location.href = url
          }
        } else {
          return false
        }
      })
    },
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      userinfo: 'org/student/userinfo',
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
  },
  components: {
    ParentPhoneBinder,
  },
}
</script>

<style lang="scss" scoped>
.join-org-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 730px;
  background: #fff;
  .join-org {
    &-title {
      color: #333;
      font-size: 18px;
    }
    &-tips {
      margin-top: 22px;
      font-size: 14px;
      color: #2397f3;
    }
    &-form {
      &-binder {
        border: 1px solid #e8e8e8;
        width: 526px;
        padding: 32px 16px;
        box-sizing: border-box;
        text-align: center;
        /deep/ .parent-phone-binder-item {
          text-align: left;
          padding-left: 48px;
        }
      }
      &-operate {
        text-align: center;
        margin-top: 32px;
      }
      /deep/ .el-form {
        width: 360px;
        margin: 34px auto;
      }
      /deep/ .el-button {
        padding: 10px 34px;
      }
    }
  }
}
</style>

