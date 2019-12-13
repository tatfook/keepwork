<template>
  <div class="org-student-class-select">
    <div class="org-student-class-select-row">
      <span class="org-student-class-select-row-left">
        选择班级进入：
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
import _ from 'lodash'
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
      userinfo: 'org/student/userinfo',
      orgClasses: 'org/student/orgClasses',
      organizationId: 'org/currentOrgId'
    }),
    disabeldSubmitButton() {
      return !_.trim(this.form.realname) || !_.trim(this.form.key)
    },
    orgRealName() {
      return _.get(this.userinfo, 'realname', '')
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
    &-left {
      width: 130px;
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