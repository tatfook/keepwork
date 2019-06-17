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
        <el-button :disabled="!codeAssociateInfo.quantity || !codeAssociateInfo.classId" type="primary" class="new-invitation-code-top-operation-button" @click="createActiveCode()">{{$t('common.Sure')}}</el-button>
      </div>
    </div>
    <div class="new-invitation-code-content">
      <el-form ref="form" :model="codeAssociateInfo" :rules="codeAssociateInfoRules" label-width="80px" :hide-required-asterisk="true">
        <el-form-item :label="$t('org.codeCount')" prop="quantity">
          <el-input v-model="codeAssociateInfo.quantity" size="medium"></el-input>
        </el-form-item>
        <el-form-item :label="$t('org.classLabel')" prop="classId">
          <el-select v-model="codeAssociateInfo.classId" :placeholder="$t('org.pleaseSelect')" size="medium">
            <el-option v-for="(classItem, index) in orgClassesFilter" :key="index" :label="classItem.name" :value="classItem.id"></el-option>
          </el-select>
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
    return {
      codeAssociateInfo: {
        quantity: 1,
        classId: ''
      },
      codeAssociateInfoRules: {
        quantity: [
          { required: true, message: '请填写生成数量', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgClassesById: 'org/getOrgClassesById'
    }),
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
      createBatchCode: 'org/createBatchCode'
    }),
    cancelCreateActiveCode() {
      this.$router.push({ name: 'InvitationCode' })
    },
    async createActiveCode() {
      let codeList = await this.createBatchCode({
        count: this.codeAssociateInfo.quantity,
        classId: this.codeAssociateInfo.classId
      })
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
          .el-input {
            .el-input__inner {
              width: 280px;
            }
          }
        }
      }
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

