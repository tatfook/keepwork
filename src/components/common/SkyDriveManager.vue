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
          <a class='el-icon-download' target='_blank' :href='scope.row.file.download_url'></a>
          <span class='el-icon-delete' @click='handleRemove(scope.row)'></span>
          <span class='iconfont icon-copy' @click='handleCopy(scope.row.file.download_url)'></span>
          <span class='iconfont icon-insert' @click='handleInsert(scope.row)'></span>
          <span class='el-icon-edit' @click='handleRename(scope.row)'></span>
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getFilenameWithExt } from '@/lib/utils/gitlab'
import _ from 'lodash'

export default {
  name: 'SkyDriveManager',
  data() {
    return {
      loading: true,
      searchWord: '',
      multipleSelectionResults: []
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
        checked = Number(checked)
        size = this.biteToM(size) + 'MB'
        let checkedState = checked === 1 ? '通过' : checked === 2 ? '未通过' : '审核中'
        return {...item, size, type, ext, checkedState }
      }).filter(this.itemFilterBySearchWord)
    },
    info() {
      let {total = 0, used = 0} = this.userSkyDriveInfo
      let unused = total - used
      let usedPercent = Math.max(0, (100 * used/total).toFixed(2))
      return {total, used, unused, usedPercent}
    }
  },
  methods: {
    ... mapActions({
      userRefreshSkyDrive: 'user/refreshSkyDrive',
      userUploadFileToSkyDrive: 'user/uploadFileToSkyDrive',
      userRemoveFileFromSkyDrive: 'user/removeFileFromSkyDrive',
      userChangeFileNameInSkyDrive: 'user/changeFileNameInSkyDrive',
      editorInsertNewLine: 'insertNewLine'
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
      this.loading = true
      await this.userUploadFileToSkyDrive({file, onProgress(progress) {
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
      let { file, checked } = item
      if (Number(checked) !== 1) return this.$message({
        showClose: true,
        message: '文件尚未通过审核',
        type: 'error'
      })

      let url = file.download_url
      let newline = `${/image\/\w+/.test(file.type) ? '!' : ''}[${file.filename}](${url})`
      await this.editorInsertNewLine({ newline })
      this.$emit('close')
    },
    async handleRename(item) {
      let { _id, ext } = item
      let { value: newname } = await this.$prompt('Please input new filename', 'Tip', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputValidator: str => {
          let newname = getFilenameWithExt(str, ext)
          let errMsg = '文件名和现有名字重复'
          return this.userSkyDriveFileList.filter(({ filename }) => filename === newname).length ? errMsg : true
        }
      })

      newname = (newname || '').trim()
      if (!newname) return

      let newnameExt = /.+\./.test(newname) ? newname.split('.').pop() : ''
      newnameExt = newnameExt.toLowerCase()
      newname = newnameExt !== ext ? `${newname}.${ext}` : newname

      let filename = newname
      this.loading = true
      await this.userChangeFileNameInSkyDrive({_id, filename}).catch(err => console.error(err))
      this.loading = false
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
      await new Promise((resolve, reject) => {
        let a = document.createElement('a')
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
    itemFilterBySearchWord({ filename }) {
      let searchWord = this.searchWord && this.searchWord.trim().toLowerCase()
      if (!searchWord) return true
      let filenameLowerCase = (filename || '').toLowerCase()
      return filenameLowerCase.indexOf(searchWord) >= 0
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
  &-cell-actions [class*="icon"] {
    display: inline-block;
    margin-right: 10px;
    font-size: 20px;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }
  &-cell-actions [class*="iconfont"] {
    font-size: 16px;
  }
}
</style>
