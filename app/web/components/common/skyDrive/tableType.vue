<template>
  <div class="table-type" v-loading='loading' droppable="true">
    <el-row class="table-type-header">
      <el-col :span="18">
        <div>
          {{ $t('skydrive.usage') }}
          <span class="table-type-total">
            <span class="table-type-total-used" :class="usedProcessBarClass" :style="{ width: info.usedPercent + '%' }"></span>
          </span>
          {{ info.used | biteToG }}GB / {{ info.total | biteToG }}GB
        </div>
      </el-col>
      <el-col :span="6">
        <el-input :placeholder="$t('common.search')" size="mini" v-model="searchWord">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-table ref="skyDriveTable" :data="skyDriveTableDataWithUploading" height="500" tooltip-effect="dark" :default-sort="{prop: 'updatedAt', order: 'descending'}" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" sortable width="40">
      </el-table-column>
      <el-table-column prop="filename" :label="$t('skydrive.filename')" class-name="table-type-cell-filename" sortable width="300">
      </el-table-column>
      <el-table-column prop="ext" sortable :label="$t('skydrive.filetype')" width="80">
      </el-table-column>
      <el-table-column prop="size" sortable :label="$t('skydrive.filesize')" width="85" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.displaySize }}</template>
      </el-table-column>
      <el-table-column prop="updatedAt" sortable :label="$t('skydrive.updateDate')" width="155">
        <template slot-scope="scope">
          <span v-if="scope.row.percent >= 0 && scope.row.state !== 'success'">
            <el-progress :stroke-width="10" :color="scope.row.state === 'doing' ? '#13ce67' : '#f56c6c'" :show-text=false :percentage="scope.row.percent"></el-progress>
          </span>
          <span v-else>{{scope.row.updatedAt | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable :label="$t('skydrive.checkedState')" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.state === 'error'" class="table-type-cell-danger-text" :title="scope.row.errorMsg">{{$t('skydrive.uploadFailed')}}</span>
          <span v-else>{{scope.row.checkedState}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="table-type-cell-actions" :label="$t('common.action')" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.percent >= 0 && scope.row.state !== 'success'">
            <span class='iconfont icon-close_' :title="$t('common.remove')" @click="removeFromUploadQue(scope.row)"></span>
          </span>
          <span v-else>
            <el-tooltip :content="$t('common.copyURI')">
              <span class='iconfont icon-copy' :class='{disabled: !scope.row.checkPassed}' @click='handleCopy(scope.row)'></span>
            </el-tooltip>
            <el-tooltip :content="$t('common.insert')">
              <span class='iconfont icon-insert' v-if="insertable" :class='{disabled: !scope.row.checkPassed}' @click='handleInsert(scope.row)'></span>
            </el-tooltip>
            <el-tooltip :content="$t('common.download')">
              <span class='el-icon-download' @click='download(scope.row)'></span>
            </el-tooltip>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more el-icon--right"></i>
              </span>
              <el-dropdown-menu class='table-type-cell-actions-menu' slot="dropdown">
                <el-dropdown-item @click.native='handleRename(scope.row)'>
                  <span class='el-icon-edit'></span>{{ $t('common.rename') }}
                </el-dropdown-item>
                <el-dropdown-item @click.native='handleRemove(scope.row)'>
                  <span class='el-icon-delete'></span>{{ $t('common.remove') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="table-type-footer">
      <el-col :span="6">
        <el-button size="small" :disabled="!approvedMultipleSelectionResults.length" round @click="downloadAllSelected">{{ $t('skydrive.downloadSelected') }}</el-button>
        <el-button size="small" :disabled="!multipleSelectionResults.length" round @click="removeAllSelected">{{ $t('skydrive.removeSelected') }}</el-button>
      </el-col>
      <el-col :span="10" :offset="8" class="table-type-upload">
        {{ $t('skydrive.dragAndDrop') }}
        <label class="el-button table-type-upload-btn el-button--primary el-button--small is-round">
          <span>{{ $t('skydrive.uploadFile') }}</span>
          <input ref="fileInput" type="file" style="display:none;" multiple @change="handleUploadFile">
        </label>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'
import { getFilenameWithExt } from '@/lib/utils/gitlab'
import { getBareFilename } from '@/lib/utils/filename'
const ErrFilenamePatt = new RegExp('^[^\\\\/*?|<>:"]+$')
export default {
  name: 'tableType',
  props: {
    info: {
      type: Object,
      required: true
    },
    userSkyDriveFileList: {
      type: Array,
      required: true
    },
    skyDriveTableDataWithUploading: {
      type: Array,
      required: true
    },
    insertable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      searchWord: '',
      multipleSelectionResults: []
    }
  },
  computed: {
    ...mapGetters({
      userSiteFileBySitePathAndFileId: 'user/siteFileBySitePathAndFileId',
      activePageInfo: 'activePageInfo'
    }),
    approvedMultipleSelectionResults() {
      return this.multipleSelectionResults.filter(
        ({ checked }) => Number(checked) === 1
      )
    },
    usedProcessBarClass() {
      let { usedPercent } = this.info
      return usedPercent >= 90
        ? 'table-type-total-used-danger'
        : usedPercent >= 70
          ? 'table-type-total-used-warning'
          : ''
    }
  },
  methods: {
    ...mapActions({
      userChangeFileNameInSkyDrive: 'user/changeFileNameInSkyDrive',
      userUseFileInSite: 'user/useFileInSite'
    }),
    handleSelectionChange(selectionResults) {
      this.multipleSelectionResults = selectionResults
    },
    async downloadAllSelected() {
      this.approvedMultipleSelectionResults.map(file => this.download(file))
    },
    async download(file) {
      let downloadUrl = file.downloadUrl
      if (!downloadUrl) return
      let { filename } = file
      await new Promise((resolve, reject) => {
        let a = document.createElement('a')
        a.target = '_blank'
        a.style.display = 'none'
        a.href = `${downloadUrl}&attname=${filename}`
        a.download = filename || ''
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          a.remove()
          resolve()
        }, 300)
      }).catch(e => console.error(e))
    },
    async removeAllSelected() {
      this.$emit('remove', this.multipleSelectionResults)
    },
    async handleCopy(file) {
      if (!file && !file.checkPassed) {
        return false
      }
      this.$emit('copy', file)
    },
    async showRenamePrompt({ bareFilename, filename, ext }) {
      return await this.$prompt(
        this.$t('skydrive.newFilenamePromptMsg'),
        this.$t('common.rename'),
        {
          inputValue: bareFilename,
          confirmButtonText: this.$t('common.OK'),
          cancelButtonText: this.$t('common.Cancel'),
          inputValidator: str => {
            if (str === bareFilename || str === filename) return true
            if (!str) return this.$t('skydrive.nameEmptyError')
            let isFilenameValid = this.testFilenameIsValid(str)
            if (typeof isFilenameValid === 'string') return isFilenameValid
            return this.filenameValidator(getFilenameWithExt(str, ext))
          }
        }
      )
    },
    async handleRename(item) {
      let { _id, ext, filename, key } = item
      let bareFilename = getBareFilename(filename)
      let { value: newname } = await this.showRenamePrompt({
        bareFilename,
        filename,
        ext
      })
      newname = (newname || '').trim()
      if (!newname) return
      let newnameExt = /.+\./.test(newname) ? newname.split('.').pop() : ''
      newnameExt = newnameExt.toLowerCase()
      newname = newnameExt !== ext ? `${newname}.${ext}` : newname
      let newFilename = newname
      if (newFilename === filename) return
      this.loading = true
      await this.userChangeFileNameInSkyDrive({
        key,
        filename: newFilename
      }).catch(err => console.error(err))
      this.loading = false
    },
    testFilenameIsValid(newFilename) {
      let errMsg = this.$t('skydrive.nameContainSpecialCharacterError')
      return !ErrFilenamePatt.test(newFilename) ? errMsg : true
    },
    filenameValidator(newFilename) {
      let errMsg = this.$t('skydrive.nameConflictError')
      return this.userSkyDriveFileList.filter(
        ({ filename }) => filename === newFilename
      ).length
        ? errMsg
        : true
    },
    async handleInsert(file) {
      if (!file.checkPassed) {
        return
      }
      this.$emit('insert', { file })
    },
    handleRemove(file) {
      this.$emit('remove', file)
    },
    handleUploadFile(e) {
      this.$emit('uploadFile', e)
      this.$refs.fileInput && (this.$refs.fileInput.value = '')
    },
    removeFromUploadQue(file) {
      this.$emit('removeFromUploadQue', file)
    }
  },
  filters: {
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    biteToG: (bite = 0) =>
      (bite / (1024 * 1024 * 1024))
        .toFixed(2)
        .toString()
        .replace(/\.*0*$/, '')
  }
}
</script>
<style lang="scss">
.table-type {
  &-header {
    margin-bottom: 20px;
  }
  &-total {
    display: inline-block;
    margin: 0 15px 0 5px;
    width: 190px;
    height: 10px;
    border-radius: 5px;
    background: #f5f5f5;
    &-used {
      display: block;
      height: 100%;
      border-radius: 5px;
      background: #3ba4ff;
      &-danger {
        background-color: #ff1e02;
      }
      &-warning {
        background-color: #f97b00;
      }
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
  &-cell-danger-text {
    color: #f56c6c;
  }
  &-cell-actions {
    text-align: right;
    .cell {
      white-space: nowrap;
    }
  }
  &-cell-actions,
  &-cell-actions-menu {
    [class*='icon'] {
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
    [class*='iconfont']::before {
      font-size: 16px;
    }
    .el-icon-more {
      color: #858585;
      transform: rotate(90deg);
    }
  }
}
</style>
