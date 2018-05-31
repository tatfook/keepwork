<template>
  <div v-loading='loading' class="skydrive-manager" droppable="true" @drop.prevent='handleDrop' @dragover.prevent>
    <el-row class="skydrive-manager-header">
      <el-col :span="18">
        <div>
          当前使用: 
          <span class="skydrive-manager-total">
            <span class="skydrive-manager-total-used" :style="{ width: info.usedPercent + '%' }"></span>
          </span>
          {{ info.used | biteToG }}GB / {{ info.total | biteToG }}GB
        </div>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="搜索" size="mini" v-model="searchWord">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-row>

    <div v-if='defaultMode'>
      <el-table
        ref="skyDriveTable"
        :data="skyDriveTableData"
        height="500"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          sortable
          width="40">
        </el-table-column>
        <el-table-column
          prop="filename"
          label="文件名"
          class-name="skydrive-manager-cell-filename"
          sortable
          width="280">
        </el-table-column>
        <el-table-column
          prop="ext"
          sortable
          label="类型"
          width="80">
        </el-table-column>
        <el-table-column
          prop="size"
          sortable
          label="大小"
          width="80"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="updateDate"
          sortable
          label="更新时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="checkedState"
          sortable
          label="审核状态"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          class-name="skydrive-manager-cell-actions"
          label="操作">
          <template slot-scope="scope">
            <span class='iconfont icon-copy' :class='{disabled: !scope.row.file.download_url}' title='复制' @click='handleCopy(scope.row.file.download_url)'></span>
            <span class='iconfont icon-insert' :class='{disabled: !scope.row.file.download_url}' title='插入' @click='handleInsert(scope.row)'></span>
            <span class='el-icon-download' :class='{disabled: !scope.row.file.download_url}' title='下载' @click='download(scope.row.file)'></span>

            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more el-icon--right"></i>
              </span>
              <el-dropdown-menu class='skydrive-manager-cell-actions-menu' slot="dropdown">
                <el-dropdown-item>
                  <label class='el-icon-refresh'>
                    <input type="file" :accept="'.' + scope.row.ext" style="display:none;" @change='e => handleUpdateFile(e, scope.row)'>
                    <span>更新</span>
                  </label>
                </el-dropdown-item>
                <el-dropdown-item @click.native='handleRename(scope.row)'>
                  <span class='el-icon-edit'></span>
                  重命名
                </el-dropdown-item>
                <el-dropdown-item @click.native='handleRemove(scope.row)'>
                  <span class='el-icon-delete'></span>
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </template>
        </el-table-column>
      </el-table>
      <el-row class="skydrive-manager-footer">
        <el-col :span="6">
          <el-button size="small" round @click="downloadAllSelected">下载选中</el-button>
          <el-button size="small" round @click="removeAllSelected">删除选中</el-button>
        </el-col>
        <el-col :span="10" :offset="8" class="skydrive-manager-upload">
          拖拽到本窗口上传
          <label class="el-button skydrive-manager-upload-btn el-button--primary el-button--small is-round">
            <span>上传文件</span>
            <input type="file" style="display:none;" @change="handleUploadFile">
          </label>
        </el-col>
      </el-row>
    </div>

    <div v-if='mediaLibraryMode'>
      <div class="skydrive-manager-media-library">
        <div v-for='mediaItem in skyDriveMediaLibraryData'
          :key='mediaItem.file.key'
          class='skydrive-manager-media-item'
          :class='{selected: selectedMediaItem === mediaItem}'
          @click='handleSelectMediaItem(mediaItem)'
          :style='{
            backgroundImage: "url(" + mediaItem.file.download_url + ")"
          }'>
          <div class='skydrive-manager-media-item-cover'>
            <span v-if='!mediaItem.checkPassed' :title='mediaItem.checkedState'>{{ mediaItem.filename }}</span>
          </div>
          <span title='删除' class='el-icon-delete' @click="handleRemove(mediaItem)"></span>
        </div>
      </div>
      <el-row class="skydrive-manager-footer">
        <el-col :span="6">
          <el-button size="small" 
            :disabled='!availableSelectedMediaItem' round 
            @click="handleInsert(availableSelectedMediaItem)"
          >应用</el-button>
        </el-col>
        <el-col :span="10" :offset="8" class="skydrive-manager-upload">
          拖拽到本窗口上传
          <label class="el-button skydrive-manager-upload-btn el-button--primary el-button--small is-round">
            <span>上传文件</span>
            <input type="file" accept=".jpg,.jpeg,.png,.gif,.bmp" style="display:none;" @change="handleUploadFile">
          </label>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getFilenameWithExt } from '@/lib/utils/gitlab'
