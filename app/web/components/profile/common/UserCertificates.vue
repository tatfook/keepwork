<template>
  <div class="user-certificate">
    <el-card class="user-certificate-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>{{$t("profile.myCertificates")}}</span>
        <el-button v-if="isLoginUserEditable" v-show="!isCertificateEmpty" class="user-certificate-card-header-button" type="text" @click="showAddingDialog">{{$t("profile.add")}}</el-button>
      </div>
      <div class="user-certificate-list" v-if="!isCertificateEmpty" v-loading="isLoading">
        <div class="user-certificate-item" v-for="(certificate, index) in userCertifications" :key="index">
          <div class="user-certificate-item-header">
            <span class="user-certificate-item-title">{{certificate.title}}</span>
            <span class="user-certificate-item-date">{{certificate.getDate | formatDate}}</span>
            <div class="user-certificate-item-operations" v-if="isLoginUserEditable">
              <el-button type="text" @click="editCertificate(certificate, index)">
                <i class="iconfont icon-edit-square"></i>{{$t("profile.edit")}}
              </el-button>
              <el-button type="text" @click="deleteCertificate(certificate, index)">
                <i class="iconfont icon-delete1"></i>{{$t("profile.delete")}}
              </el-button>
            </div>
          </div>
          <p v-show="certificate.description">{{certificate.description}}</p>
        </div>
      </div>
      <div class="user-certificate-empty" v-if="isCertificateEmpty">
        <img src="@/assets/img/default_certificate.png" alt="">
        <p><span v-if="isLoginUserEditable" class="user-certificate-empty-anchor" @click="showAddingDialog">{{$t("profile.add")}}</span>{{isLoginUserEditable ? $t("profile.addCertificatesInfo") : $t("profile.noContentForCertificate")}}</p>
      </div>
    </el-card>
    <el-dialog v-if="isLoginUserEditable" :title="$t('profile.addCertificate')" :visible.sync="isAddingDialogVisible" v-loading="isLoading" class="user-certificate-adding-dialog" :before-close="handleAddingDialogClose">
      <el-form label-position="top" :model="newCertificate">
        <el-form-item :label="$t('profile.name')">
          <el-input v-model="newCertificate.title"></el-input>
        </el-form-item>
        <el-form-item :label="$t('profile.gainAt')">
          <el-date-picker v-model="newCertificate.getDate" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('profile.certificateDescription')">
          <el-input type="textarea" resize="none" v-model="newCertificate.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddingDialogClose">{{$t("common.Cancel")}}</el-button>
        <el-button type="primary" @click="handleAddCertificate">{{$t("common.Sure")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'UserCertificates',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    },
    isLoginUserEditable: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.userCertifications = _.cloneDeep(
      _.get(this.nowUserDetail, 'extra.certificates', [])
    )
  },
  data() {
    return {
      editingIndex: undefined,
      isAddingDialogVisible: false,
      isLoading: false,
      userCertifications: [],
      updatingCertifications: [],
      newCertificate: {}
    }
  },
  computed: {
    ...mapGetters({
      isRealNamed: 'user/isRealNamed'
    }),
    isEditMode() {
      return !_.isUndefined(this.editingIndex)
    },
    isCertificateEmpty() {
      return Boolean(
        this.userCertifications && this.userCertifications.length == 0
      )
    },
    originExtra() {
      return _.cloneDeep(_.get(this.nowUserDetail, 'extra'))
    },
    updatingExtra() {
      return _.mergeWith(
        this.originExtra,
        {
          certificates: this.updatingCertifications
        },
        (objValue, srcValue) => {
          return srcValue
        }
      )
    },
    updatingUserInfo() {
      return _.mergeWith(
        this.nowUserDetail,
        {
          extra: this.updatingExtra
        },
        (objValue, srcValue) => {
          return srcValue
        }
      )
    }
  },
  methods: {
    ...mapActions({
      toggleRealName: 'user/toggleRealName',
      userUpdateUserInfo: 'user/updateUserInfo'
    }),
    showAddingDialog() {
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      this.isAddingDialogVisible = true
      this.updatingCertifications = _.cloneDeep(this.userCertifications)
    },
    handleAddingDialogClose() {
      this.isAddingDialogVisible = false
      this.editingIndex = undefined
      this.newCertificate = {}
    },
    async handleAddCertificate() {
      if (this.isEditMode) {
        this.updatingCertifications[this.editingIndex] = this.newCertificate
      } else {
        this.updatingCertifications.push(this.newCertificate)
      }
      await this.updateData()
    },
    async updateData() {
      this.isLoading = true
      await this.userUpdateUserInfo(this.updatingUserInfo).catch()
      this.isLoading = false
      this.handleAddingDialogClose()
    },
    editCertificate(certificate, index) {
      this.newCertificate = _.cloneDeep(certificate)
      this.editingIndex = index
      this.showAddingDialog()
    },
    async deleteCertificate(certificate, index) {
      let updatingCertifications = _.cloneDeep(this.userCertifications)
      updatingCertifications.splice(index, 1)
      this.updatingCertifications = updatingCertifications
      await this.updateData()
    }
  },
  watch: {
    nowUserDetail() {
      this.userCertifications = _.cloneDeep(
        _.get(this.nowUserDetail, 'extra.certificates', [])
      )
    }
  },
  filters: {
    formatDate(date) {
      return moment(date).format('YYYY / MM')
    }
  }
}
</script>
<style lang="scss">
.user-certificate {
  &-card {
    .el-card__header {
      font-weight: bold;
      padding: 18px 16px;
    }
    .el-card__body {
      padding: 24px 16px;
    }
    &-header {
      &-button {
        float: right;
        padding: 3px 0;
        font-size: 12px;
        color: #909399;
      }
      &-button + &-button {
        margin-right: 6px;
      }
    }
  }
  &-list {
    font-size: 14px;
    color: #555;
  }
  &-item {
    margin-bottom: 8px;
    border-bottom: 1px dashed #e8e8e8;
    & > p {
      margin: 8px 0;
      font-size: 12px;
      color: #909399;
      word-break: break-all;
    }
    &:last-child {
      margin-bottom: 0;
      border-bottom: none;
      & > p {
        margin-bottom: 0;
      }
    }
    &-header {
      display: flex;
      position: relative;
    }
    &-title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-date {
      font-size: 12px;
      color: #909399;
      margin-left: 8px;
    }
    &-operations {
      position: absolute;
      right: 0;
      background-color: #fff;
      display: none;
      .el-button {
        padding: 0;
        font-size: 12px;
        color: #909399;
      }
      .el-button + .el-button {
        margin-left: 4px;
      }
      .el-button:hover {
        color: #2397f3;
      }
    }
    &:hover &-operations {
      display: inline-block;
    }
  }
  &-empty {
    color: #909399;
    font-size: 14px;
    text-align: center;
    &-anchor {
      color: #2397f3;
      cursor: pointer;
    }
  }
  &-adding-dialog {
    .el-dialog {
      width: 416px;
      max-width: 100%;
    }
    .el-dialog__header {
      border-bottom: 1px solid #e8e8e8;
      padding: 16px;
    }
    .el-dialog__title {
      font-size: 16px;
      font-weight: bold;
    }
    .el-dialog__body {
      padding: 24px 16px 0;
    }
    .el-form--label-top .el-form-item__label {
      line-height: 1;
    }
    .el-form-item {
      margin-bottom: 24px;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    .el-textarea__inner {
      height: 96px;
    }
    .el-button {
      width: 88px;
      height: 36px;
      line-height: 36px;
      padding: 0 16px;
    }
  }
}
</style>
<style lang="scss">
@media only screen and (max-width: 991px) {
  .user-certificate {
    &-card {
      border-radius: 0;
      border-width: 1px 0;
      .el-card__header {
        padding: 9px 16px;
      }
      .el-card__body {
        padding: 16px;
      }
    }
    &-adding-dialog {
      padding: 0 16px;
    }
  }
}
</style>
