<template>
  <div class="cover-media-setter">
    <label class='cover-media-setter-title'>{{$t('lesson.packageManage.cover')}}</label>
    <el-radio-group class="cover-media-setter-radio-group" v-model="imageSourceType">
      <el-radio label="bigfile">{{$t('lesson.packageManage.selectFile')}}</el-radio>
      <el-radio label="url">{{$t('lesson.packageManage.inputUrl')}}</el-radio>
    </el-radio-group>
    <div class="cover-media-setter-from-bigfile" v-show="imageSourceType === 'bigfile'">
      <div class="cover-media-setter-add-button" @click="showSkyDriveManagerDialog">
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <div class="cover-media-setter-from-url" v-show="imageSourceType === 'url'">
      <el-input placeholder="https://" v-model="urlTypeUrl">
        <template slot="append">
          <el-popover placement="top" width="250" trigger="hover" popper-class='cover-media-setter-image-preview'>
            <img :src="urlTypeUrl" :alt="$t('lesson.packageManage.preview')">
            <el-button slot="reference">{{$t('lesson.packageManage.preview')}}</el-button>
          </el-popover>
        </template>
      </el-input>
    </div>
    <sky-drive-manager-dialog :show='isSkyDriveShow' :mediaLibrary='true' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'

const BigfileUrlReg = new RegExp('keepwork.com')
export default {
  name: 'CoverMediaSetter',
  props: {
    isEditing: Boolean
  },
  async mounted() {
    if (this.isEditing) {
      await this.getPackageDetail({ packageId: this.editingPackageId })
      let editingPackageDetail = this.lessonPackageDetail({
        packageId: this.editingPackageId
      })
      let coverUrl = _.get(editingPackageDetail, 'extra.coverUrl')
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
      imageSourceType: 'url', // bigfile or url
      bigfileTypeUrl: '',
      urlTypeUrl: '',
      isSkyDriveShow: false
    }
  },
  computed: {
    ...mapGetters({
      lessonPackageDetail: 'lesson/packageDetail'
    }),
    newPackageCoverUrl() {
      return this.imageSourceType === 'url'
        ? this.urlTypeUrl
        : this.bigfileTypeUrl
    }
  },
  methods: {
    ...mapActions({
      getPackageDetail: 'lesson/getPackageDetail'
    }),
    showSkyDriveManagerDialog() {
      this.isSkyDriveShow = true
    },
    closeSkyDriveManagerDialog({ file, url }) {
      this.isSkyDriveShow = false
      console.log(file, url)
    }
  },
  components: {
    SkyDriveManagerDialog
  }
}
</script>
<style lang="scss">
.cover-media-setter {
  height: 260px;
  padding: 35px;
  background-color: #fff;
  &-radio-group {
    display: block;
    margin-top: 30px;
    .el-radio + .el-radio {
      margin-left: 40px;
    }
  }
  &-add-button {
    width: 200px;
    height: 132px;
    line-height: 132px;
    font-size: 46px;
    text-align: center;
    background-color: #f6f6f6;
    border: 1px dashed #b9bcc2;
    color: #b9bcc2;
    margin-top: 10px;
  }
  &-from-url {
    .el-input-group {
      width: 565px;
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
  }
  &-image-preview {
    padding: 0;
    height: 165px;
    border-radius: 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