import _ from 'lodash'
import mediaProperties from '../adi/common/media/media.properties';

export default {
  name: 'SkyDriveManager',
  props: {
    mediaLibrary: Boolean
  },
  data() {
    return {
      defaultMode: !this.mediaLibrary,
      mediaLibraryMode: this.mediaLibrary,
      loading: true,
      searchWord: '',
      multipleSelectionResults: [],
      selectedMediaItem: null
    }
  },
  async mounted() {
    await this.userRefreshSkyDrive()
    this.loading = false
  },
  computed: {
    ... mapGetters({
      'userSkyDriveFileList': 'user/skyDriveFileList',
      'userSkyDriveInfo': 'user/skyDriveInfo'
    }),
    skyDriveTableData() {
      return this.userSkyDriveFileList.map(item => {
        // checked: 0 未审核, 1 通过, 2 未通过
        let { file, checked } = item
        let { size, filename, type } = file
        let ext = /.+\./.test(filename) ? filename.split('.').pop() : type
        ext = (ext || '').toLowerCase()
        size = this.biteToM(size) + 'MB'

        checked = Number(checked)
        let checkPassed = checked === 1
        let checkedState = checkPassed ? '通过' : checked === 2 ? '未通过' : '审核中'
        return {...item, size, type, ext, checkedState, checkPassed }
      }).filter(this.itemFilterBySearchWord)
    },
    skyDriveMediaLibraryData() {
      return this.skyDriveTableData.filter(({ type }) => /^image\/.*/.test(type))
    },
    info() {
      let {total = 0, used = 0} = this.userSkyDriveInfo
      let unused = total - used
      let usedPercent = Math.max(0, (100 * used/total).toFixed(2))
      return {total, used, unused, usedPercent}
    },
    availableSelectedMediaItem() {
      let item = this.itemFilterBySearchWord(this.selectedMediaItem) ? this.selectedMediaItem : null
      return item && item.checkPassed ? item : null
    }
  },
  methods: {
    ... mapActions({
      userRefreshSkyDrive: 'user/refreshSkyDrive',
      userUploadFileToSkyDrive: 'user/uploadFileToSkyDrive',
      userUpdateFileInSkyDrive: 'user/updateFileInSkyDrive',
      userRemoveFileFromSkyDrive: 'user/removeFileFromSkyDrive',
      userChangeFileNameInSkyDrive: 'user/changeFileNameInSkyDrive'
    }),
    handleUploadFile(e) {
      let file = _.get(e, ['target', 'files', 0])
      this.uploadFile(file)
    },
    async handleDrop(e) {
      let file = _.get(e, ['dataTransfer', 'files', 0])
      this.uploadFile(file)
    },
    async uploadFile(file) {
      if (!file) return
      if (this.mediaLibraryMode && !/^image\/.*/.test(file.type)) return this.$message({
        showClose: true,
        message: this.$t('文件不是图片类型'),
        type: 'error'
      })

      let filenameValidateResult = this.filenameValidator(file.name)
      if (filenameValidateResult !== true) throw new Error(filenameValidateResult)

      this.loading = true
      await this.userUploadFileToSkyDrive({file, onProgress(progress) {
        console.log(progress)
      }}).catch(err => console.error(err))
      await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
      this.loading = false
    },
    async handleUpdateFile(e, bigfileToUpdate) {
      let file = _.get(e, ['target', 'files', 0])
      console.log('handleUpdateFile: ', file, bigfileToUpdate)
      if (file.type !== bigfileToUpdate.file.type) throw new Error('file type don\'t match')

      this.loading = true
      await this.userUpdateFileInSkyDrive({file, bigfileToUpdate, onProgress(progress) {
        console.log(progress)
      }}).catch(err => console.error(err))
      await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
      this.loading = false
    },
    async handleRemove(file) {
      await this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })

      this.loading = true
      await this.userRemoveFileFromSkyDrive({file}).catch(err => console.error(err))
      await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
      this.loading = false
    },
    handleCopy(toCopyLink) {
      this.$copyText(toCopyLink).then(res => {
        this.$message({
          showClose: true,
          message: this.$t('editor.copySuccess'),
          type: 'success'
        })
      }).catch(e => {
        console.error(e)
        this.$message({
          showClose: true,
          message: this.$t('editor.copyFail'),
          type: 'error'
        })
      })
    },
    async handleInsert(item) {
      if (!item) return
      let { file, checked } = item
      if (Number(checked) !== 1) return this.$message({
        showClose: true,
        message: '文件尚未通过审核',
        type: 'error'
      })
      let url = file.download_url
      this.$emit('close', { file, url })
    },
    async handleRename(item) {
      let { _id, ext } = item
      let { value: newname } = await this.$prompt('Please input new filename', 'Tip', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputValidator: str => this.filenameValidator(getFilenameWithExt(str, ext))
      })

      newname = (newname || '').trim()
      if (!newname) return

      let newnameExt = /.+\./.test(newname) ? newname.split('.').pop() : ''
      newnameExt = newnameExt.toLowerCase()
      newname = newnameExt !== ext ? `${newname}.${ext}` : newname

      let filename = newname
      this.loading = true
      await this.userChangeFileNameInSkyDrive({_id, filename}).catch(err => console.error(err))
      await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
      this.loading = false
    },
    filenameValidator(newFilename) {
      let errMsg = '文件名和现有名字重复'
      return this.userSkyDriveFileList.filter(({ filename }) => filename === newFilename).length ? errMsg : true
    },
    handleSelectionChange(selectionResults) {
      this.multipleSelectionResults = selectionResults
    },
    async downloadAllSelected() {
      this.multipleSelectionResults.map(async ({ checked, file }) => {
        if (Number(checked) !== 1) return
        await this.download(file)
      })
    },
    async download({ filename, download_url }) {
      if (!download_url) return
      await new Promise((resolve, reject) => {
        let a = document.createElement('a')
        a.target = '_blank'
        a.style.display = 'none'
        a.href = `${download_url};attname=${filename}`
        a.download = filename || ""
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          a.remove()
          resolve()
        }, 300)
      }).catch(e => console.error(e))
    },
    async removeAllSelected() {
      await this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })

      this.loading = true
      await Promise.all(this.multipleSelectionResults.map(
        file => this.userRemoveFileFromSkyDrive({file}).catch(err => console.error(err))
      ))
      await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
      this.loading = false
    },
    biteToM: (bite = 0) => (bite/(1024*1024)).toFixed(2).toString().replace(/\.*0*$/, ''),
    itemFilterBySearchWord(item) {
      if (!item) return false
      let { filename } = item
      let searchWord = this.searchWord && this.searchWord.trim().toLowerCase()
      if (!searchWord) return true
      let filenameLowerCase = (filename || '').toLowerCase()
      return filenameLowerCase.indexOf(searchWord) >= 0
    },
    handleSelectMediaItem(mediaItem) {
      this.selectedMediaItem = mediaItem
    }
  },
  filters: {
    biteToG: (bite = 0) => (bite/(1024*1024*1024)).toFixed(2).toString().replace(/\.*0*$/, '')
  }
}
</script>

