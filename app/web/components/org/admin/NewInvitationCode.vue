<template>
  <div class="new-invitation-code">
    <div class="new-invitation-code-top clearfix">
      <div class="new-invitation-code-top-total">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'InvitationCode' }">{{$t('org.studentInvitationCodeManagement')}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t('org.generateInvitationCode')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="new-invitation-code-top-operation">
        <el-button class="new-invitation-code-top-operation-button new-invitation-code-top-operation-button-export" @click="cancelCreateActiveCode()">{{$t('common.Cancel')}}</el-button>
        <el-button :disabled="disabledCreate" type="primary" class="new-invitation-code-top-operation-button" :loading="isLoading" @click="createActiveCode()">{{$t('common.Sure')}}</el-button>
      </div>
    </div>
    <div class="new-invitation-code-content">
      <el-form ref="form" :model="codeAssociateInfo" :rules="codeAssociateInfoRules" label-width="120px" :hide-required-asterisk="true">
        <el-form-item :label="$t('org.classLabel')" prop="classId">
          <el-select v-model="codeAssociateInfo.classId" :placeholder="$t('org.pleaseSelect')" size="medium">
            <el-option v-for="(classItem, index) in orgClassesFilter" :key="index" :label="classItem.name" :value="classItem.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="quantity">
          <template slot="label">
            <el-radio v-model="radioValue" label="byCount">
              <span>生成指定数量</span>
            </el-radio>
          </template>
          <el-input-number placeholder="1 ~ 100之间" :min="1" :max="100" :disabled="radioValue !== 'byCount'" v-model="codeAssociateInfo.quantity" size="medium"></el-input-number>
          <div class="new-invitation-code-content-tips">数量在1 ~ 100之间</div>
        </el-form-item>
        <el-form-item prop="studentNames">
          <template slot="label">
            <el-radio v-model="radioValue" label="byName">
              <span>输入学生姓名</span>
            </el-radio>
          </template>
          <el-input class="new-invitation-code-content-textarea" placeholder="每行一位" type="textarea" :autosize="{ minRows: 3, maxRows: 20 }" :disabled="radioValue !== 'byName'" v-model="codeAssociateInfo.studentNames" size="medium"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'NewInvitationCode',
  data() {
    const checkQuantity = (rule, value, callback) => {
      if (this.radioValue === 'byCount' && !value) {
        return callback(new Error('请填写生成数量'))
      }
    }

    const checkStudentName = (rule, value, callback) => {
      if (this.radioValue === 'byName' && !value.trim()) {
        callback(new Error('请填写学生姓名'))
      }
    }

    return {
      radioValue: 'byCount',
      isLoading: false,
      codeAssociateInfo: {
        quantity: '',
        classId: '',
        studentNames: ''
      },
      codeAssociateInfoRules: {
        quantity: [{ validator: checkQuantity, trigger: 'blur' }],
        studentNames: [{ validator: checkStudentName, trigger: 'blur' }]
      }
    }
  },
  async mounted() {
    await this.getCurrentOrgClassList()
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgClassesById: 'org/getOrgClassesById'
    }),
    disabledCreate() {
      if (this.radioValue === 'byCount') {
        return (
          !this.codeAssociateInfo.quantity || !this.codeAssociateInfo.classId
        )
      }
      if (this.radioValue === 'byName') {
        return (
          !this.codeAssociateInfo.studentNames.trim() ||
          !this.codeAssociateInfo.classId
        )
      }
      return true
    },
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    },
    orgClassesFilter() {
      const today = +new Date()
      return _.filter(this.orgClasses, item => +new Date(item.end) > today)
    }
  },
  methods: {
    ...mapActions({
      createBatchCode: 'org/createBatchCode',
      getCurrentOrgClassList: 'org/getCurrentOrgClassList'
    }),
    cancelCreateActiveCode() {
      this.$router.push({ name: 'InvitationCode' })
    },
    async createActiveCode() {
      this.isLoading = true
      if (this.radioValue === 'byCount') {
        await this.createBatchCode({
          count: this.codeAssociateInfo.quantity,
          classId: this.codeAssociateInfo.classId
        }).catch(e => {
          this.$message.error('创建失败')
          this.isLoading = false
        })
      }
      if (this.radioValue === 'byName') {
        const names = this.codeAssociateInfo.studentNames
          .split('\n')
          .filter(v => v)
        if (names.length > 100) {
          this.$message.error('一次最多只能生成100个学生的邀请码')
          this.isLoading = false
          return
        }
        await this.createBatchCode({
          count: names.length,
          classId: this.codeAssociateInfo.classId,
          names
        }).catch(e => {
          this.$message.error('创建失败')
          this.isLoading = false
        })
      }
      let currentClass = this.orgClasses.find(i => {
        return i.id === this.codeAssociateInfo.classId
      })
      this.$router.push({
        name: 'PrintInvitationCode',
        query: {
          classId: currentClass.id,
          className: currentClass.name,
          begin: currentClass.begin,
          end: currentClass.end
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.new-invitation-code {
  background: #fff;
  border: solid 1px #e8e8e8;
  &-top {
    min-height: 56px;
    border-bottom: solid 2px #e8e8e8;
    &-total {
      float: left;
      /deep/ .el-breadcrumb {
        font-size: 16px;
        line-height: 56px;
        font-weight: normal;
        padding-left: 26px;
        .el-breadcrumb__item {
          .el-breadcrumb__inner {
            color: #999;
          }
          &:last-child .el-breadcrumb__inner {
            color: #333;
          }
        }
      }
    }
    &-operation {
      float: right;
      min-height: 56px;
      line-height: 56px;
      &-button {
        margin-right: 20px;
        min-width: 112px;
        border-radius: 4px;
        border: solid 1px #2397f3;
        &-export {
          color: #2397f3;
        }
      }
    }
  }
  &-content {
    padding: 30px;
    /deep/ .el-form {
      .el-form-item {
        .el-form-item__content {
          .el-input-number--medium {
            width: 280px;
          }
          .el-input {
            .el-input__inner {
              width: 280px;
            }
          }
        }
      }
    }
    &-tips {
      font-size: 12px;
      color: #909399;
    }
    &-textarea {
      width: 280px;
    }
  }
}
.clearfix::after {
  content: '';
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.clearfix {
  zoom: 1;
}
</style>

