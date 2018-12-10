<template>
  <div class="lesson-manager">
    <div class="lesson-manager-overview">
      <div class="lesson-manager-total">{{$t('lesson.lessonManage.lessonsCount')}}: {{lessonUserLessons.length}}</div>
      <el-button type="primary" class="lesson-manager-new-button" @click="toNewLessonPage">
        <i class="iconfont icon-add"></i>{{$t('lesson.newLesson')}}
      </el-button>
    </div>
    <div class="lesson-manager-selector">
      <div class="lesson-manager-selector-item">
        <label for="subjectSelector">{{$t('lesson.subjectLabel')}}</label>
        <el-select id="subjectSelector" v-model="searchParams.subjectId">
          <el-option :key='null' :label='$t("lesson.all")' :value='null'></el-option>
          <el-option v-for="item in lessonSubjects" :key="item.id" :label="subjectName(item)" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="lesson-manager-selector-item">
        <label for="packageSelector">{{$t('lesson.lessonManage.packageLabel')}}</label>
        <el-select id="packageSelector" class="lesson-manager-selector-package" v-model="searchParams.packageId">
          <el-option :label='$t("lesson.all")' :value='null'></el-option>
          <el-option v-for="item in lessonUserPackages" :key="item.id" :label="item.packageName" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="lesson-manager-selector-item lesson-manager-selector-box">
        <el-input class="lesson-manager-selector-search-box" :placeholder="$t('lesson.searchByName')" suffix-icon="el-icon-search" v-model="searchParams.name">
        </el-input>
      </div>
    </div>
    <div class="lesson-manager-details">
      <el-table class="lesson-manager-table" :row-class-name="getRowClass" :row-key="setRowKey" :expand-row-keys="expandRowKeys" v-loading="isTableLoading" :data="filteredLessonList" style="width: 100%">
        <el-table-column class-name="lesson-manager-table-index" type="index" :label="$t('lesson.serialNumber')" width="50">
        </el-table-column>
        <el-table-column prop='packages' type='expand' width="40">
          <template slot-scope="expandProps">
            <div class="lesson-manager-table-expand">
              <div class="lesson-manager-table-package-item" :class="{'lesson-manager-table-package-item-active': searchParams.packageId === packageItem.id}" v-for="(packageItem, index) in expandProps.row.packages" :key="index">
                <span class="lesson-manager-table-package-item-name">{{packageItem.packageName}}</span>
                <el-popover popper-class='lesson-manager-table-package-popver' placement="bottom-start" trigger="click">
                  <div class="lesson-manager-table-package-popver-box">
                    <div class="lesson-manager-table-package-popver-item">
                      <label class='lesson-manager-table-package-popver-label'>{{$t('lesson.lessonManage.packageLabel')}}:</label>
                      <span>{{packageItem.packageName}}</span>
                    </div>
                    <div class="lesson-manager-table-package-popver-item">
                      <label class='lesson-manager-table-package-popver-label'>{{$t('lesson.statusLabel')}}:</label>
                      <span>{{packageItem.state | transformStateValue(statesArray)}}</span>
                    </div>
                    <div class="lesson-manager-table-package-popver-item">
                      <label class='lesson-manager-table-package-popver-label'>{{$t('lesson.intro')}}:</label>
                      <div>{{packageItem.intro || $t('lesson.lessonManage.noIntro')}}</div>
                    </div>
                  </div>
                  <el-button class="lesson-manager-table-package-state" type="text" slot="reference">{{packageItem.state | transformStateValue(statesArray)}}</el-button>
                </el-popover>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="lesson-manager-table-lessonName" prop="lessonName" :label="$t('lesson.nameLabel')">
          <template slot-scope='scope'>
            <el-tooltip effect="dark" :content="$t('lesson.lessonManage.toKpEditorInfo')" placement="top-start">
              <span @click='toEditor(scope.row)'>{{scope.row.lessonName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('lesson.subjectLabel')" width="190">
          <template slot-scope='scope'>{{subjectName(scope.row.subjectDetail)}}</template>
        </el-table-column>
        <el-table-column label="" width="180" class-name="lesson-manager-table-operations">
          <template slot-scope="scope">
            <el-tooltip v-if="isEditable(scope.row)" effect="dark" :content="$t('lesson.edit')" placement="top">
              <i class="iconfont icon-edit--" @click="toEdit(scope.row)"></i>
            </el-tooltip>
            <el-tooltip v-if="isReleasable(scope.row)" effect="dark" :content="$t('lesson.release')" placement="top">
              <i class="iconfont icon-Release" @click="toRelease(scope.row)"></i>
            </el-tooltip>
            <el-tooltip v-if="isDeletable(scope.row)" effect="dark" :content="$t('lesson.delete')" placement="top">
              <i class="iconfont icon-delete1" @click="confirmDelete(scope.row)"></i>
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
import { mapActions, mapGetters } from 'vuex'
import colI18n from '@/lib/utils/i18n/column'
import OperateResultDialog from '@/components/lesson/common/OperateResultDialog'
export default {
  name: 'LessonManager',
  props: {
    windowWidth: Number
  },
  async mounted() {
    this.isTableLoading = true
    await Promise.all([
      this.lessonGetUserPackages({}),
      this.lessonGetUserLessons({}),
      this.lessonGetAllSubjects({})
    ])
    this.isTableLoading = false
  },
  data() {
    return {
      searchParams: {
        name: '',
        subjectId: null,
        packageId: null
      },
      isTableLoading: false,
      isInfoDialogVisible: false,
      infoDialogData: {
        paras: [],
        type: '', // danger or default
        iconType: '', // submit or delete or release or revoca
        continueFnNameAfterEnsure: ''
      },
      editingLessonId: null,
      expandRowKeys: [],
      statesArray: [
        {
          id: 0,
          value: this.$t('lesson.notSubmitted')
        },
        {
          id: 1,
          value: this.$t('lesson.pendingReview')
        },
        {
          id: 2,
          value: this.$t('lesson.approved')
        },
        {
          id: 3,
          value: this.$t('lesson.rejected')
        },
        {
          id: 4,
          value: this.$t('lesson.disabled')
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      lessonUserPackages: 'lesson/teacher/userPackages',
      lessonUserLessons: 'lesson/teacher/userLessons',
      lessonPackageLessons: 'lesson/teacher/packageLessons',
      lessonSubjects: 'lesson/subjects'
    }),
    username() {
      return _.get(this.userProfile, 'username')
    },
    filteredLessonList() {
      let subjectfilteredLessonList = this.getSubjectFilteredPackageList(
        this.lessonUserLessons
      )
      let packageFilteredLessonList = this.getPackageFilteredLessonList(
        subjectfilteredLessonList
      )
      let namefilteredLessonList = this.getNamefilteredLessonList(
        packageFilteredLessonList
      )
      let searchedPackageId = this.searchParams.packageId
      let isSearchingPackage = typeof searchedPackageId === 'number'
      this.expandRowKeys = []
      let containSubjectNamePackageList = _.map(
        namefilteredLessonList,
        (obj, index) => {
          if (isSearchingPackage) {
            this.expandRowKeys.push(obj.id)
          }
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
    hostname() {
      return window.location.hostname
    },
    editorPagePrefix() {
      return '/ed/'
    },
    editinglessonDetail() {
      let lessonDetail = _.find(this.filteredLessonList, {
        id: this.editingLessonId
      })
      return lessonDetail
    },
    isPhoneSize() {
      return this.windowWidth < 768
    }
  },
  methods: {
    ...mapActions({
      lessonGetUserPackages: 'lesson/teacher/getUserPackages',
      lessonGetUserLessons: 'lesson/teacher/getUserLessons',
      lessonGetAllSubjects: 'lesson/getAllSubjects',
      lessonDeleteLesson: 'lesson/teacher/deleteLesson',
      gitlabGetFileDetail: 'gitlab/getFileDetail'
    }),
    getRowClass({ row, rowIndex }) {
      let { packages } = row
      if (packages.length <= 0) {
        return 'lesson-manager-table-no-expand'
      }
      return ''
    },
    setRowKey(row) {
      return row.id
    },
    getSubjectFilteredPackageList(originList) {
      let searchedSubjectId = this.searchParams.subjectId
      if (searchedSubjectId) {
        return _.filter(originList, {
          subjectId: searchedSubjectId
        })
      } else {
        return originList
      }
    },
    getPackageFilteredLessonList(originList) {
      let searchedPackageId = this.searchParams.packageId
      if (typeof searchedPackageId === 'number') {
        return _.filter(originList, lessonDetail => {
          return (
            _.find(lessonDetail.packages, { id: searchedPackageId }) !==
            undefined
          )
        })
      } else {
        return originList
      }
    },
    getNamefilteredLessonList(originList) {
      let searchText = this.searchParams.name
      if (searchText.length <= 0) {
        return originList
      }
      let reg = new RegExp(searchText)
      return _.filter(originList, lessonDetail => {
        return reg.test(lessonDetail.lessonName)
      })
    },
    isEditable(lessonDetail) {
      let { packages } = lessonDetail
      let pendingReviewPackageIndex = _.findIndex(packages, { state: 1 })
      return pendingReviewPackageIndex === -1
    },
    isReleasable(lessonDetail) {
      // The first version temporarily removes the release function
      // let { packages } = lessonDetail
      // let approvedPackageIndex = _.findIndex(packages, { state: 2 })
      // return this.isEditable(lessonDetail) && approvedPackageIndex >= 0
      return false
    },
    isDeletable(lessonDetail) {
      return this.isEditable(lessonDetail)
    },
    toNewLessonPage() {
      this.$router.push({ path: '/teacher/lesson/new' })
    },
    toEdit(lessonDetail) {
      this.$router.push(`/teacher/lesson/${lessonDetail.id}/edit`)
    },
    async toRelease(lessonDetail) {
      console.log(lessonDetail)
    },
    toEditorPage(url) {
      let targetUrl = this.editorPagePrefix
      if (url) {
        targetUrl += this.username + '/' + this.getRemovePrefixUrl(url)
      }
      window.location.href = targetUrl
    },
    getRemovePrefixUrl(url) {
      let username = this.username
      let usernameLen = username.length
      let templateUrlStartIndex = url.indexOf(username) + usernameLen + 1
      return url.substring(templateUrlStartIndex)
    },
    async toEditor(lessonDetail) {
      let { url } = lessonDetail
      if (url) {
        await this.isUrlExist(url)
          .then(() => {
            this.toEditorPage(url)
          })
          .catch(() => {
            this.confirmGo(url)
          })
      } else {
        this.confirmGo(url)
      }
    },
    confirmGo(url) {
      this.$confirm(this.$t('lesson.lessonManage.urlNotCreatInfo'), '', {
        confirmButtonText: this.$t('common.Yes'),
        cancelButtonText: this.$t('common.No'),
        center: true,
        customClass: 'lesson-manager-confirm-dialog'
      })
        .then(() => {
          this.toEditorPage(url)
        })
        .catch(() => {
          this.isTableLoading = false
        })
    },
    async isUrlExist(url) {
      this.isTableLoading = true
      let username = this.username
      let removedPrefixUrl = this.getRemovePrefixUrl(url)
      let sitename = removedPrefixUrl.split('/')[0]
      let result = await this.gitlabGetFileDetail({
        projectPath: `${username}/${sitename}`,
        fullPath: `${username}/${removedPrefixUrl}.md`
      })
        .then(() => {
          return Promise.resolve()
        })
        .catch(() => {
          return Promise.reject(new Error('File not created!'))
        })
      this.isTableLoading = false
    },
    async confirmDelete(lessonDetail) {
      this.editingLessonId = lessonDetail.id
      this.infoDialogData = {
        paras: [
          this.$t('lesson.lessonManage.deleteLessonConfirm'),
          this.$t('lesson.lessonManage.deleteLessonInfo')
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
      await this.lessonDeleteLesson({ lessonId: this.editingLessonId })
      this.isTableLoading = false
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
  filters: {
    transformStateValue(stateId, statesArray) {
      return _.find(statesArray, { id: stateId }).value
    }
  },
  components: {
    OperateResultDialog
  }
}
</script>
<style lang="scss">
.lesson-manager {
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
    &-package {
      max-width: 200px;
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
    height: 100%;
    tr,
    th {
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
    &-lessonName {
      .cell {
        white-space: nowrap;
      }
      .el-tooltip {
        cursor: pointer;
      }
      .el-tooltip:hover {
        font-weight: bold;
      }
    }
    &-operations {
      text-align: right;
      .cell {
        padding: 0 30px 0 20px;
      }
    }
    &-index {
      text-align: center;
    }
    &-expand {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: -1px;
    }
    &-no-expand {
      .el-icon-arrow-right {
        display: none;
      }
    }
    &-package-item {
      width: 50%;
      display: flex;
      align-items: center;
      height: 50px;
      padding: 0 48px;
      position: relative;
      border-bottom: 1px solid #d2d2d2;
      &-active {
        border: 2px solid #409efe;
        border-radius: 4px;
        box-shadow: 0 0 0 2px #c9e4ff;
      }
      &-name {
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
      }
      .el-button--text,
      .el-button--text:focus,
      .el-button--text:hover {
        color: #f75858;
      }
    }
    &-package-item:nth-child(odd) {
      padding-left: 100px;
    }
    &-package-item:nth-child(even) {
      padding-right: 100px;
    }
    &-package-item:nth-child(odd)::after {
      content: '';
      display: inline-block;
      width: 1px;
      height: 24px;
      background-color: #aeaeae;
      top: 12px;
      position: absolute;
      right: 0;
    }
    &-package-item:last-child::after {
      background-color: transparent;
    }
    &-package-popver {
      padding: 40px 40px 36px 36px;
      box-sizing: border-box;
      width: auto;
      max-width: 500px;
      &-label {
        color: #414141;
        font-weight: bold;
      }
      &-item {
        margin-bottom: 6px;
      }
    }
    .el-table__expanded-cell[class*='cell'] {
      background-color: #f7f7f7 !important;
      padding: 0;
    }
  }
  &-confirm-dialog {
    width: 560px;
    padding-bottom: 23px;
    .el-message-box__close {
      font-size: 24px;
      color: #cdcdcd;
    }
    .el-message-box__content {
      font-size: 18px;
      color: #f75858;
      padding: 38px 0 70px;
    }
    .el-button {
      width: 148px;
      height: 60px;
      line-height: 60px;
      padding: 0;
      font-size: 18px;
    }
    .el-button + .el-button {
      margin-left: 46px;
    }
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .lesson-manager {
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
