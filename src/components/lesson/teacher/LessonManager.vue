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
          <el-option v-for="item in lessonSubjects" :key="item.id" :label="item.subjectName" :value="item.id">
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
      <el-table class="lesson-manager-table" v-loading="isTableLoading" :data="filteredLessonList" height="450" style="width: 100%">
        <el-table-column class-name="lesson-manager-table-index" type="index" :label="$t('lesson.serialNumber')" width="50">
        </el-table-column>
        <el-table-column type='expand' width="40">
          <template slot-scope="expandProps">
            <div class="lesson-manager-table-expand">
              <div class="lesson-manager-table-package-item" v-for="(packageItem, index) in expandProps.row.packages" :key="index">
                <span class="lesson-manager-table-package-item-name">{{packageItem.packageName}}</span>
                <el-popover popper-class='lesson-manager-table-package-popver' placement="bottom-start" trigger="click">
                  <div class="lesson-manager-table-package-popver-box">
                    <div class="lesson-manager-table-package-popver-item">
                      <label class='lesson-manager-table-package-popver-label'>课程包名：</label>
                      <span>{{packageItem.packageName}}</span>
                    </div>
                    <div class="lesson-manager-table-package-popver-item">
                      <label class='lesson-manager-table-package-popver-label'>状态：</label>
                      <span>{{packageItem.state | transformStateValue(statesArray)}}</span>
                    </div>
                    <div class="lesson-manager-table-package-popver-item">
                      <label class='lesson-manager-table-package-popver-label'>详情：</label>
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
        </el-table-column>
        <el-table-column prop="subjectDetail.subjectName" :label="$t('lesson.subjectLabel')" width="200">
        </el-table-column>
        <el-table-column label="" width="165" class-name="lesson-manager-table-operations">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="$t('lesson.edit')" placement="top">
              <i class="iconfont icon-edit--" @click="toEdit(scope.row)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LessonManager',
  async mounted() {
    await this.lessonGetUserLessons({})
    await this.lessonGetAllSubjects({})
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
      lessonUserPackages: 'lesson/teacher/userPackages',
      lessonUserLessons: 'lesson/teacher/userLessons',
      lessonPackageLessons: 'lesson/teacher/packageLessons',
      lessonSubjects: 'lesson/subjects'
    }),
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
      let containSubjectNamePackageList = _.map(
        namefilteredLessonList,
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
    editinglessonDetail() {
      let lessonDetail = _.find(this.filteredLessonList, {
        id: this.editingLessonId
      })
      return lessonDetail
    }
  },
  methods: {
    ...mapActions({
      lessonGetUserLessons: 'lesson/teacher/getUserLessons',
      lessonGetAllSubjects: 'lesson/getAllSubjects'
    }),
    getSubjectFilteredPackageList(originList) {
      let searchedSubjectId = this.searchParams.subjectId
      return searchedSubjectId
        ? _.filter(originList, {
            subjectId: searchedSubjectId
          })
        : originList
    },
    getPackageFilteredLessonList(originList) {
      let searchedPackageId = this.searchParams.packageId
      return typeof searchedPackageId === 'number'
        ? _.filter(originList, lessonDetail => {
            return (
              _.find(lessonDetail.packages, { id: searchedPackageId }) !==
              undefined
            )
          })
        : originList
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
    toNewLessonPage() {
      this.$router.push({ path: '/teacher/lesson/new' })
    },
    toEdit(lessonDetail) {
      this.$router.push(`/teacher/lesson/${lessonDetail.id}/edit`)
    }
  },
  filters: {
    transformStateValue(stateId, statesArray) {
      return _.find(statesArray, { id: stateId }).value
    }
  }
}
</script>
<style lang="scss">
.lesson-manager {
  padding-top: 48px;
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
  }
  &-new-button {
    font-size: 18px;
    font-weight: bold;
    padding: 16px 15px;
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
  }
  &-table {
    border: 1px solid #d2d2d2;
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
    }
    &-operations {
      text-align: right;
      .cell {
        padding: 0 20px;
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
    &-package-item {
      width: 50%;
      display: flex;
      align-items: center;
      height: 50px;
      padding: 0 48px;
      position: relative;
      border-bottom: 1px solid #d2d2d2;
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
}
</style>
