<template>
  <div class="student-basic" v-loading="isLoading">
    <div class="student-basic-main">
      <div class="student-basic-left">
        <div class="student-basic-profile">
          <img :src="portrait || defaultPortrait" alt="" class="user-data-setting-profile" @click="showMediaSkyDriveDialog">
          <p @click="showMediaSkyDriveDialog">点击修改头像</p>
        </div>
      </div>
      <div class="student-basic-detail">
        <div class="student-basic-detail-item">
          <label for="userDisplayName">姓名</label>
          <el-input class="student-basic-detail-input" id="userDisplayName" v-model.trim="userInfo.realname"></el-input>
        </div>
        <parent-phone-binder v-if="!isParentPhoneExist" ref="parentPhoneBinderRef" class="student-basic-detail-binder" />
        <div v-if="isParentPhoneExist" class="student-basic-detail-item">
          <div class="student-basic-detail-item-row">
            <label>家长手机号</label>
            <span>{{userinfoGetter.parentPhoneNum}}</span>
          </div>
          <div class="student-basic-detail-item-info">
            家长手机号用于接收老师发送的评价报告等信息，请确保手机号畅通，如有变化，请及时修改
          </div>
        </div>
      </div>
    </div>
    <div class="student-basic-footer">
      <el-button size="medium">取消</el-button>
      <el-button size="medium" type="primary" @click="saveUserinfo">保存</el-button>
    </div>
    <sky-drive-manager-dialog :isApplicable='true' :isVideoShow="false" :isNoMediaFileShow="false" :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>
<script>
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import ParentPhoneBinder from './ParentPhoneBinder'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'StudentBasic',
  async mounted() {
    this.isLoading = true
    try {
      await this.orgGetStudentInfo()
      this.userInfo = this.userinfoGetter
    } catch (error) {}
    this.isLoading = false
  },
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      isMediaSkyDriveDialogShow: false,
      isLoading: false,
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters({
      userinfoGetter: 'org/student/userinfo'
    }),
    portrait() {
      return _.get(this.userInfo, 'portrait')
    },
    isParentPhoneExist() {
      return Boolean(this.userinfoGetter.parentPhoneNum)
    }
  },
  methods: {
    ...mapActions({
      orgGetStudentInfo: 'org/student/getStudentInfo',
      orgUpdateStudentInfo: 'org/student/updateStudentInfo'
    }),
    showMediaSkyDriveDialog() {
      this.isMediaSkyDriveDialogShow = true
    },
    async closeSkyDriveManagerDialog({ file, url }) {
      this.isMediaSkyDriveDialogShow = false
      if (url) {
        this.userInfo.portrait = url
      }
    },
    async saveUserinfo() {
      this.isLoading = true
      try {
        let { portrait, realname } = this.userInfo
        let phone, verifCode
        if (!this.isParentPhoneExist) {
          let parentPhoneBinderRef = this.$refs.parentPhoneBinderRef
          let isPhoneDataValid = parentPhoneBinderRef.isPhoneDataValid
          phone = parentPhoneBinderRef.parentPhone.phone
          verifCode = parentPhoneBinderRef.parentPhone.verifCode
        }
        await this.orgUpdateStudentInfo(
          _.omitBy(
            {
              portrait,
              realname,
              parentPhoneNum: phone ? phone : null,
              verifCode: verifCode ? verifCode : null
            },
            _.isNull
          )
        )
        this.$message({ type: 'success', message: '修改成功' })
      } catch (error) {
        console.log(error)
        this.$message({ type: 'danger', message: '修改失败' })
      }
      this.isLoading = false
    }
  },
  components: {
    SkyDriveManagerDialog,
    ParentPhoneBinder
  }
}
</script>
<style lang="scss" scoped>
.student-basic {
  min-height: 510px;
  &-main {
    display: flex;
    padding: 48px 0 40px;
  }
  &-left {
    width: 168px;
    text-align: center;
    margin-right: 32px;
    box-sizing: border-box;
    img {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      object-fit: cover;
      cursor: pointer;
    }
    p {
      cursor: pointer;
    }
  }
  &-detail {
    flex: 1;
    &-binder {
      border: 1px solid #e8e8e8;
      max-width: 520px;
      margin-top: 28px;
      padding: 28px 20px 32px;
    }
    &-input {
      display: inline-block;
      width: 300px;
      margin-left: 16px;
    }
    &-item {
      margin-bottom: 36px;
      &-row {
        & > span {
          margin-left: 18px;
        }
      }
      &-info {
        font-size: 12px;
        color: #999;
        margin-top: 12px;
      }
    }
  }
  &-footer {
    margin-left: 200px;
    .el-button {
      width: 100px;
    }
  }
}
</style>
