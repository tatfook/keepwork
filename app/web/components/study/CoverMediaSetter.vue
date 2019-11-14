<template>
  <div class="cover-media-setter">
    <label class='cover-media-setter-title'>
      <span class='cover-media-setter-title-sub'>{{subTitle}}</span>
      {{componentTitle}}
    </label>
    <p v-show="false">{{newPackageCoverUrl}}</p>
    <el-radio-group :disabled="!isEditable" class="cover-media-setter-radio-group" v-model="imageSourceType">
      <el-radio label="bigfile">{{$t('lesson.packageManage.selectFile')}}</el-radio>
      <el-radio label="url">{{$t('lesson.packageManage.inputUrl')}}</el-radio>
    </el-radio-group>
    <div class="cover-media-setter-from-bigfile" v-show="imageSourceType === 'bigfile'">
      <div v-if="bigfileTypeUrl" class="cover-media-setter-bigfile">
        <img @click="showSkyDriveManagerDialog" v-if='isImageTabShow' class="cover-media-setter-bigfile-preview" :src="bigfileTypeUrl" alt="">
        <video @click="showSkyDriveManagerDialog" v-else class="cover-media-setter-bigfile-video" :src='bigfileTypeUrl'></video>
        <div class="cover-media-setter-bigfile-edit">
          <el-button @click="showSkyDriveManagerDialog" size="mini" round>{{$t('common.change')}}</el-button>
          <el-button @click="deleteMedia" size="mini" round icon="iconfont icon-delete"></el-button>
        </div>
      </div>
      <div v-else class="cover-media-setter-add-button" @click="showSkyDriveManagerDialog">
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <div class="cover-media-setter-from-url" :class="{'cover-media-setter-from-url-success': isSubmitPressed && !isCoverUrlEmpty, 'cover-media-setter-from-url-error': isSubmitPressed && isCoverUrlEmpty}" v-show="imageSourceType === 'url'">
      <el-input :disabled="!isEditable" placeholder="https://" v-model="urlTypeUrl">
        <template slot="append">
          <el-popover placement="top" width="264" trigger="click" popper-class='cover-media-setter-image-preview'>
            <div class="cover-media-setter-image-preview-wrap">
              <img class="cover-media-setter-image-preview-inner" :src="urlTypeUrl" :alt="$t('lesson.packageManage.preview')">
            </div>
            <el-button :disabled='isPreviewDisabled' slot="reference">{{$t('lesson.packageManage.preview')}}</el-button>
          </el-popover>
        </template>
      </el-input>
    </div>
    <sky-drive-manager-dialog :isImageShow='isImageTabShow' :isNoMediaFileShow="false" :isVideoShow='isVideoTabShow' :show='isSkyDriveShow' :isApplicable="true" @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>
<script>
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'

const BigfileUrlReg = new RegExp('api.(keepwork.com)|(dev.kp)|(rls.kp)')
export default {
  name: 'CoverMediaSetter',
  props: {
    title: String,
    subTitle: String,
    editingPackageDetail: Object,
    editingCoverUrl: String,
    isImageTabShow: {
      type: Boolean,
      default: true
    },
    isVideoTabShow: Boolean,
    isEditable: {
      type: Boolean,
      default: true
    },
    isSubmitPressed: {
      type: Boolean,
      default: false
    },
    isEditing: Boolean
  },
  async mounted() {
    if (this.isEditing) {
      let editingPackageDetail = this.editingPackageDetail
      let coverUrl =
        this.editingCoverUrl || _.get(editingPackageDetail, 'coverUrl')
      if (coverUrl && BigfileUrlReg.test(coverUrl)) {
        this.imageSourceType = 'bigfile'
        this.bigfileTypeUrl = coverUrl
      } else {
        this.imageSourceType = 'url'
        this.urlTypeUrl = coverUrl
      }
    }
  },
  data() {
    return {
      editingPackageId: _.get(this.$route.params, 'id'),
      imageSourceType: 'bigfile', // bigfile or url
      bigfileTypeUrl: '',
      urlTypeUrl: '',
      isSkyDriveShow: false
    }
  },
  computed: {
    isPreviewDisabled() {
      if (/^(http:|https:)/.test(this.urlTypeUrl)) {
        return false
      }
      return true
    },
    componentTitle() {
      return this.title || this.$t('lesson.packageManage.cover')
    },
    newPackageCoverUrl() {
      let newCoverUrl =
        this.imageSourceType === 'url' ? this.urlTypeUrl : this.bigfileTypeUrl
      this.$emit('urlChange', newCoverUrl)
      return newCoverUrl
    },
    isCoverUrlEmpty() {
      let coverUrl = this.newPackageCoverUrl
      return !coverUrl || coverUrl == ''
    }
  },
  methods: {
    showSkyDriveManagerDialog() {
      this.isSkyDriveShow = true
    },
    closeSkyDriveManagerDialog({ file, url }) {
      this.isSkyDriveShow = false
      url && (this.bigfileTypeUrl = url)
    },
    deleteMedia() {
      this.bigfileTypeUrl = ''
    }
  },
  components: {
    SkyDriveManagerDialog
  }
}
</script>
<style lang="scss">
.cover-media-setter {
  background-color: #fff;
  &-title {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    &-sub {
      font-weight: normal;
      color: #409efe;
    }
  }
  &-radio-group {
    display: block;
    margin-top: 30px;
    .el-radio + .el-radio {
      margin-left: 40px;
    }
  }
  &-add-button,
  &-bigfile {
    width: 211px;
    height: 132px;
    margin-top: 10px;
    cursor: pointer;
  }
  &-add-button {
    line-height: 132px;
    font-size: 46px;
    text-align: center;
    background-color: #f6f6f6;
    border: 1px dashed #b9bcc2;
    color: #b9bcc2;
  }
  &-bigfile {
    position: relative;
    &-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &-video {
      width: 100%;
      height: 100%;
    }
    &-edit {
      display: none;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.5);
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      color: #fff;
      font-size: 32px;
      text-align: center;
      line-height: 132px;
    }
    &:hover .cover-media-setter-bigfile-edit {
      display: inline-block;
    }
  }
  &-from-url {
    &-success {
      .el-input__inner {
        border-color: #67c23a;
      }
    }
    &-error {
      .el-input__inner {
        border-color: #f56c6c;
      }
    }
    .el-input-group {
      width: 565px;
      max-width: 100%;
      display: flex;
      align-items: center;
      margin-top: 18px;
      .el-input__inner {
        border-radius: 4px;
      }
      .el-input-group__append {
        color: #333;
        background-color: transparent;
        border: none;
      }
    }
    .el-button.is-disabled {
      border-color: transparent;
      color: #c0c4cc;
    }
  }
  &-image-preview {
    padding: 0;
    border-radius: 0;
    &-wrap {
      padding-bottom: 56.25%;
      position: relative;
    }
    &-inner {
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .cover-media-setter {
    .el-popover__reference {
      padding: 0 0 0 8px;
    }
  }
}
</style>
