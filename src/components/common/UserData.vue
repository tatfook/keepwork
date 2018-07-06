<template>
  <el-container class="user-data-setting" v-loading='loading' @click.stop="handleDialogClick">
    <el-row class="user-data-setting-content">
      <el-col class="user-data-setting-portrait-col">
        <img :src="portrait" alt="" class="user-data-setting-profile">
        <div>
          <div class="user-data-setting-change-profile">
            {{$t('user.modifyAvatar')}}
            <input type="file" accept="image/*" @change="getUserSelectProfile">
          </div>
          <el-button type="primary" v-show='isCroppering' @click='uploadProfileToGitlab'>确定</el-button>
        </div>
      </el-col>
      <el-col class="user-data-setting-form-col">
        <el-form ref="form" :model="userInfo" label-width="80px">
          <el-form-item :label='$t("user.displayName")'>
            <el-input v-model="userInfo.displayName" size="small"></el-input>
          </el-form-item>
          <el-form-item :label='$t("user.sex")'>
            <el-radio-group v-model="userInfo.sex">
              <el-radio label="M">{{$t('user.male')}}</el-radio>
              <el-radio label="F">{{$t('user.female')}}</el-radio>
              <el-radio label="N">{{$t('user.confidentiality')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label='$t("user.location")' size="small">
            <el-input v-model="userInfo.location"></el-input>
          </el-form-item>
          <el-form-item :label='$t("user.introduce")'>
            <el-input type="textarea" resize="none" :rows=6 v-model="userInfo.introduce"></el-input>
          </el-form-item>
        </el-form>
        <vue-cropper v-show="isCroppering" ref="profileCropper" :img="profileCropper.img" :autoCrop="profileCropper.autoCrop" :autoCropWidth="profileCropper.autoCropWidth" :autoCropHeight="profileCropper.autoCropHeight" :fixedBox="profileCropper.fixedBox" :canMoveBox='profileCropper.canMoveBox' @realTime='getPreviewUrl'></vue-cropper>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import _ from 'lodash'
import vueCropper from 'vue-cropper'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'userData',
  mounted() {
    this.userInfo = _.cloneDeep(this.loginUserProfile)
  },
  data() {
    return {
      loading: false,
      userInfo: {},
      isCroppering: false,
      profilePreviewUrl: '',
      uploadingProfileFile: {},
      profileCropper: {
        img: '',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true,
        canMoveBox: false,
        canMove: false
      }
    }
  },
  computed: {
    ...mapGetters({
      loginUserProfile: 'user/profile'
    }),
    portrait() {
      return this.isCroppering
        ? this.profilePreviewUrl
        : _.get(this.userInfo, 'portrait')
    }
  },
  methods: {
    ...mapActions({
      gitlabCreateFile: 'gitlab/createFile'
    }),
    getUserSelectProfile(e) {
      let file = _.get(e, ['target', 'files'])[0]
      this.uploadingProfileFile = file
      let previewUrl = URL.createObjectURL(file)
      this.profileCropper.img = previewUrl
      this.isCroppering = true
    },
    getPreviewUrl(data) {
      this.$refs.profileCropper.getCropData(data => {
        this.profilePreviewUrl = data
      })
    },
    async uploadFileToGitlab() {
      let that = this
      let imgBase64 = this.profilePreviewUrl
      let imgMainContent = imgBase64.split(',')[1]
      let { username, defaultSiteDataSource } = this.loginUserProfile
      let { projectId, rawBaseUrl, dataSourceUsername, projectName } = defaultSiteDataSource
      let fileExtension = this.uploadingProfileFile.type.split('/')[1]
      let path = `/${username}_images/profile_${new Date().getTime()}.${fileExtension}`
      await that
        .gitlabCreateFile({
          path,
          content: imgMainContent,
          userOptions:{
            encoding: 'base64'
          }
        })
        .then(() => {
          let url = `${rawBaseUrl}/${dataSourceUsername}/${projectName}/raw/master${path}`
          that.userInfo.portrait = url
        })
        .catch(error => {
          console.log(error)
        })
    },
    async uploadProfileToGitlab() {
      this.loading = true
      await this.uploadFileToGitlab()
      this.loading = false
      this.isCroppering = false
    }
  },
  components: {
    vueCropper
  }
}
</script>
<style lang='scss' scoped>
.user-data-setting {
  &-content {
    display: flex;
    width: 100%;
    padding: 40px 28px 0 20px;
  }
  &-portrait-col {
    padding-right: 55px;
    width: auto;
    text-align: center;
  }
  &-form-col {
    width: auto;
    flex: 1;
    position: relative;
    .el-radio {
      color: #333;
    }
    .vue-cropper {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  &-change-profile {
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
    input[type='file'] {
      position: absolute;
      opacity: 0;
      left: 0;
      top: 0;
      cursor: pointer;
      font-size: 0;
      width: 100%;
      height: 100%;
    }
  }
  &-profile {
    width: 96px;
    height: 96px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 13px;
  }
}
</style>
<style lang="scss">
.user-data-setting {
  .el-form-item__label {
    padding-right: 20px;
    color: #333;
  }
  .el-textarea__inner {
    font-family: inherit;
  }
}
</style>