<style lang="scss">
.skydrive-manager {
  &-header {
    margin-bottom: 20px;
  }
  &-total {
    display: inline-block;
    margin: 0 15px 0 5px;
    width: 190px;
    height: 10px;
    border-radius: 5px;
    background: #F5F5F5;
    &-used {
      display: block;
      height: 100%;
      border-radius: 5px;
      background: #3BA4FF;
    }
  }
  &-footer {
    margin-top: 20px;
  }
  &-upload {
    text-align: right;
    &-btn {
      margin-left: 15px;
    }
  }
  &-cell-filename {
    .cell {
      white-space: nowrap;
    }
  }
  &-cell-actions, &-cell-actions-menu {
    [class*="icon"] {
      display: inline-block;
      margin-right: 10px;
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      &.disabled {
        color: #bbb;
        cursor: not-allowed;
      }
      &::before {
        font-size: 16px;
      }
      &.el-icon-refresh::before {
        margin-right: 10px;
      }
      &.el-icon-download:before {
        font-size: 18px;
      }
    }
    [class*="iconfont"]::before {
      font-size: 16px;
    }
    .el-dropdown {
      float: right;
    }
    .el-icon-more {
      color: #858585;
      transform: rotate(90deg);
    }
  }
  &-media-library {
    height: 500px;
    overflow-x: hidden;
    overflow-x: auto;
    display: flex;
    flex-wrap: wrap;
  }
  &-media-item {
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    margin: 5px;
    background-size: cover;
    justify-content: space-between;
    background-color: #D1D1D1;
    position: relative;
    cursor: pointer;
    &.selected {
      border: 2px solid #3BA4FF;
      border-radius: 2px;
    }
    &-cover {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      color: white;
      align-items: center;
      span {
        width: 80px;
        font-size: .7em;
        line-height: 1.2em;
        word-break: break-all;
      }
    }
    .el-icon-delete {
      color: white;
      display: none;
      position: absolute;
      right: 10px;
      bottom: 10px;
      &:hover {
        color:black;
      }
    }
    &:hover, &.selected {
      .skydrive-manager-media-item-cover {
        background: transparent(0, 0, 0, .2);
      }
      .el-icon-delete {
        display: block;
      }
    }
  }
}
</style>
