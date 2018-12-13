<template>
  <div class="user-data">
    <div class="user-data-title">账户安全</div>
    <div class="user-data-content">
      <el-form ref="form" :model="userInfo" label-width="80px">
          <el-form-item label='头像'>
            <div class="user-data-content-profile" @click="showMediaSkyDriveDialog">
              <img :src="portrait || defaultPortrait" alt="" class="profile">
              <span class="change">点击更换头像</span>
            </div>
          </el-form-item>
          <el-form-item label='账户'>
            <span>hahhaha</span>
          </el-form-item>
          <el-form-item label='手机'>
            <span>12556562352</span>
          </el-form-item>
          <el-form-item :label='$t("user.displayName")'>
            <el-input v-model="userInfo.nickname" size="small"></el-input>
          </el-form-item>
          <el-form-item :label='$t("user.sex")'>
            <el-radio-group v-model="userInfo.sex">
              <el-radio label="M">{{$t('user.male')}}</el-radio>
              <el-radio label="F">{{$t('user.female')}}</el-radio>
              <el-radio label="N">{{$t('user.confidentiality')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label='现居' size="small">
            <el-input v-model="tempLocation"></el-input>
          </el-form-item>
          <el-form-item label='签名'>
            <el-input type="textarea" resize="none" :rows=6 v-model="userInfo.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUserData">保存更改</el-button>
          </el-form-item>
        </el-form>
    </div>
    <sky-drive-manager-dialog :mediaLibrary='true' :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import { mapGetters, mapActions } from 'vuex'
import DialogOperations from '@/components/common/DialogOperations'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
export default {
  name: 'UserData',
  mounted() {
    this.userInfo = _.cloneDeep(this.loginUserProfile)
    this.copiedLoginUserProfile = _.cloneDeep(this.loginUserProfile)
    this.tempLocation = _.get(this.copiedLoginUserProfile, 'extra.location')
  },
  data() {
    return {
      loading: false,
      userInfo: {},
      tempLocation: null,
      copiedLoginUserProfile: {},
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      isMediaSkyDriveDialogShow: false
    }
  },
  computed: {
    ...mapGetters({
      loginUserProfile: 'user/profile'
    }),
    portrait() {
      return _.get(this.userInfo, 'portrait')
    },
    originExtra() {
      return this.copiedLoginUserProfile.extra
    },
    mergedExtra() {
      return _.merge(this.originExtra, {
        location: this.tempLocation
      })
    },
    updatingUserInfo() {
      return _.merge(this.userInfo, {
        extra: this.mergedExtra
      })
    },
    isModified() {
      return !_.isEqual(this.loginUserProfile, this.updatingUserInfo)
    }
  },
  methods: {
    ...mapActions({
      userUpdateUserInfo: 'user/updateUserInfo'
    }),
    async checkSensitive(checkedWords) {
      let result = await checkSensitiveWords({ checkedWords })
      return result && result.length > 0
    },
    showMediaSkyDriveDialog() {
      this.isMediaSkyDriveDialogShow = true
    },
    async closeSkyDriveManagerDialog({ file, url }) {
      this.isMediaSkyDriveDialogShow = false
      if (url) {
        this.userInfo.portrait = url
      }
    },
    showMessage(type, message) {
      this.$message({
        message,
        type,
        showClose: true
      })
    },
    async saveUserData() {
      let userInfo = this.userInfo
      if (this.isModified) {
        this.loading = true
        let { id, nickname, sex, portrait, description } = userInfo
        let location = this.tempLocation
        let isSensitive = await this.checkSensitive([
          nickname,
          location,
          description
        ])
        if (isSensitive) {
          this.loading = false
          return
        }
        await this.userUpdateUserInfo(this.updatingUserInfo)
        this.loading = false
      }
      this.showMessage('success', this.$t('common.saveSuccess'))
    },
    handleClose() {
      this.$emit('close')
    }
  },
  components: {
    SkyDriveManagerDialog,
    DialogOperations
  }
}
</script>
<style lang="scss">
.user-data{
  background: #fff;
  border: 1px solid #e8e8e8;
  &-title{
    font-size: 16px;
    color: #303133;
    padding: 23px 16px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-content{
    padding-top: 20px;
    max-width: 440px;
    &-profile{
      width: 120px;
      height: 120px;
      position: relative;
      cursor: pointer;
      .profile{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
      .change{
        position: absolute;
        top: 40%;
        left: 0;
        color: #fff;
        display: block;
        width: 120px;
        text-align: center;
      }
    }
  }
}
</style>


