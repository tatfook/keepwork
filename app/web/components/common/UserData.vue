<template>
  <el-container class="user-data-setting" v-loading='loading' @click.stop="handleDialogClick">
    <el-row class="user-data-setting-content">
      <el-col class="user-data-setting-portrait-col">
        <img :src="portrait || defaultPortrait" alt="" class="user-data-setting-profile">
        <div>
          <div class="user-data-setting-change-profile" @click="showMediaSkyDriveDialog">
            {{$t('user.modifyAvatar')}}
          </div>
        </div>
      </el-col>
      <el-col class="user-data-setting-form-col">
        <el-form ref="form" :model="userInfo" label-width="80px">
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
          <el-form-item :label='$t("user.location")' size="small">
            <el-input v-model="tempLocation"></el-input>
          </el-form-item>
          <el-form-item :label='$t("user.introduce")'>
            <el-input type="textarea" resize="none" :rows=6 v-model="userInfo.description"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="user-data-setting-operations-col">
        <dialog-operations @save='saveUserData' @close='handleClose'></dialog-operations>
      </el-col>
      <sky-drive-manager-dialog :mediaLibrary='true' :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
    </el-row>
  </el-container>
</template>

<script>
import _ from 'lodash'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import { mapGetters, mapActions } from 'vuex'
import DialogOperations from './DialogOperations'
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
<style lang='scss' scoped>
.user-data-setting {
  height: 100%;
  &-content {
    display: flex;
    width: 100%;
    padding: 0 0 0 20px;
  }
  &-portrait-col {
    width: auto;
    text-align: center;
    padding: 40px 55px 0 0;
  }
  &-form-col {
    width: auto;
    flex: 1;
    padding: 40px 28px 0 0;
    border-right: 15px solid #cdd4dc;
    .el-form {
      position: relative;
    }
    .el-radio {
      color: #333;
    }
    .vue-cropper {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  &-operations-col {
    width: 120px;
    text-align: center;
    align-self: flex-end;
  }
  &-change-profile {
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
    cursor: pointer;
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
