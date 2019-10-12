<template>
  <div class="student-basic">
    <div class="student-basic-main">
      <div class="student-basic-left">
        <div class="student-basic-profile">
          <img :src="portrait || defaultPortrait" alt="" class="user-data-setting-profile" @click="showMediaSkyDriveDialog">
          <p>点击修改头像</p>
        </div>
      </div>
      <div class="student-basic-detail">
        <div class="student-basic-detail-item">
          <label for="userDisplayName">姓名</label>
          <el-input id="userDisplayName"></el-input>
        </div>
        <parent-phone-binder class="student-basic-detail-binder" />
      </div>
    </div>
    <div class="student-basic-footer">
      <el-button size="medium">取消</el-button>
      <el-button size="medium" type="primary">保存</el-button>
    </div>
    <sky-drive-manager-dialog :isApplicable='true' :isVideoShow="false" :isNoMediaFileShow="false" :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>
<script>
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import ParentPhoneBinder from './ParentPhoneBinder'
export default {
  name: 'StudentBasic',
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      isMediaSkyDriveDialogShow: false,
      userInfo: {}
    }
  },
  computed: {
    portrait() {
      return _.get(this.userInfo, 'portrait')
    }
  },
  methods: {
    showMediaSkyDriveDialog() {
      this.isMediaSkyDriveDialogShow = true
    },
    async closeSkyDriveManagerDialog({ file, url }) {
      this.isMediaSkyDriveDialogShow = false
      if (url) {
        this.userInfo.portrait = url
      }
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
  }
  &-detail {
    flex: 1;
    &-binder {
      border: 1px solid #e8e8e8;
      max-width: 520px;
      margin-top: 28px;
      padding: 28px 20px 32px;
    }
  }
  &-footer {
    margin-left: 200px;
    .el-button {
      width: 100px;
    }
  }
  /deep/.el-input {
    display: inline-block;
    width: 300px;
    margin-left: 16px;
  }
}
</style>
