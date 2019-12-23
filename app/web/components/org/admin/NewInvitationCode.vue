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
        <el-form-item prop="classIds">
          <template slot="label">
            <div><span class="new-invitation-code-label-info">(可选)</span>{{$t('org.classLabel')}}</div>
            <el-popover placement="top-start" width="200" trigger="hover">
              <p>选择班级后，使用这些邀请码激活的用户，可学习对应班级的课程。</p>
              <p>若不选择班级，则不能学习班级课程。</p>
              <i slot="reference" class="iconfont icon-help"></i>
            </el-popover>
          </template>
          <el-select multiple collapse-tags v-model="codeAssociateInfo.classIds" :placeholder="$t('org.pleaseSelect')" size="medium">
            <el-option v-for="(classItem, index) in orgClasses" :key="index" :label="classItem.name" :value="classItem.id"></el-option>
          </el-select>
        </el-form-item>
        <invitation-code-types ref="codeTypesRef" />
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
    <invitation-code-warning type="notEnough" :remainder="warningRemainderCount" :isDialogVisible="isWarningVisible" @close="isWarningVisible=false" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import InvitationCodeTypes from './common/InvitationCodeTypes'
import InvitationCodeWarning from './common/InvitationCodeWarning'
import { getIsFormalTypeByValue } from '@/lib/utils/org'

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
        classIds: '',
        studentNames: '',
      },
      codeAssociateInfoRules: {
        quantity: [{ validator: checkQuantity, trigger: 'blur' }],
        studentNames: [{ validator: checkStudentName, trigger: 'blur' }],
      },
      isWarningVisible: false,
      warningRemainderCount: undefined,
    }
  },
  async mounted() {
    await this.getCurrentOrgClassList()
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgClassesById: 'org/getOrgClassesById',
    }),
    disabledCreate() {
      return this.radioValue === 'byCount'
        ? !this.codeAssociateInfo.quantity
        : this.radioValue === 'byName'
        ? !this.codeAssociateInfo.studentNames.trim()
        : true
    },
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    },
  },
  methods: {
    ...mapActions({
      createBatchCode: 'org/createBatchCode',
      getCurrentOrgClassList: 'org/getCurrentOrgClassList',
    }),
    cancelCreateActiveCode() {
      this.$router.push({ name: 'InvitationCode' })
    },
    async createActiveCode() {
      this.isLoading = true
      const self = this
      const codeTypesRef = this.$refs.codeTypesRef
      const type = codeTypesRef.activeTypeValue
      const remainder = codeTypesRef.activeTypeRemainder
      try {
        let names = []
        const isCreateByName = this.radioValue === 'byName'
        if (isCreateByName) {
          names = this.codeAssociateInfo.studentNames.split('\n').filter(v => v)
          if (names.length > 100) throw new Error('一次最多只能生成100个学生的邀请码')
        }
        const count = isCreateByName ? names.length : this.codeAssociateInfo.quantity
        if (getIsFormalTypeByValue(type) && count > remainder) {
          this.warningRemainderCount = remainder
          this.isWarningVisible = true
          throw new Error('该类型邀请码的生成数量不能超过剩余可生成数')
        }
        await this.createBatchCode({
          count,
          classIds: this.codeAssociateInfo.classIds,
          names: isCreateByName ? names : null,
          type,
        })
        let classNameStr = _.join(
          _.map(this.codeAssociateInfo.classIds, classId => {
            return this.orgClasses.find(i => i.id === classId).name
          }),
          '、',
        )
        this.$router.push({
          name: 'PrintInvitationCode',
          query: {
            type,
            className: classNameStr,
          },
        })
      } catch (error) {
        self.$message({ type: 'error', message: error.message })
      }
      this.isLoading = false
    },
  },
  components: {
    InvitationCodeTypes,
    InvitationCodeWarning,
  },
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
        .el-form-item__label {
          position: relative;
        }
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
  &-label-info {
    color: #999;
    margin-right: 2px;
  }
}
.icon-help {
  position: absolute;
  right: 16px;
  top: 20px;
  color: #2397f3;
  cursor: pointer;
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

