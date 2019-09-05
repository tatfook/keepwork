<template>
  <div class="table-type" v-loading='loading' droppable="true">
    <el-table v-if="tableDataWithUploading.length" ref="skyDriveTable" :data="tableDataWithUploading" height="500" :row-key="getRowKey" tooltip-effect="dark" @selection-change="handleSelectionChange" style="width: 100%" @sort-change="handleSortChange">
      <el-table-column type="selection" sortable width="44">
      </el-table-column>
      <el-table-column prop="filename" :label="$t('skydrive.filename')" class-name="table-type-cell-filename" show-overflow-tooltip sortable>
      </el-table-column>
      <el-table-column prop="ext" sortable :label="$t('skydrive.filetype')" width="80">
      </el-table-column>
      <el-table-column prop="size" sortable :label="$t('skydrive.filesize')" width="85" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.displaySize }}</template>
      </el-table-column>
      <el-table-column prop="updatedAt" sortable :label="$t('skydrive.updateDate')" width="160">
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
              <file-url-getter :isDisabled="!scope.row.checkPassed" :selectFiles="[scope.row]" operateType="copy"></file-url-getter>
            </el-tooltip>
            <el-tooltip v-if="isInsertable" :content="$t('common.insert')">
              <file-url-getter :isDisabled="!scope.row.checkPassed" :selectFiles="[scope.row]" operateType="insert" @close="handleClose"></file-url-getter>
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
      <infinite-loading slot="append" :identifier="identifier" @infinite="load" force-use-infinite-wrapper=".el-table__body-wrapper">
        <div slot="no-more" class="table-type-no-more">没有更多了</div>
      </infinite-loading>
    </el-table>
    <file-list-empty v-if="!tableDataWithUploading.length" :uploadText="uploadText" viewType="table" :uploadType="mediaFilterType"></file-list-empty>
  </div>
</template>
<script>
import _ from 'lodash'
import uuidV1 from 'uuid/v1'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import FileDownloader from './FileDownloader'
import FileDeleter from './FileDeleter'
import FileRenamer from './FileRenamer'
import FileUrlGetter from './FileUrlGetter'
import FileListEmpty from './FileListEmpty'
import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  lazyComponent: true
})
import InfiniteLoading from 'vue-infinite-loading'
export default {
  name: 'tableType',
  props: {
    uploadingFiles: Array,
    fileListFilteredSearched: Array,
    isInsertable: Boolean,
    uploadText: String,
    mediaFilterType: String
  },
  data() {
    return {
      identifier: new Date(),
      isScrollDataLoading: false,
      tableData: [],
      fileListChunk: [],
      nowPage: 0,
      perPage: 15,
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
      return (
        this.multipleSelectionResults.filter(
          ({ checked }) => Number(checked) === 1
        ) || []
      )
    },
    isAllSelected() {
      let selectedCount = this.approvedMultipleSelectionResults.length
      return (
        selectedCount > 0 &&
        selectedCount == this.fileListFilteredSearched.length
      )
    },
    tableDataWithUploading() {
      return _.concat(this.uploadingFiles, this.tableData)
    }
  },
  methods: {
    ...mapActions({
      skydriveRemoveFromUploadQue: 'skydrive/removeFromUploadQue',
      userUseFileInSite: 'user/useFileInSite'
    }),
    handleSortChange({ prop, order }) {
      this.initData(prop, order)
    },
    setSort() {
      this.$nextTick(() => {
        let tableRef = this.$refs.skyDriveTable
        tableRef && tableRef.clearSort && tableRef.clearSort()
        tableRef && tableRef.sort && tableRef.sort('updatedAt', 'descending')
        this.initData('updatedAt', 'descending')
      })
    },
    initData(prop, order) {
      let fileList = _.cloneDeep(this.fileListFilteredSearched)
      if (!prop || !order) {
        prop = prop || 'updatedAt'
        order = order || 'descending'
        this.setSort()
      }
      let orderStr = order == 'descending' ? 'desc' : 'asc'
      fileList = _.orderBy(fileList, [prop], [orderStr])
      this.fileListChunk = _.chunk(fileList, this.perPage)
      this.identifier = new Date()
      this.nowPage = 0
      this.tableData = []
      this.load()
    },
    load($state) {
      this.tableData = _.concat(
        this.tableData,
        this.fileListChunk[this.nowPage]
      ).filter(fileDetail => {
        return Boolean(fileDetail)
      })
      console.log(this.tableData)
      this.nowPage++
      $state && $state.loaded()
      if (this.nowPage >= this.fileListChunk.length) {
        return $state && $state.complete()
      }
    },
    handleClose(filesWithUrl) {
      this.$emit('close', filesWithUrl)
    },
    selectAll() {
      let selected = this.isAllSelected ? false : true
      _.forEach(this.fileListFilteredSearched, row => {
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
      this.skydriveRemoveFromUploadQue(file)
    },
    getRowKey(row) {
      return row.state ? row.filename + row.state : row.filename + uuidV1()
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
    },
    fileListFilteredSearched() {
      this.initData()
    }
  },
  components: {
    InfiniteLoading,
    FileListEmpty,
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
    .el-dropdown-menu__item span {
      width: auto;
      padding: 0;
    }
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
      &:hover {
        color: #3ba4ff;
      }
    }
  }
  &-cell-actions {
    [class*='icon'] {
      margin-right: 0;
    }
  }
  &-no-more {
    color: #999;
    font-size: 12px;
    padding: 16px 0;
  }
}
</style>
