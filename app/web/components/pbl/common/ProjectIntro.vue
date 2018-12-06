<template>
  <div class="project-website">
    <el-card class="project-website-card" shadow="never">
      <p class="project-website-info">{{$t("project.welcomeTo")}}{{originProjectDetail.name}}</p>
      <div class="project-website-operations" v-show="isLoginUserEditable || originInfoSiteData.displayName">
        <el-button @click="handleFakeButtonClick" size='small' type="primary">{{originInfoSiteData.displayName || $t("project.websiteSettingForResource")}}</el-button>
        <i v-show="isLoginUserEditable && isHaveOriginInfoSiteData" class="el-icon-edit-outline" @click='showEditInfoSiteDataDialog'></i>
      </div>
    </el-card>
    <el-dialog :title="$t('project.websiteSettingForResource')" :visible.sync="isEditInfoSiteDialogShow" width="420px" :before-close="handleClose" v-loading='isLoading'>
      <el-form label-position="top" :model="tempInfoSiteData">
        <el-form-item :label='$t("project.name")'>
          <el-input v-model="tempInfoSiteData.displayName" maxlength='30' @blur='checkDisplayNameLength'></el-input>
        </el-form-item>
        <el-form-item :label='$t("project.url")'>
          <el-input v-model="tempInfoSiteData.url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{$t("common.Cancel")}}</el-button>
        <el-button type="primary" @click="saveInfoSiteData" :disabled="isSaveButtonDisabled">{{$t("common.Sure")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import { mapActions } from 'vuex'
export default {
  name: 'ProjectIntro',
  props: {
    originProjectDetail: {
      type: Object,
      required: true
    },
    projectId: {
      required: true
    },
    isLoginUserEditable: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.copiedProjectDetail = _.cloneDeep(this.originProjectDetail)
    let originInfoSiteData = _.get(this.copiedProjectDetail, 'extra.infoSite', {
      displayName: '',
      url: ''
    })
    this.tempInfoSiteData = originInfoSiteData
  },
  data() {
    return {
      isEditInfoSiteDialogShow: false,
      isLoading: false,
      tempInfoSiteData: {
        displayName: '',
        url: ''
      }
    }
  },
  computed: {
    originInfoSiteData() {
      return _.get(this.originProjectDetail, 'extra.infoSite', {
        displayName: '',
        url: ''
      })
    },
    isHaveOriginInfoSiteData() {
      let { displayName, url } = this.originInfoSiteData
      return displayName && url
    },
    isSaveButtonDisabled() {
      let isModified = this.isModified
      return !isModified || (isModified && this.isHalfFilled)
    },
    isModified() {
      return !_.isEqual(this.originInfoSiteData, this.tempInfoSiteData)
    },
    isHalfFilled() {
      let { displayName, url } = this.tempInfoSiteData
      return (displayName && !url) || (!displayName && url) ? true : false
    },
    originExtra() {
      return this.originProjectDetail.extra
    },
    mergedExtra() {
      let originExtra = _.cloneDeep(this.originExtra)
      return _.merge(originExtra, {
        infoSite: this.tempInfoSiteData
      })
    },
    updatingProjectData() {
      return _.merge(this.copiedProjectDetail, {
        extra: this.mergedExtra
      })
    }
  },
  methods: {
    ...mapActions({
      pblUpdateProject: 'pbl/updateProject'
    }),
    showEditInfoSiteDataDialog() {
      this.isEditInfoSiteDialogShow = true
    },
    async checkSensitive(checkedWords) {
      let result = await checkSensitiveWords({ checkedWords }).catch()
      return result && result.length > 0
    },
    async saveInfoSiteData() {
      if (!this.checkDisplayNameLength()) {
        return
      }
      this.isLoading = true
      let isSensitive = await this.checkSensitive([
        this.tempInfoSiteData.displayName
      ])
      if (isSensitive) {
        this.isLoading = false
        return
      }
      await this.pblUpdateProject({
        projectId: this.projectId,
        updatingProjectData: this.updatingProjectData
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '资料网站更新成功'
          })
          this.isLoading = false
          this.handleClose()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '资料网站更新失败,请重试'
          })
          this.isLoading = false
          this.handleClose()
          console.error(error)
        })
    },
    handleFakeButtonClick() {
      if (this.isHaveOriginInfoSiteData) {
        let tempWin = window.open('_blank')
        tempWin.location = this.tempInfoSiteData.url
      } else {
        this.showEditInfoSiteDataDialog()
      }
    },
    handleClose() {
      this.tempInfoSiteData = _.cloneDeep(this.originInfoSiteData)
      this.isEditInfoSiteDialogShow = false
    },
    checkDisplayNameLength() {
      let displayName = this.tempInfoSiteData.displayName
      let displayNameLen = displayName.length
      if (displayNameLen < 2 || displayNameLen > 30) {
        this.$message({
          type: 'error',
          message: '资料网站名称最少2位，最多30位'
        })
        return false
      }
      return true
    }
  }
}
</script>
<style lang="scss">
.project-website {
  &-card {
    .el-card__body {
      padding: 24px 16px;
    }
  }
  &-info {
    font-size: 16px;
    color: #303133;
    font-weight: bold;
    word-break: break-word;
    margin: 4px 0 0;
  }
  &-operations {
    margin-top: 24px;
    display: flex;
    align-items: center;
    .el-button {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-icon-edit-outline {
      margin-left: 16px;
      cursor: pointer;
      font-size: 14px;
      color: #909399;
    }
  }
}
</style>
