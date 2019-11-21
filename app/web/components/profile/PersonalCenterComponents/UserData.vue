<template>
  <div class="user-data" v-loading="loading">
    <div class="user-data-title">{{$t('common.userData')}}</div>
    <div class="user-data-content">
      <el-form ref="form" :model="userInfo" label-width="80px" :rules="userInfoRules">
        <el-form-item :label='$t("card.pic")'>
          <div class="user-data-content-profile" @click="showMediaSkyDriveDialog">
            <user-portrait class="profile" :user="userInfo" :width="120" size="large"></user-portrait>
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
        <el-form-item :label='$t("lesson.name")'>
          <el-input v-model="userInfo.info.name" size="small" :placeholder="$t('user.inputName')"></el-input>
        </el-form-item>
        <el-form-item :label='$t("user.sex")'>
          <el-radio-group v-model="userInfo.sex">
            <el-radio label="M">{{$t('user.male')}}</el-radio>
            <el-radio label="F">{{$t('user.female')}}</el-radio>
            <el-radio label="N">{{$t('user.confidentiality')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('user.birthday')">
          <el-date-picker size="small" v-model="userInfo.info.birthdate" type="date" :placeholder="$t('user.inputBirth')"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('user.email')" prop="info.email">
          <el-input v-model="userInfo.info.email" size="small" :placeholder="$t('user.inputEmail')"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="userInfo.qq" size="small" :placeholder="$t('user.inputQQ')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.school')">
          <el-input v-model="userInfo.info.school" size="small" :placeholder="$t('user.inputSchool')"></el-input>
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
    <sky-drive-manager-dialog :isApplicable='true' :isVideoShow="false" :isNoMediaFileShow="false" :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import { mapGetters, mapActions } from 'vuex'
import DialogOperations from '@/components/common/DialogOperations'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import cityName from './CityName.js'
import UserPortrait from '@/components/common/UserPortrait'

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
    let checkQQ = (rule, value, callback) => {
      if(value && !/^[0-9]*$/.test(value)) {
        return callback(new Error('必须为数字'))
      }
      callback()
    }
    return {
      loading: true,
      cities: cityName,
      tempLocation: null,
      userInfo: { info: {} },
      copiedLoginUserProfile: {},
      isMediaSkyDriveDialogShow: false,
      userInfoRules: {
        'info.email': [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          },
        ],
        qq: [
          {
            validator: checkQQ,
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      isRealNamed: 'user/isRealNamed',
      loginUserProfile: 'user/profile'
    }),
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
      toggleRealName: 'user/toggleRealName',
      userUpdateUserInfo: 'user/updateUserInfo'
    }),
    getUserInfo() {
      let info = _.cloneDeep(_.get(this.loginUserProfile, 'info', {}))
      this.userInfo = {...this.loginUserProfile, qq: _.get(info, 'qq', '')}
      this.userInfo.info = info || {}
      this.copiedLoginUserProfile = _.cloneDeep(this.userInfo)
      this.tempLocation = _.get(this.copiedLoginUserProfile, 'extra.location')
    },
    async checkSensitive(checkedWords) {
      let result = await checkSensitiveWords({ checkedWords })
      return result && result.length > 0
    },
    showMediaSkyDriveDialog() {
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
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
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
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
            const { qq } = this.updatingUserInfo
            this.updatingUserInfo.info.qq = qq
            await this.userUpdateUserInfo(this.updatingUserInfo)
            this.loading = false
          }
          this.showMessage('success', this.$t('common.saveSuccess'))
        } else {
          this.$message.error(this.$t('common.saveFail'))
        }
      })
    },
    handleClose() {
      this.$emit('close')
    }
  },
  components: {
    UserPortrait,
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


