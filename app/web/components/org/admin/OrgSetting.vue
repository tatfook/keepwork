<template>
  <div class="org-setting">
    <div class="org-setting-header">{{$t('org.settings')}}</div>
    <div class="org-setting-content">
      <div class="org-setting-list">
        <div class="org-setting-item">
          <div class="org-setting-item-label">{{$t('org.allowTeacherToManage')}}</div>
          <el-radio-group v-model="teacherPrivilege">
            <el-radio :label="teacherPrivilegeVal">{{$t('common.Yes')}}</el-radio>
            <el-radio :label="0">{{$t('common.No')}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <el-button v-loading="isSaving" class="org-setting-operation" :disabled='isSavable' type="primary" @click="savePrivilege">{{$t('common.Save')}}</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'OrgSetting',
  mounted() {
    this.teacherPrivilege = this.orgPriviledge & this.teacherPrivilegeVal
    this.originTeacherPrivilege = this.teacherPrivilege
  },
  data() {
    return {
      teacherPrivilegeVal: 3,
      isSaving: false,
      teacherPrivilege: undefined,
      originTeacherPrivilege: undefined
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg'
    }),
    orgPriviledge() {
      return _.get(this.currentOrg, 'privilege')
    },
    isSavable() {
      return this.originTeacherPrivilege === this.teacherPrivilege
    }
  },
  methods: {
    ...mapActions({
      updateOrg: 'org/updateOrg'
    }),
    async savePrivilege() {
      this.isSaving = true
      await this.updateOrg({
        orgLoginUrl: _.get(this.currentOrg, 'loginUrl'),
        orgId: _.get(this.currentOrg, 'id'),
        orgData: {
          privilege: this.teacherPrivilege
        }
      })
        .then(() => {
          this.isSaving = false
          this.originTeacherPrivilege = this.teacherPrivilege
          this.$message({
            type: 'success',
            message: this.$t('common.saveSuccess')
          })
        })
        .catch(error => {
          this.isSaving = false
          this.$message({
            type: 'error',
            message: this.$t('common.saveFail')
          })
        })
    }
  },
  watch: {
    orgPriviledge(privilege) {
      this.teacherPrivilege = privilege & this.teacherPrivilegeVal
    }
  }
}
</script>
<style lang="scss" scoped>
.org-setting {
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  &-header {
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 16px;
    color: #333;
    padding-left: 24px;
  }
  &-content {
    padding-left: 24px;
  }
  &-list {
    padding: 24px 0 48px;
  }
  &-item {
    &-label {
      display: inline-block;
      font-size: 14px;
      color: #909399;
      margin-right: 24px;
    }
  }
  &-operation {
    margin-left: 220px;
    width: 88px;
    height: 36px;
    line-height: 36px;
    padding: 0;
    font-size: 14px;
  }
}
</style>
