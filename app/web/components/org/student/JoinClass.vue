<template>
  <div class="join-class-container">
    <div class="join-class-title">加入班级，请输入邀请码:</div>
    <div class="join-class-tips">如需购买邀请码，请联系管理员：{{orgCellphone}}</div>
    <div class="join-class-form">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="邀请码" prop="key">
          <el-input placeholder="请输入邀请码" v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input placeholder="请输入姓名" v-model="form.realname"></el-input>
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
  methods: {
    ...mapActions({
      joinOrg: 'org/student/joinOrg'
    }),
    onSubmit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const flag = await this.joinOrg({
            ...this.form,
            organizationId: this.organizationId
          })
          flag && this.onCancel()
          return flag
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.$emit('cancel')
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg'
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
