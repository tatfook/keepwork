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
        <div class="org-setting-item">
          <div class="org-setting-item-label">招生信息</div>
          <el-input class="org-setting-item-input" v-model.trim="admissionMsg" label="机构招生老师的联系方式"></el-input>
        </div>
        <div class="org-setting-item">
          <div class="org-setting-item-label">机构宣传信息设置
            <el-popover popper-class="org-setting-popover" placement="right-start" width="875" trigger="click">
              <p>机构宣传信息将显示在学生的点评报告中，如下图：</p>
              <img src="@/assets/org/evaluation_demo.png" alt="">
              <span slot="reference" class="org-setting-item-label-help">?</span>
            </el-popover>
          </div>
          <div class="org-setting-item-propaganda">
            <div class="org-setting-item-propaganda-item">
              <div class="org-setting-item-propaganda-label">
                <span>(可选)</span>二维码
              </div>
              <div class="org-setting-item-propaganda-preview">
                <img :src="QRCode" alt="">
                <div v-show="!QRCode" class="org-setting-item-propaganda-preview-empty" @click="showSkyDriveDialog">
                  <i class="el-icon-circle-plus"></i>
                  <p>添加图片</p>
                </div>
                <div v-show="QRCode" class="org-setting-item-propaganda-preview-modify hover-show">
                  <el-button size="mini" round @click="showSkyDriveDialog">更换</el-button>
                  <el-button size="mini" icon="el-icon-delete" circle @click="QRCode=''"></el-button>
                </div>
              </div>
              <div class="org-setting-item-propaganda-info">建议尺寸：120*120</div>
            </div>
            <div class="org-setting-item-propaganda-item">
              <div class="org-setting-item-propaganda-label">
                <span>(可选)</span>宣传文案
              </div>
              <el-input type="textarea" resize="none" :rows="2" placeholder="请输入" v-model.trim="propaganda">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <el-button v-loading="isSaving" class="org-setting-operation" :disabled='!isSavable' type="primary" @click="savePrivilege">{{$t('common.Save')}}</el-button>
    </div>
    <sky-drive-manager-dialog :isApplicable='true' :isVideoShow='false' :isNoMediaFileShow="false" :show='isSkyDriveShow' @close='closeSkyDrivDialog' />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
export default {
  name: 'OrgSetting',
  mounted() {
    this.teacherPrivilege = this.orgPriviledge & this.teacherPrivilegeVal
    this.originTeacherPrivilege = this.teacherPrivilege
    this.admissionMsg = this.orgAdmissionMsg
    this.QRCode = this.orgQRCode
    this.propaganda = this.orgPropaganda
    this.originAdmissionMsg = this.admissionMsg
  },
  data() {
    return {
      teacherPrivilegeVal: 3,
      isSaving: false,
      teacherPrivilege: undefined,
      originTeacherPrivilege: undefined,
      admissionMsg: '',
      originAdmissionMsg: '',
      QRCode: '',
      propaganda: '',
      isSkyDriveShow: false
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg'
    }),
    orgPriviledge() {
      return _.get(this.currentOrg, 'privilege')
    },
    originExtra() {
      return _.get(this.currentOrg, 'extra', {})
    },
    orgAdmissionMsg() {
      return _.get(this.currentOrg, 'extra.admissionMsg')
    },
    orgQRCode() {
      return _.get(this.currentOrg, 'extra.QRCode')
    },
    orgPropaganda() {
      return _.get(this.currentOrg, 'extra.propaganda')
    },
    isSavable() {
      return (
        this.originTeacherPrivilege !== this.teacherPrivilege ||
        this.originAdmissionMsg !== this.admissionMsg ||
        this.orgQRCode !== this.QRCode ||
        this.orgPropaganda !== this.propaganda
      )
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
          privilege: this.teacherPrivilege,
          extra: {
            ...this.originExtra,
            admissionMsg: this.admissionMsg,
            propaganda: this.propaganda,
            QRCode: this.QRCode
          }
        }
      })
        .then(() => {
          this.isSaving = false
          this.originTeacherPrivilege = this.teacherPrivilege
          this.originAdmissionMsg = this.admissionMsg
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
    },
    showSkyDriveDialog() {
      this.isSkyDriveShow = true
    },
    closeSkyDrivDialog({ url }) {
      this.isSkyDriveShow = false
      if (url) this.QRCode = url
    }
  },
  watch: {
    orgPriviledge(privilege) {
      this.teacherPrivilege = privilege & this.teacherPrivilegeVal
    },
    orgAdmissionMsg(admissionMsg) {
      this.admissionMsg = admissionMsg
    }
  },
  components: {
    SkyDriveManagerDialog
  }
}
</script>
<style lang="scss" scoped>
.org-setting {
  background-color: #fff;
  border-radius: 8px;
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
    margin-bottom: 36px;
    display: flex;
    &:last-child {
      margin-bottom: 0;
    }
    &-label {
      display: inline-block;
      font-size: 14px;
      color: #909399;
      margin-right: 24px;
      width: 200px;
      text-align: right;
      position: relative;
      &-help {
        position: absolute;
        border: 8px solid #d9ecff;
        border-radius: 50%;
        display: inline-block;
        width: 24px;
        height: 24px;
        background-color: #409efe;
        color: #fff;
        text-align: center;
        line-height: 24px;
        font-size: 18px;
        top: 28px;
        right: 42px;
      }
    }
    &-input {
      width: 200px;
    }
    &-propaganda {
      flex: 1;
      border: 1px solid #e8e8e8;
      max-width: 586px;
      padding: 24px 20px 0;
      &-item {
        display: flex;
        font-size: 14px;
        margin-bottom: 36px;
      }
      &-label {
        width: 103px;
        margin-right: 16px;
        flex-shrink: 0;
      }
      &-preview {
        margin-right: 12px;
        width: 120px;
        height: 120px;
        background-color: #eeeded;
        position: relative;
        text-align: center;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        &-empty,
        &-modify {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
        }
        &-empty {
          color: #909399;
          padding-top: 28px;
          cursor: pointer;
          .el-icon-circle-plus {
            font-size: 30px;
            color: #409efe;
          }
        }
        &-modify {
          padding-top: 48px;
          background-color: rgba(0, 0, 0, 0.5);
          .el-button.is-round {
            font-size: 14px;
            padding: 4px 11px;
            background-color: #ecf5ff;
            color: #409efe;
          }
          .el-button.is-circle {
            padding: 5px;
          }
          .el-button + .el-button {
            margin-left: 8px;
          }
        }
        .hover-show {
          display: none;
        }
        &:hover {
          .hover-show {
            display: inline-block;
          }
        }
      }
      &-info {
        font-size: 12px;
        color: #bebebe;
      }
    }
  }
  &-operation {
    margin-left: 228px;
    width: 88px;
    height: 36px;
    line-height: 36px;
    padding: 0;
    font-size: 14px;
  }
}
</style>
