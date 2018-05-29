<template>
  <div class="website-basic-message">
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
      <el-button type='primary'>{{$t('editor.save')}}</el-button>
      <el-button>{{$t('editor.cancel')}}</el-button>
    </div>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'WebsiteSettingBasicMessage',
  mounted() {
    this.basicMessage = this.getPersonalSiteInfoByPath('kaitlyn/basic')
  },
  data() {
    return {
      basicMessage: {}
    }
  },
  computed: {
    ...mapGetters({
      getPersonalSiteInfoByPath: 'user/getPersonalSiteInfoByPath'
    })
  },
  methods: {
    ...mapActions({
      gitlabSaveFile: 'gitlab/saveFile'
    }),
    siteLogoUpload(e) {
      let uploadingFile = e.target.files[0]
      let fileReader = new FileReader()
      fileReader.readAsDataURL(uploadingFile)
      fileReader.onload = function(fileDetail) {
        let imgBase64 = fileDetail.target.result
        console.log(imgBase64)
        // let savePath =  '/'+ self.dataSource.username +'_images/' + 'img_' + (new Date()).getTime();
        // this.gitlabSaveFile({
        //   inputPath: '',
        //   content: imgBase64
        // })
      }
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
      object-fit: cover;
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
