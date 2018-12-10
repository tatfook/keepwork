<template>
  <div class="website-basic-message" v-loading='loading'>
    <div class="website-basic-message-content">
      <el-form label-position='left' ref='basicMessageForm' :rules="basicInfoRules" :model='basicMessage' label-width='82px'>
        <el-form-item class="display-name-item" :label="$t('setting.siteName') + ':'" prop="displayName">
          <el-input size='' v-model="basicMessage.displayName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('setting.siteLink') + ':'">
          <span>{{siteUrl}}</span>
        </el-form-item>
        <el-form-item :label="$t('setting.siteLogo') + ':'">
          <div class="before-cropper-zone">
            <img class="profile" :src='basicMessage.extra.logoUrl' alt="">
            <div class="operate-masker">
              <span class="to-change-btn" @click="showMediaSkyDriveDialog()">
                {{ $t('setting.change') }}
              </span>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('setting.siteIntro') + ':'">
          <el-input type='textarea' v-model="basicMessage.description"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <dialog-operations class="website-basic-message-operations" @save="submitChange" @close="handleClose"></dialog-operations>
    <sky-drive-manager-dialog :isSiteMode='false' :mediaLibrary='true' :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import { mapGetters, mapActions } from 'vuex'
import DialogOperations from './DialogOperations'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
export default {
  name: 'WebsiteSettingBasicMessage',
  props: {
    sitePath: String
  },
  async mounted() {
    await this.userGetWebsiteDetailInfoByPath({
      path: this.sitePath
    })
    this.basicMessage = _.cloneDeep(
      this.getSiteDetailInfoByPath(this.sitePath).siteinfo
    )

    if(!this.basicMessage.displayName) {
      this.basicMessage.displayName = this.basicMessage.sitename
    }

    let websiteSetting = _.get(this.basicMessage, 'extra.websiteSetting', '')
    if (websiteSetting) {
      this.$set(this.basicMessage, 'extra', {
        ...websiteSetting,
        ...this.basicMessage.extra
      })
    }
    this.$refs.basicMessageForm.resetFields()
    this.loading = false
  },
  data() {
    return {
      basicMessage: {
        extra: {}
      },
      loading: true,
      basicInfoRules: {
        name: [
          {
            max: 30,
            message: this.$t('setting.siteNameMaxLen'),
            trigger: 'change'
          }
        ]
      },
      isMediaSkyDriveDialogShow: false
    }
  },
  computed: {
    ...mapGetters({
      getSiteDetailInfoByPath: 'user/getSiteDetailInfoByPath',
      getSiteDetailInfoDataSourceByPath:
        'user/getSiteDetailInfoDataSourceByPath'
    }),
    siteUrl() {
      let origin = location.origin
      return `${origin}/${this.basicMessage.username}/${
        this.basicMessage.sitename
      }`
    }
  },
  methods: {
    ...mapActions({
      gitlabUploadFile: 'gitlab/uploadFile',
      userGetWebsiteDetailInfoByPath: 'user/getWebsiteDetailInfoByPath',
      userSaveSiteBasicSetting: 'user/saveSiteBasicSetting'
    }),
    showMediaSkyDriveDialog() {
      this.isMediaSkyDriveDialogShow = true
    },
    async closeSkyDriveManagerDialog({ file, url }) {
      this.isMediaSkyDriveDialogShow = false

      if (url && this.basicMessage && this.basicMessage.extra) {
        this.basicMessage.extra.logoUrl = url
      }
    },
    async siteLogoUpload(e) {
      this.loading = true
      let uploadingFile = e.target.files[0]
      let fileDetail = await this.readFileFromLocal(uploadingFile)
      await this.uploadFileToGitlab(fileDetail, uploadingFile.name)
      this.loading = false
    },
    async uploadFileToGitlab(fileDetail, fileName) {
      let that = this
      let imgBase64 = fileDetail.target.result
      await that
        .gitlabUploadFile({
          fileName,
          content: imgBase64,
          sitePath: this.sitePath
        })
        .then(result => {
          that.basicMessage.logoUrl = result
        })
        .catch(error => {
          console.log(error)
        })
    },
    async readFileFromLocal(uploadingFile) {
      let fileReader = new FileReader()
      fileReader.readAsDataURL(uploadingFile)
      return new Promise((resolve, reject) => {
        fileReader.onload = function(fileDetail) {
          resolve(fileDetail)
        }
      })
    },
    async checkSensitive() {
      let checkedWords = [
        this.basicMessage.displayName,
        this.basicMessage.description
      ]
      let result = await checkSensitiveWords({ checkedWords })
      return result && result.length > 0
    },
    async submitChange() {
      this.loading = true
      this.$refs.basicMessageForm.validate(async valid => {
        if (valid) {
          let isSensitive = await this.checkSensitive()
          if (isSensitive) {
            this.loading = false
            return
          }
          await this.userSaveSiteBasicSetting({
            newBasicMessage: this.basicMessage
          })
          this.showResultInfo()
          this.$emit('close')
        } else {
          this.loading = false
          return false
        }
      })
    },
    showResultInfo() {
      this.loading = false
      this.$message({
        message: this.$t('common.saveSuccess'),
        type: 'success'
      })
    },
    showErrorMsg(errorMsg) {
      this.loading = false
      this.$alert(errorMsg, this.$t('common.errorInfoTitle'), {
        confirmButtonText: this.$t('common.Sure')
      })
    },
    handleClose() {
      this.$emit('close')
    }
  },
  components:{
    SkyDriveManagerDialog,
    DialogOperations
  }
}
</script>
<style lang="scss">
.website-basic-message {
  display: flex;
  height: 100%;
  &-content {
    flex: 1;
    border-right: 15px solid #cdd4db;
    padding: 35px 0 0 100px;
    .display-name-item {
      margin-bottom: 0;
    }
    .el-input,
    .el-textarea {
      width: 327px;
    }
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    .el-form-item__error {
      bottom: 100%;
      top: auto;
    }
    .el-textarea__inner {
      height: 187px;
      resize: none;
    }
    .before-cropper-zone {
      width: 320px;
      height: 200px;
      position: relative;
    }
    .before-cropper-zone:hover .operate-masker {
      display: block;
    }
    .operate-masker {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      text-align: center;
      line-height: 200px;
      display: none;
    }
    .to-change-btn {
      width: 60px;
      height: 30px;
      line-height: 30px;
      color: #333;
      background-color: #fff;
      display: inline-block;
      text-align: center;
      border-radius: 50px;
      position: relative;
    }
    .input-file {
      position: absolute;
      cursor: pointer;
      right: 0;
      opacity: 0;
    }
    .profile {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .vue-cropper {
      width: 340px;
      height: 220px;
    }
  }
  &-operations{
    width: 120px;
  }
}
</style>
