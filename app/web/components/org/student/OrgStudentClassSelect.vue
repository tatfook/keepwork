<template>
  <div class="org-student-class-select">
    <div class="org-student-class-select-row border-bottom">
      <span class="org-student-class-select-row-left">
        加入新班级，请输入：
      </span>
      <span class="org-student-class-select-row-right">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="邀请码" prop="key">
            <el-input placeholder="请输入邀请码" v-model.trim="form.key"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realname">
            <el-input placeholder="请输入姓名" v-model.trim="form.realname"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="disabeldSubmitButton" type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </span>
    </div>
    <div class="org-student-class-select-row">
      <span class="org-student-class-select-row-left">
        已加入的班级：
      </span>
      <span class="org-student-class-select-row-right">
        <div v-for="item in orgClasses" :key="item.id">
          <span class="class-select-option">
            <i class="iconfont icon-team class-select-option-icon"></i>
            <span class="class-select-option-name">
              {{ item.name}}
            </span>
            <el-button @click="enterClass(item.id)" class="enter-button" type="primary" size="mini">进入</el-button>
          </span>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgStudentClassSelect',
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
  computed: {
    ...mapGetters({
      orgRealName: 'org/student/orgRealName',
      orgClasses: 'org/student/orgClasses',
      organizationId: 'org/currentOrgId'
    }),
    disabeldSubmitButton() {
      return !(this.form.realname.trim() && this.form.key.trim())
    }
  },
  async mounted() {
    await this.getStudentInfo()
    this.form.realname = this.orgRealName
  },
  methods: {
    ...mapActions({
      joinOrgClass: 'org/student/joinOrgClass',
      getStudentInfo: 'org/student/getStudentInfo'
    }),
    onSubmit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const { classId = '' } = await this.joinOrgClass({
            ...this.form,
            organizationId: this.organizationId
          })
          if (classId) {
            this.$router.push({
              name: 'OrgStudentClassDetail',
              params: {
                classId
              }
            })
          }
        } else {
          return false
        }
      })
    },
    enterClass(classId) {
      this.$router.push({
        name: 'OrgStudentClassDetail',
        params: {
          classId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.org-student-class-select {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  &-row {
    display: flex;
    padding-top: 32px;
    &.border-bottom {
      border-bottom: solid 1px #e8e8e8;
    }
    &-left {
      width: 200px;
      text-align: right;
      padding-top: 8px;
    }
    &-right {
      .class-select-option {
        cursor: pointer;
        display: inline-block;
        height: 45px;
        min-width: 300px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 10px;
        &-icon {
          font-size: 26px;
          margin-right: 10px;
        }
        .enter-button {
          visibility: hidden;
          margin-left: auto;
        }
        &:hover {
          background: #eee;
          .enter-button {
            visibility: visible;
          }
        }
      }
    }
  }
}
</style>