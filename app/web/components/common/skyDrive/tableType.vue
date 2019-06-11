<template>
  <div class="table-type" v-loading='loading' droppable="true">
    <el-table ref="skyDriveTable" :data="skyDriveTableDataWithUploading" height="500" tooltip-effect="dark" :default-sort="{prop: 'updatedAt', order: 'descending'}" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" sortable width="44">
      </el-table-column>
      <el-table-column prop="filename" :label="$t('skydrive.filename')" class-name="table-type-cell-filename" show-overflow-tooltip sortable>
      </el-table-column>
      <el-table-column prop="ext" sortable :label="$t('skydrive.filetype')" width="80">
      </el-table-column>
      <el-table-column prop="size" sortable :label="$t('skydrive.filesize')" width="85" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.displaySize }}</template>
      </el-table-column>
      <el-table-column prop="updatedAt" sortable :label="$t('skydrive.updateDate')" width="158">
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
              <file-url-getter :isDisabled="!scope.row.checkPassed" :selectFile="scope.row" operateType="copy"></file-url-getter>
            </el-tooltip>
            <el-tooltip v-if="isInsertable" :content="$t('common.insert')">
              <file-url-getter :isDisabled="!scope.row.checkPassed" :selectFile="scope.row" operateType="insert" @close="handleClose"></file-url-getter>
            </el-tooltip>
            <el-tooltip :content="$t('common.download')">
              <file-downloader :selectedFiles="[scope.row]" :isTextShow="false"></file-downloader>
            </el-tooltip>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more el-icon--right"></i>
              </span>
              <el-dropdown-menu class='table-type-cell-actions-menu' slot="dropdown">
                <el-dropdown-item>
                  <file-renamer :selectFile="scope.row"></file-renamer>
                </el-dropdown-item>
                <el-dropdown-item>
                  <file-deleter :selectedFiles="[scope.row]"></file-deleter>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import FileDownloader from './FileDownloader'
import FileDeleter from './FileDeleter'
import FileRenamer from './FileRenamer'
import FileUrlGetter from './FileUrlGetter'
export default {
  name: 'tableType',
  props: {
    isInsertable: Boolean,
    skyDriveTableDataWithUploading: {
      type: Array,
      required: true
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
    isAllSelected() {
      return (
        this.approvedMultipleSelectionResults.length ==
        this.skyDriveTableDataWithUploading.length
      )
    }
  },
  methods: {
    ...mapActions({
      userUseFileInSite: 'user/useFileInSite'
    }),
    handleClose({ file, url }) {
      this.$emit('close', { file, url })
    },
    selectAll() {
      let selected = this.isAllSelected ? false : true
      _.forEach(this.skyDriveTableDataWithUploading, row => {
        this.$refs.skyDriveTable.toggleRowSelection(row, selected)
      })
    },
    handleSelectionChange(selectionResults) {
      this.multipleSelectionResults = selectionResults
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
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    biteToG: (bite = 0) =>
      (bite / (1024 * 1024 * 1024))
        .toFixed(2)
        .toString()
        .replace(/\.*0*$/, '')
  },
  watch: {
    isAllSelected(val) {
      this.$emit('selectAllStateChange', val)
    }
  },
  components: {
    FileDownloader,
    FileDeleter,
    FileRenamer,
    FileUrlGetter
  }
}
</script>
<style lang="scss">
.table-type {
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
  &-cell-actions {
    [class*='icon'] {
      margin-right: 0;
    }
  }
}
</style>
