<template>
  <div class="media-type">
    <div class="media-type-item-img" :style="{backgroundImage: 'url(' + this.mediaData + ')'}">
      <div class="media-type-item-img-cover">
        <span>
          <el-button class="media-type-change-img-btn" type="info" @click="insertImg()">{{$t('editor.changePic')}}</el-button>
        </span>
      </div>
    </div>
    <SkyDriveManagerDialog :mediaLibrary='true' :show='isSkyDriveManagerDialogShow' @close='closeSkyDriveManagerDialog' />
  </div>
</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'

export default {
  name: 'MediaType',
  props: {
    editingKey: String,
    originValue: String
  },
  mixins: [protypesBaseMixin],
  data() {
    return {
      isSkyDriveManagerDialogShow: false
    }
  },
  computed: {
    mediaData: {
      get() {
        return this.originValue
      },
      set() {}
    }
  },
  methods: {
    updateValue(newVal) {
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = newVal
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    insertImg() {
      this.openSkyDriveManagerDialog()
    },
    openSkyDriveManagerDialog() {
      this.isSkyDriveManagerDialogShow = true
    },
    closeSkyDriveManagerDialog(payload) {
      if (!payload) return
      let { file, url } = payload

      this.isSkyDriveManagerDialogShow = false

      if (!url) return
      this.updateValue(url)
    }
  },
  components: {
    SkyDriveManagerDialog
  }
}
</script>

<style lang="scss">
.media-type {
  &-item-img {
    height: 150px;
    background-color: lightgray;
    background-size: cover;
    background-position: center;
    overflow: hidden;
    position: relative;
    &-cover {
      height: 100%;
      width: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      position: absolute;
      top: 0;
    }
    &:hover {
      .media-type-item-img-cover {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>