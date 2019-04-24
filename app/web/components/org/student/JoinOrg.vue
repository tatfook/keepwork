<template>
  <div class="join-org-container">
    <div class="join-org-title">
      欢迎来到 Tatfook教学馆 ，学习优质课程，请输入邀请码：
    </div>
    <div class="join-org-tips">
      如需购买邀请码，请联系管理员：联系电话
    </div>
    <div class="join-org-form">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="邀请码" prop="key">
          <el-input placeholder="请输入邀请码" v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input placeholder="请输入姓名" v-model="form.realname"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
  methods: {
    ...mapActions({
      joinOrg: 'org/student/joinOrg'
    }),
    onSubmit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const res = await this.joinOrg({ ...this.form })
          console.log(res)
        } else {
          return false
        }
      })
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

