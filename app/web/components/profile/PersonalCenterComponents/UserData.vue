<template>
  <div class="user-data" v-loading="loading">
    <div class="user-data-title">{{$t('common.userData')}}</div>
    <div class="user-data-content">
      <el-form ref="form" :model="userInfo" label-width="80px">
        <el-form-item :label='$t("card.pic")'>
          <div class="user-data-content-profile" @click="showMediaSkyDriveDialog">
            <img :src="portrait || defaultPortrait" alt="" class="profile">
            <span class="change">{{$t('user.modifyAvatar')}}</span>
          </div>
        </el-form-item>
        <el-form-item :label='$t("common.account")'>
          <span>{{userInfo.username}}</span>
        </el-form-item>
        <el-form-item :label='$t("user.phoneBind")'>
          <span>{{userInfo.realname}}</span>
        </el-form-item>
        <el-form-item :label='$t("user.displayName")'>
          <el-input v-model="userInfo.nickname" size="small"></el-input>
        </el-form-item>
        <el-form-item label='姓名'>
          <el-input v-model="userInfo.info.name" size="small"></el-input>
        </el-form-item>
        <el-form-item :label='$t("user.sex")'>
          <el-radio-group v-model="userInfo.sex">
            <el-radio label="M">{{$t('user.male')}}</el-radio>
            <el-radio label="F">{{$t('user.female')}}</el-radio>
            <el-radio label="N">{{$t('user.confidentiality')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="userInfo.info.birthdate" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email" size="small"></el-input>
        </el-form-item>
        <el-form-item label="QQ">
          <el-input v-model="userInfo.info.qq" size="small"></el-input>
        </el-form-item>
        <el-form-item label="学校">
          <el-input v-model="userInfo.info.school" size="small"></el-input>
        </el-form-item>
        <el-form-item :label='$t("user.location")' size="small">
          <el-select v-model="tempLocation" :placeholder="$t('editor.select')">
            <el-option v-for="item in cities" :key="item.name" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label='$t("user.introduce")'>
          <el-input type="textarea" resize="none" :rows=6 v-model="userInfo.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveUserData">{{$t('user.saveTheChanges')}}</el-button>
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
import cityName from './CityName.js'

export default {
  name: 'UserData',
  watch: {
    $route(value) {
      this.getUserInfo()
    }
  },
  async mounted() {
    await this.getUserInfo()
    this.loading = false
  },
  data() {
    return {
      loading: true,
      cities: cityName,
      tempLocation: null,
      userInfo: {info:{}},
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
    getUserInfo() {
      this.userInfo = _.cloneDeep(this.loginUserProfile)
      this.userInfo.info = this.userInfo.info || {}
      this.copiedLoginUserProfile = _.cloneDeep(this.userInfo)
      this.tempLocation = _.get(this.copiedLoginUserProfile, 'extra.location')
    },
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
.user-data {
  background: #fff;
  border: 1px solid #e8e8e8;
  &-title {
    font-size: 16px;
    color: #303133;
    padding: 23px 16px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-content {
    padding-top: 20px;
    max-width: 440px;
    &-profile {
      width: 120px;
      height: 120px;
      position: relative;
      cursor: pointer;
      .profile {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
      .change {
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


