<template>
  <div class="form-bg">
    <label class="label">{{itemLabel}}</label>
    <div v-if="previewUrl" class="container">
      <div class="img-box">
        <img v-if="previewUrl" class="image-content" :src="previewUrl" alt="" @click="showBgEditor">
      </div>
      <i class="el-icon-error" @click="setEditingFormBgs()"></i>
    </div>
    <div class="empty" v-else @click="showBgEditor">
      <i class="iconfont icon-picture"></i>
      上传图片
    </div>
    <sky-drive-manager-dialog :isApplicable='true' :isVideoShow="false" :isNoMediaFileShow="false" :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog' />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
export default {
  name: 'FormBg',
  props: {
    itemKey: {
      type: String,
      required: true,
    },
    itemLabel: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isMediaSkyDriveDialogShow: false,
    }
  },
  computed: {
    ...mapGetters({
      editingForm: 'org/editingForm',
    }),
    previewUrl() {
      return _.get(this.editingForm, `backGroundImg.${this.itemKey}`)
    },
  },
  methods: {
    ...mapActions({ setEditingForm: 'org/setEditingForm' }),
    showBgEditor() {
      this.isMediaSkyDriveDialogShow = true
    },
    closeSkyDriveManagerDialog({ url }) {
      this.isMediaSkyDriveDialogShow = false
      if (!url) return
      this.setEditingFormBgs(url)
    },
    setEditingFormBgs(url) {
      let originFormDetail = _.cloneDeep(this.editingForm)
      let backGroundImg = originFormDetail.backGroundImg || {}
      backGroundImg[this.itemKey] = url
      this.setEditingForm({ ...originFormDetail, backGroundImg })
    },
  },
  components: {
    SkyDriveManagerDialog,
  },
}
</script>
<style lang="scss" scoped>
.form-bg {
  padding-bottom: 16px;
  display: flex;
  align-items: center;
  .label {
    color: #909399;
    flex-shrink: 0;
  }
  .empty {
    flex: 1;
    height: 32px;
    line-height: 32px;
    border: 1px solid #d9d9d9;
    margin-left: 16px;
    font-size: 14px;
    color: #303133;
    text-align: center;
    cursor: pointer;
  }
  .icon-picture {
    color: #2397f3;
    font-size: 18px;
    vertical-align: middle;
  }
  .container {
    height: 32px;
    border: 1px solid #d9d9d9;
    margin-left: 16px;
    display: flex;
    align-items: center;
  }
  .img-box {
    flex: 1;
    height: 100%;
  }
  .image-content {
    max-width: 100%;
    height: 100%;
    width: auto;
    object-fit: cover;
    cursor: pointer;
  }
  .el-icon-error {
    font-size: 16px;
    color: #e34057;
    padding: 0 4px;
    cursor: pointer;
  }
}
</style>
