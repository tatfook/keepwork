<template>
  <div class="website-basic-message" v-loading='loading'>
    <div class="website-basic-message-content">
      <el-form label-position='left' ref='basicMessageForm' :model='basicMessage' label-width='82px'>
        <el-form-item class="display-name-item" label='网站名称：'>
          <el-input size='' v-model="basicMessage.displayName"></el-input>
        </el-form-item>
        <el-form-item label='网站地址：'>
          <span>http://keepwork.com/{{basicMessage.username}}/{{basicMessage.name}}</span>
        </el-form-item>
        <el-form-item label='网站图标：'>
          <div class="before-cropper-zone">
            <img class="profile" :src='basicMessage.logoUrl' alt="">
            <div class="operate-masker">
              <span class="to-change-btn">
                修改
                <input type="file" class="input-file" @change='siteLogoUpload'>
              </span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label='网站介绍：'>
          <el-input placeholder='请输入' type='textarea' v-model="basicMessage.desc"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="website-basic-message-buttons">
      <el-button type='primary' @click="submitChange">{{$t('editor.save')}}</el-button>
      <el-button @click='handleClose'>{{$t('editor.cancel')}}</el-button>
    </div>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'WebsiteSettingBasicMessage',
  async mounted() {
    let path = 'kaitlyn/basic'
    this.basicMessage = await this.getPersonalSiteInfoByPath(path)
    this.loading = false
  },
  data() {
    return {
      basicMessage: {},
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      getPersonalSiteInfoByPath: 'user/getPersonalSiteInfoByPath',
      getSiteDetailInfoDataSourceByPath:
        'user/getSiteDetailInfoDataSourceByPath'
    })
  },
  methods: {
    ...mapActions({
      gitlabUploadFile: 'gitlab/uploadFile',
      userGetWebsiteDetailInfoByPath: 'user/getWebsiteDetailInfoByPath',
      userSaveSiteBasicSetting: 'user/saveSiteBasicSetting'
    }),
    siteLogoUpload(e) {
      this.loading = true
      let uploadingFile = e.target.files[0]
      let fileReader = new FileReader()
      let that = this
      fileReader.readAsDataURL(uploadingFile)
      fileReader.onload = async function(fileDetail) {
        let imgBase64 = fileDetail.target.result
        await that
          .gitlabUploadFile({
            fileName: uploadingFile.name,
            content: imgBase64
          })
          .then(result => {
            that.basicMessage.logoUrl = result
          })
          .catch(error => {
            console.log(error)
          })
        that.loading = false
      }
    },
    async checkSensitive() {},
    async submitChange() {
      this.loading = true
      await this.userSaveSiteBasicSetting({
        newBasicMessage: this.basicMessage
      })
      this.loading = false
      this.showResultInfo()
    },
    showResultInfo(type) {
      let showMessage = ''
      type = type === 'error' ? type : 'success'
      switch (type) {
        case 'error':
          showMessage = '保存失败，请稍后再试'
          break
        default:
          showMessage = '恭喜你，保存成功'
          break
      }
      this.$message({
        message: showMessage,
        type: type
      })
    },
    handleClose() {
      this.$emit('close')
    }
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
  &-buttons {
    text-align: center;
    width: 175px;
    align-self: flex-end;
    padding-bottom: 26px;
    .el-button {
      width: 120px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      padding: 0;
      margin-bottom: 20px;
    }
    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
</style>
