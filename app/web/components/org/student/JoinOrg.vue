<template>
  <div class="join-org-container">
    <div class="join-org-title">
      欢迎来到 {{orgName}} ，学习优质课程，请输入邀请码：
    </div>
    <div class="join-org-tips">
      请联系学校老师，获得邀请码。{{orgCellphone}}
    </div>
    <div class="join-org-form">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="邀请码" prop="key">
          <el-input placeholder="请输入邀请码" v-model.trim="form.key"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input placeholder="请输入姓名" v-model.trim="form.realname"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'JoinOrg',
  data() {
    return {
      form: {
        key: '',
        realname: ''
      },
      rules: {
        key: [
          {
            required: true,
            message: '请输入邀请码',
            trigger: 'blur'
          }
        ],
        realname: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.form.realname = this.orgRealName
  },
  methods: {
    ...mapActions({
      joinOrg: 'org/student/joinOrgClass'
    }),
    onSubmit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const flag = await this.joinOrg({
            ...this.form,
            organizationId: this.organizationId
          })
          return flag
        } else {
          return false
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      orgRealName: 'org/student/orgRealName'
    }),
    orgName() {
      return _.get(this.currentOrg, 'name')
    },
    orgCellphone() {
      return _.get(this.currentOrg, 'cellphone')
    },
    organizationId() {
      return _.get(this.currentOrg, 'id')
    }
  }
}
</script>

<style lang="scss" scoped>
.join-org-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 500px;
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
      width: 330px;
      margin: 34px auto;
      /deep/ .el-button {
        padding: 10px 34px;
      }
    }
  }
}
</style>

