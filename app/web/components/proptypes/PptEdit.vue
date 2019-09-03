<template>
  <div class="ppt-edit">
    <div class="ppt-edit-header">
      <el-button @click="handleAdd" class="ppt-edit-header-add" type="text" icon="el-icon-plus">添加</el-button>
      <span class="ppt-edit-header-type">
        图片/视频
      </span>
    </div>
    <div class="ppt-edit-list">
      <draggable v-model="pptList" @change="handleDrag">
        <div class="ppt-edit-list-item" v-for="(item, index) in pptList" :key="index">
          <div class="ppt-edit-list-item-wrap">
            <img v-if="item.type === 'images'" class="ppt-edit-list-item-wrap-img" :src="item.downloadUrl | miniPic" :alt="item.filename">
            <video-player v-else-if="item.type === 'videos'" :autoplay="false" class="ppt-edit-list-item-wrap-video" :src="item.downloadUrl" />
          </div>
          <div class="ppt-edit-list-item-operation hidden-operation">
            <el-button @click="handleChange(item.page)" size="mini" round>{{$t('common.change')}}</el-button>
            <el-button @click="handleDeletePic(item.page)" size="mini" round icon="iconfont icon-delete"></el-button>
          </div>
        </div>
      </draggable>
    </div>
    <sky-drive-manager-dialog :isApplicable='true' :isVideoShow="true" :isNoMediaFileShow="false" :isMultipleSelectMode="isMultipleSelectMode" :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>

<script>
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import protypesBaseMixin from './protypes.base.mixin'
import draggable from 'vuedraggable'
import videoPlayer from '@/components/common/VideoPlayer'
import _ from 'lodash'
export default {
  name: 'PptEdit',
  mixins: [protypesBaseMixin],
  components: {
    SkyDriveManagerDialog,
    draggable,
    videoPlayer
  },
  props: {
    orginValue: Array
  },
  filters: {
    miniPic(url) {
      return `${url}&imageView2/2/w/400`
    }
  },
  methods: {
    handleDrag(evt) {
      this.updateMarkdown(this.pptList)
    },
    handleAdd() {
      this.isMultipleSelectMode = true
      this.changePageIndex = 0
      this.isMediaSkyDriveDialogShow = true
    },
    handleChange(page) {
      this.isMultipleSelectMode = false
      this.changePageIndex = page
      this.isMediaSkyDriveDialogShow = true
    },
    closeSkyDriveManagerDialog(fileList) {
      if (_.isArray(fileList)) {
        this.addPic(fileList)
      } else if (this.changePageIndex > 0) {
        this.changePic(fileList, this.changePageIndex)
      }
      this.isMediaSkyDriveDialogShow = false
    },
    handleDeletePic(page) {
      let data = _.filter(this.pptList, item => item.page !== page)
      data = _.map(data, (item, index) => {
        const { page, ...rest } = item
        return { page: index + 1, ...rest }
      })
      this.$confirm('确定删除该页PPT吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.pptList = data
          this.updateMarkdown(data)
        })
        .catch(e => console.error(e))
    },
    changePic(file, page) {
      const { type, downloadUrl, filename, id } = file
      const index = _.findIndex(this.pptList, item => item.page === page)
      this.pptList[index] = {
        page,
        type,
        downloadUrl,
        filename,
        id
      }
      this.updateMarkdown(this.pptList)
    },
    addPic(fileList) {
      let data = [...this.pptList, ...fileList]
      data = _.map(data, (item, index) => {
        const { type, downloadUrl, filename = '', id } = item
        return { page: index + 1, type, downloadUrl, filename, id }
      })
      this.updateMarkdown(data)
    },
    initPPTData() {
      this.pptList = _.map(this.dataList, (item, index) => {
        const { type, downloadUrl, filename, id } = item
        return { page: index + 1, type, downloadUrl, filename, id }
      })
    },
    updateMarkdown(data) {
      data = _.map(data, (item, index) => {
        const { page, ...rest } = item
        return { page: index + 1, ...rest }
      })
      this.$emit('onPropertyChange', { data })
    }
  },
  mounted() {
    this.initPPTData()
  },
  watch: {
    dataList(list) {
      this.initPPTData()
    }
  },
  data() {
    return {
      isMediaSkyDriveDialogShow: false,
      isMultipleSelectMode: true,
      changePageIndex: 0,
      pptList: []
    }
  },
  computed: {
    dataList() {
      return _.get(this.cardValue, 'data', [])
    }
  }
}
</script>

<style lang="scss" scoped>
.ppt-edit {
  &-header {
    &-add {
      font-size: 16px;
      /deep/ .el-icon-plus {
        background: rgb(186, 221, 255);
      }
      &:hover {
        /deep/ .el-icon-plus {
          color: #fff;
          background: rgb(83, 168, 255);
        }
      }
    }
    &-type {
      color: #909399;
    }
  }

  &-list {
    &-item {
      position: relative;
      cursor: move;
      margin-bottom: 20px;
      &:hover {
        .hidden-operation {
          display: flex;
        }
      }
      &-wrap {
        width: 100%;
        padding-bottom: 56%;
        position: relative;
        background: #000000;
        &-img,
        &-video {
          width: 100%;
          height: 100%;
          position: absolute;
          object-fit: contain;
          top: 0;
          left: 0;
          box-sizing: border-box;
          /deep/.vjs-control-bar {
            display: none;
          }
        }
      }
      &-operation {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        background: rgba($color: #000000, $alpha: 0.2);
        &.hidden-operation {
          display: none;
        }
      }
    }
  }
}
</style>