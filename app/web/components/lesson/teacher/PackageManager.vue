<template>
  <div class="package-manager">
    <div class="package-manager-overview">
      <div class="package-manager-total">{{$t('lesson.packCount')}}: {{lessonUserPackages.length}}</div>
      <el-button type="primary" class="package-manager-new-button" @click="toNewPackagePage">
        <i class="iconfont icon-add"></i>{{$t('lesson.newPackage')}}
      </el-button>
    </div>
    <div class="package-manager-selector">
      <div class="package-manager-selector-item">
        <label for="subjectSelector">{{$t('lesson.subjectLabel')}}</label>
        <el-select id="subjectSelector" v-model="searchParams.subjectId">
          <el-option :key='null' :label='$t("lesson.all")' :value='null'></el-option>
          <el-option v-for="item in lessonSubjects" :key="item.id" :label="subjectName(item)" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="package-manager-selector-item">
        <label for="statusSelector">{{$t('lesson.statusLabel')}}</label>
        <el-select id="statusSelector" v-model="searchParams.stateId">
          <el-option :label='$t("lesson.all")' :value='null'></el-option>
          <el-option v-for="item in allStates" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="package-manager-selector-item package-manager-selector-box">
        <el-input class="package-manager-selector-search-box" :placeholder="$t('lesson.searchByName')" suffix-icon="el-icon-search" v-model="searchParams.name">
        </el-input>
      </div>
    </div>
    <div class="package-manager-details">
      <el-table class="package-manager-table" v-loading="isTableLoading" :data="filteredPackageList" style="width: 100%">
        <el-table-column type="index" :label="$t('lesson.serialNumber')" width="70">
        </el-table-column>
        <el-table-column class-name="package-manager-table-packagename" :label="$t('lesson.nameLabel')">
          <template slot-scope="scope">
            <div @click="toPackgeDetail(scope.row)">{{scope.row.packageName}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('lesson.subjectLabel')" width="190">
          <template slot-scope='scope'>{{subjectName(scope.row.subjectDetail)}}</template>
        </el-table-column>
        <el-table-column :label="$t('lesson.statusLabel')" width="125">
          <template slot-scope="scope">
            <el-popover v-show="isDisabledOrReject(scope.row)" popper-class='package-manager-state-popver' placement="bottom-end" trigger="hover">
              <div class="package-manager-state-popver-box">
                <div class="package-manager-state-popver-item">
                  <label class='package-manager-state-popver-label'>{{$t('lesson.lessonManage.packageLabel')}}:</label>
                  <span>{{scope.row.packageName}}</span>
                </div>
                <div class="package-manager-state-popver-item">
                  <label class='package-manager-state-popver-label'>{{$t('lesson.statusLabel')}}:</label>
                  <span class="package-manager-state-popver-danger">{{getStatusText(scope.row)}}</span>
                </div>
                <div class="package-manager-state-popver-item">
                  <label class='package-manager-state-popver-label'>{{$t('lesson.packageManage.detailLabel')}}:</label>
                  <div>{{scope.row.extra.message}}</div>
                </div>
              </div>
              <el-button class="package-manager-table-state" type="text" slot="reference">{{getStatusText(scope.row)}}</el-button>
            </el-popover>
            <span v-show="!isDisabledOrReject(scope.row)">{{getStatusText(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="" width="180" class-name="package-manager-table-operations">
          <template slot-scope="scope">
            <el-tooltip v-if="isSubmitable(scope.row)" effect="dark" :content="$t('lesson.submit')" placement="top">
              <i class="iconfont icon-submit" @click="toSubmit(scope.row)"></i>
            </el-tooltip>
            <el-tooltip v-if="isEditable(scope.row)" effect="dark" :content="$t('lesson.edit')" placement="top">
              <i class="iconfont icon-edit--" @click="toEdit(scope.row)"></i>
            </el-tooltip>
            <el-tooltip v-if="isDeletable(scope.row)" effect="dark" :content="$t('lesson.delete')" placement="top">
              <i class="iconfont icon-delete1" @click="confirmDelete(scope.row)"></i>
            </el-tooltip>
            <el-tooltip v-if="isReleasable(scope.row)" effect="dark" :content="$t('lesson.release')" placement="top">
              <i class="iconfont icon-Release" @click="toRelease(scope.row)"></i>
            </el-tooltip>
            <el-tooltip v-if="isRevocable(scope.row)" effect="dark" :content="$t('lesson.recall')" placement="top">
              <i class="iconfont icon-recall" @click="toRevoca(scope.row)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <operate-result-dialog :infoDialogData='infoDialogData' :isInfoDialogVisible='isInfoDialogVisible' @close='handleClose'></operate-result-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'
import OperateResultDialog from '@/components/lesson/common/OperateResultDialog'
import colI18n from '@/lib/utils/i18n/column'

export default {
  name: 'PackageManager',
  async mounted() {
    await this.lessonGetUserPackages({ useCache: false })
    await this.lessonGetAllSubjects({})
  },
  data() {
    return {
      allStates: [
        {
          value: 0,
          label: this.$t('lesson.notSubmitted')
        },
        {
          value: 1,
          label: this.$t('lesson.pendingReview')
        },
        {
          value: 2,
          label: this.$t('lesson.approved')
        },
        {
          value: 3,
          label: this.$t('lesson.rejected')
        },
        {
          value: 4,
          label: this.$t('lesson.disabled')
        }
      ],
      searchParams: {
        name: '',
        subjectId: null,
        stateId: null
      },
      isTableLoading: false,
      isInfoDialogVisible: false,
      infoDialogData: {
        paras: [],
        type: '', // danger or default
        iconType: '', // submit or delete or release or revoca
        continueFnNameAfterEnsure: ''
      },
      editingPackageId: null
    }
  },
  computed: {
    ...mapGetters({
      lessonUserPackages: 'lesson/teacher/userPackages',
      lessonPackageLessons: 'lesson/teacher/packageLessons',
      lessonSubjects: 'lesson/subjects'
    }),
    filteredPackageList() {
      let subjectFilteredPackageList = this.getSubjectFilteredPackageList(
        this.lessonUserPackages
      )
      let stateFilteredPackageList = this.getStateFilteredPackageList(
        subjectFilteredPackageList
      )
      let nameFilteredPackageList = this.getNameFilteredPackageList(
        stateFilteredPackageList
      )
      let containSubjectNamePackageList = _.map(
        nameFilteredPackageList,
        (obj, index) => {
          let subjectId = obj.subjectId
          if (!subjectId) {
            return obj
          }
          let targetSubject = _.find(this.lessonSubjects, { id: subjectId })
          obj.subjectDetail = targetSubject
          return obj
        }
      )
      return containSubjectNamePackageList
    },
    editingPackageDetail() {
      let packageDetail = _.find(this.filteredPackageList, {
        id: this.editingPackageId
      })
      packageDetail.lessons = _.get(
        this.lessonPackageLessons,
        this.editingPackageId
      )
      return packageDetail
    }
  },
  methods: {
    ...mapActions({
      lessonGetUserPackages: 'lesson/teacher/getUserPackages',
      lessonAuditPackage: 'lesson/teacher/auditPackage',
      lessonReleasePackage: 'lesson/teacher/releasePackage',
      lessonDeletePackage: 'lesson/teacher/deletePackage',
      lessonGetLessonList: 'lesson/teacher/getLessonList',
      lessonGetAllSubjects: 'lesson/getAllSubjects'
    }),
    getStatusText(packageDetail) {
      let statusText = ''
      switch (packageDetail.state) {
        case 0:
          statusText = this.$t('lesson.notSubmitted')
          break
        case 1:
          statusText = this.$t('lesson.pendingReview')
          break
        case 2:
          statusText = this.$t('lesson.approved')
          break
        case 3:
          statusText = this.$t('lesson.rejected')
          break
        case 4:
          statusText = this.$t('lesson.disabled')
          break
        default:
          break
      }
      return statusText
    },
    isDisabledOrReject(packageDetail) {
      return packageDetail.state === 3 || packageDetail.state === 4
    },
    isSubmitable(packageDetail) {
      return (
        packageDetail.state === 0 ||
        packageDetail.state === 3 ||
        packageDetail.state === 4
      )
    },
    isEditable(packageDetail) {
      return packageDetail.state != 1
    },
    isDeletable(packageDetail) {
      return (
        packageDetail.state === 0 ||
        packageDetail.state === 3 ||
        packageDetail.state === 4
      )
    },
    isReleasable(packageDetail) {
      return false
      // return packageDetail.state === 2 // The first version temporarily removes the release function
    },
    isRevocable(packageDetail) {
      return packageDetail.state === 1
    },
    getSubjectFilteredPackageList(originList) {
      let searchedSubjectId = this.searchParams.subjectId
      return searchedSubjectId
        ? _.filter(originList, {
            subjectId: searchedSubjectId
          })
        : originList
    },
    getStateFilteredPackageList(originList) {
      let searchedStateId = this.searchParams.stateId
      return typeof searchedStateId === 'number'
        ? _.filter(originList, packageDetail => {
            return packageDetail.state === searchedStateId
          })
        : originList
    },
    getNameFilteredPackageList(originList) {
      let searchText = this.searchParams.name
      if (searchText.length <= 0) {
        return originList
      }
      let reg = new RegExp(searchText)
      return _.filter(originList, packageDetail => {
        return reg.test(packageDetail.packageName)
      })
    },
    async isPackageInfoComplete() {
      let {
        subjectId,
        minAge,
        maxAge,
        intro,
        rmb,
        extra
      } = this.editingPackageDetail
      if (
        typeof subjectId !== 'number' ||
        typeof minAge !== 'number' ||
        typeof maxAge !== 'number' ||
        typeof rmb !== 'number' ||
        !intro ||
        !extra.coverUrl
      ) {
        return false
      }
      await this.lessonGetLessonList({ packageId: this.editingPackageId })
      let { lessons } = this.editingPackageDetail
      if (!lessons || lessons.length <= 0) {
        return false
      }
      return true
    },
    async toSubmit(packageDetail) {
      this.isTableLoading = true
      this.editingPackageId = packageDetail.id
      let isComplete = await this.isPackageInfoComplete()
      if (!isComplete) {
        this.infoDialogData = {
          paras: [this.$t('lesson.pleaseCompleteInfo')],
          type: 'danger', // danger or default
          iconType: 'submit' // submit or delete
        }
        this.isInfoDialogVisible = true
        this.isTableLoading = false
        return
      }
      await this.lessonAuditPackage({
        packageId: packageDetail.id,
        state: 1
      })
        .then(result => {
          this.infoDialogData = {
            paras: [
              this.$t('lesson.successfullySubmitted'),
              this.$t('lesson.successfullySubmittedDetail')
            ],
            iconType: 'submit'
          }
          this.isInfoDialogVisible = true
          this.isTableLoading = false
          return Promise.resolve()
        })
        .catch(error => {
          let errorMsg = ''
          switch (error.status) {
            case 401:
              errorMsg = this.$t('lesson.packageManage.pleaseLogin')
              break
            default:
              errorMsg = this.$t('lesson.failedSubmitInfo')
              break
          }
          this.infoDialogData = {
            paras: [errorMsg],
            type: 'danger',
            iconType: 'submit'
          }
          this.isInfoDialogVisible = true
          this.isTableLoading = false
          return Promise.reject(new Error('Submit package to audit failed'))
        })
    },
    toEdit(packageDetail) {
      this.$router.push(`/teacher/package/${packageDetail.id}/edit`)
    },
    toPackgeDetail(packageDetail) {
      this.$router.push(`/teacher/package/${packageDetail.id}`)
    },
    async confirmDelete(packageDetail) {
      this.editingPackageId = packageDetail.id
      this.infoDialogData = {
        paras: [
          this.$t('lesson.deletePackageConfirm'),
          this.$t('lesson.deletePackageInfo')
        ],
        iconType: 'delete',
        type: 'danger',
        continueButtonText: this.$t('lesson.deleteDialogYes'),
        cancelButtonText: this.$t('lesson.deleteDialogNo'),
        continueFnNameAfterEnsure: 'toDelete'
      }
      this.isInfoDialogVisible = true
    },
    async toDelete() {
      this.isTableLoading = true
      await this.lessonDeletePackage({ packageId: this.editingPackageId })
      this.isTableLoading = false
    },
    async toRelease(packageDetail) {
      this.isTableLoading = true
      this.editingPackageId = packageDetail.id
      await this.lessonGetLessonList({ packageId: this.editingPackageId })
      await this.lessonReleasePackage({
        packageDetail: this.editingPackageDetail
      })
      this.infoDialogData = {
        paras: [this.$t('lesson.successfullyReleased')],
        iconType: 'release'
      }
      this.isInfoDialogVisible = true
      this.isTableLoading = false
    },
    async toRevoca(packageDetail) {
      this.isTableLoading = true
      await this.lessonAuditPackage({
        packageId: packageDetail.id,
        state: 0
      })
        .then(result => {
          this.infoDialogData = {
            paras: [this.$t('lesson.successfullyRecall')],
            iconType: 'revoca'
          }
          this.isInfoDialogVisible = true
          this.isTableLoading = false
          return Promise.resolve()
        })
        .catch(error => {
          let errorMsg = ''
          switch (error.status) {
            case 401:
              errorMsg = this.$t('lesson.packageManage.pleaseLogin')
              break
            default:
              errorMsg = this.$t('lesson.failedRecallInfo')
              break
          }
          this.infoDialogData = {
            paras: [errorMsg],
            type: 'danger',
            iconType: 'submit'
          }
          this.isInfoDialogVisible = true
          this.isTableLoading = false
          return Promise.reject(new Error('Revoca package to audit failed'))
        })
    },
    toNewPackagePage() {
      this.$router.push({ path: '/teacher/newPackage' })
    },
    handleClose(continueFnNameAfterEnsure) {
      this.isInfoDialogVisible = false
      if (continueFnNameAfterEnsure === 'toDelete') {
        this.toDelete()
      }
    },
    subjectName(subject) {
      return colI18n.getLangValue(subject, 'subjectName')
    }
  },
  components: {
    OperateResultDialog
  }
}
</script>
<style lang="scss">
.package-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  &-overview {
    margin-bottom: 20px;
    display: flex;
    align-items: flex-end;
  }
  &-total {
    flex: 1;
    color: #333;
    font-size: 22px;
    font-weight: bold;
    padding-left: 20px;
  }
  &-new-button {
    font-size: 18px;
    font-weight: bold;
    padding: 8px 10px;
    margin: 10px 20px 0;
    width: 266px;
    i {
      margin-right: 9px;
      font-weight: normal;
      font-size: 22px;
      vertical-align: middle;
    }
  }
  &-selector {
    background-color: #fff;
    text-align: center;
    font-size: 14px;
    color: #b3b3b3;
    padding: 30px 20px 40px;
    display: flex;
    justify-content: space-between;
    &-item {
      display: inline-block;
      .el-select {
        width: 190px;
        margin-left: 8px;
        .el-select__caret.is-reverse {
          line-height: 0;
          top: -6px;
          position: relative;
        }
      }
    }
    &-item:last-child {
      margin-right: 0;
    }
    &-box {
      width: 166px;
    }
    .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
    .el-input__suffix {
      top: 6px;
    }
    &-search-box {
      .el-input__inner {
        border-radius: 0;
        border-width: 0 0 1px 0;
        padding-left: 0;
      }
      .el-input__suffix {
        top: 0;
      }
      .el-input__icon {
        line-height: 28px;
      }
    }
  }
  &-details {
    padding: 10px 20px;
    background-color: #fff;
    flex: 1;
    overflow: auto;
  }
  &-table {
    border: 1px solid #d2d2d2;
    tr,
    th {
      text-align: center;
      color: #414141;
    }
    td,
    th.is-leaf {
      border-color: #d2d2d2;
      padding: 11px 0;
    }
    th.is-leaf {
      padding: 15px 0;
    }
    .iconfont {
      font-size: 20px;
      color: #b3b3b3;
      margin-right: 30px;
      cursor: pointer;
    }
    .iconfont:last-child {
      margin-right: 0;
    }
    &-packagename {
      .cell {
        white-space: nowrap;
        cursor: pointer;
      }
      .cell:hover {
        font-weight: bold;
      }
    }
    &-operations {
      text-align: right;
      .cell {
        padding: 0 20px;
      }
    }
    &-state,
    &-state:hover {
      color: #f75858;
    }
  }
  &-state-popver {
    padding: 40px 40px 36px 36px;
    box-sizing: border-box;
    width: auto;
    max-width: 500px;
    &-danger {
      color: #f75858;
    }
    &-label {
      color: #414141;
      font-weight: bold;
    }
    &-item {
      margin-bottom: 6px;
    }
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .package-manager {
    &-overview {
      padding: 0 16px;
      margin-bottom: 8px;
      align-items: center;
    }
    &-total {
      font-size: 18px;
    }
    &-new-button {
      width: auto;
      font-size: 16px;
      padding: 8px 16px;
    }
    &-selector {
      padding: 8px;
      align-items: flex-end;
      &-item {
        flex: 1;
        padding: 0 8px;
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>
