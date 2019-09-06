<template>
  <div class="lesson-basic-info">
    <div class="lesson-basic-info-row">
      <div class="lesson-basic-info-link-url" v-show="!isEditorMod">
        <label class="lesson-basic-info-label lesson-basic-info-link-url-label" for="linkUrlInput">
          <span class="lesson-basic-info-sub">(可选)</span>教案链接页面是
        </label>
        <div class="lesson-basic-info-url-box">
          <el-input id="linkUrlInput" :placeholder="$t('lesson.pleaseInput')" :disabled="isEditorMod" v-model="tempUrl" @input='checkTempUrlValid' @blur='setUrl'>
            <template slot="prepend">{{linkPagePrefix}}</template>
          </el-input>
          <div class="lesson-basic-info-url-box-error">{{urlInvalidInfo}}</div>
        </div>
      </div>
      <div class="lesson-basic-info-link-url" v-show="!isEditorMod">
        <label class="lesson-basic-info-label lesson-basic-info-link-url-label" for="coursewarelinkUrlInput">
          <span class="lesson-basic-info-sub">(可选)</span>课件链接页面是
        </label>
        <div class="lesson-basic-info-url-box">
          <el-input id="coursewarelinkUrlInput" :placeholder="$t('lesson.pleaseInput')" :disabled="isEditorMod" v-model="tempCoursewareUrl" @input='checkTempCoursewareUrlValid' @blur='setCoursewareUrl'>
            <template slot="prepend">{{linkPagePrefix}}</template>
          </el-input>
          <div class="lesson-basic-info-url-box-error">{{coursewareUrlInvalidInfo}}</div>
        </div>
      </div>
      <div class="lesson-basic-info-subject-packages">
        <div class="lesson-basic-info-subject">
          <label class="lesson-basic-info-label" for="subjectSelector">{{$t('lesson.packageManage.Subject')}}</label>
          <el-select :disabled="!isEditable" size="mini" v-model="editingLessonDetail.subjectId">
            <el-option v-for="item in lessonSubjects" :key="item.id" :label="subjectName(item)" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="lesson-basic-info-packages" v-loading='isPackageZoneLoading'>
          <label class="lesson-basic-info-label" for="priceInput">{{$t('lesson.packageManage.package')}}</label>
          <div class="lesson-basic-info-packages-list">
            <el-checkbox-group v-model="belongToPackageIds" :disabled="!isEditable">
              <el-checkbox v-for='(packageDetail, index) in userPackages' :key="index" :label="packageDetail.id">{{packageDetail.packageName}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="lesson-basic-info-packages-new-editor" v-show="isNewPackageEditorShow">
            <el-checkbox v-model="isNewPackageSelected"></el-checkbox>
            <el-input v-model="newPackageName" size="small"></el-input>
            <i class="el-icon-circle-close" :title="$t('common.Cancel')" @click="hideNewPackageEditor"></i>
            <i class="el-icon-circle-check" :title="$t('common.Save')" @click="createNewPackage"></i>
          </div>
          <div v-if="isEditable" class="lesson-basic-info-packages-new" @click="showNewPackageEditor">
            <i class="el-icon-circle-plus-outline"></i>{{$t('lesson.newPackage')}}
          </div>
        </div>
      </div>
      <div class="lesson-basic-info-name">
        <label class="lesson-basic-info-label" for="priceInput">{{$t('lesson.nameLabel')}}</label>
        <el-input :disabled="!isEditable" v-model="editingLessonDetail.lessonName" :placeholder="$t('lesson.pleaseInput')" :maxlength='255'></el-input>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import colI18n from '@/lib/utils/i18n/column'

export default {
  name: 'LessonBasicInfo',
  props: {
    editingLessonDetailProp: Object,
    isEditing: Boolean,
    isEditable: {
      type: Boolean,
      default: true
    },
    isEditorMod: {
      type: Boolean,
      default: false
    }
  },
  async mounted() {
    this.isPackageZoneLoading = true
    await this.lessonGetUserPackages({})
    this.isPackageZoneLoading = false
    await this.lessonGetAllSubjects({})
    if (this.isEditing) {
      let editingLessonDetailProp = this.editingLessonDetailProp
      let {
        url,
        coursewareUrl,
        subjectId,
        lessonName,
        packages
      } = editingLessonDetailProp
      _.forEach(packages, packageDetail => {
        let { id } = packageDetail
        this.belongToPackageIds.push(id)
      })
      this.tempUrl = this.isEditorMod
        ? this.activePageUrl.replace(`/${this.username}/`, '')
        : url && this.getTemplateUrl(url)
      this.tempCoursewareUrl = this.isEditorMod
        ? this.activePageUrl.replace(`/${this.username}/`, '')
        : coursewareUrl && this.getTemplateUrl(coursewareUrl)
      this.editingLessonDetail = {
        url: this.tempUrl,
        coursewareUrl: this.tempCoursewareUrl,
        subjectId,
        lessonName
      }
      this.setUrl()
      this.setCoursewareUrl()
    }
    let defaultSubjectId = this.lessonSubjects[0].id
    this.defaultSubjectId = defaultSubjectId
    this.editingLessonDetail.subjectId = defaultSubjectId
  },
  data() {
    return {
      newPackageName: '',
      belongToPackageIds: [],
      isNewPackageEditorShow: false,
      isPackageZoneLoading: false,
      isNewPackageSelected: true,
      tempUrl: '',
      tempCoursewareUrl: '',
      urlInvalidInfo: '',
      coursewareUrlInvalidInfo: '',
      defaultSubjectId: undefined,
      defaultMinAge: 0,
      defaultMaxAge: 0,
      oldLinkPrefiex: '',
      editingLessonDetail: {
        url: null,
        subjectId: null,
        lessonName: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      lessonSubjects: 'lesson/subjects',
      userPackages: 'lesson/teacher/userPackages',
      activePageUrl: 'activePageUrl'
    }),
    isLinkPageUrlValid() {
      return this.urlInvalidInfo.length == 0
    },
    isCoursewareUrlValid() {
      return this.coursewareUrlInvalidInfo.length === 0
    },
    username() {
      return _.get(this.userProfile, 'username')
    },
    origin() {
      return window.location.origin
    },
    linkPagePrefix() {
      return `${this.origin}/${this.username}/`
    }
  },
  methods: {
    ...mapActions({
      lessonGetUserPackages: 'lesson/teacher/getUserPackages',
      lessonGetAllSubjects: 'lesson/getAllSubjects',
      teacherCreateNewPackage: 'lesson/teacher/createNewPackage'
    }),
    showNewPackageEditor() {
      this.newPackageName = ''
      this.isNewPackageSelected = true
      this.isNewPackageEditorShow = true
    },
    hideNewPackageEditor() {
      this.isNewPackageEditorShow = false
    },
    async createNewPackage() {
      if (!this.newPackageName) {
        this.$message({
          type: 'error',
          message: this.$t('lesson.packageManage.nameIsRequiredInfo')
        })
        return
      }
      this.isPackageZoneLoading = true
      await this.teacherCreateNewPackage({
        newPackageData: {
          packageName: this.newPackageName,
          subjectId: this.defaultSubjectId,
          minAge: this.defaultMinAge || 0,
          maxAge: this.defaultMaxAge || 0
        }
      }).then(packageDetail => {
        let id = _.get(packageDetail, 'id')
        this.hideNewPackageEditor()
        if (this.isNewPackageSelected) {
          this.belongToPackageIds.push(id)
        }
      })
      this.isPackageZoneLoading = false
    },
    checkTempUrlValid() {
      let { isValid, msg } = this.checkUrlValid(this.tempUrl)
      this.urlInvalidInfo = msg
      return isValid
    },
    checkTempCoursewareUrlValid() {
      let { isValid, msg } = this.checkUrlValid(this.tempCoursewareUrl)
      this.coursewareUrlInvalidInfo = msg
      return isValid
    },
    checkUrlValid(url) {
      const ValidPageLinkReg = new RegExp(
        /^[^/\\:@&*=#"*?<>|\s][^\\:@&*=#"*?<>|\s]+$/
      )
      if (url == '' || ValidPageLinkReg.test(url)) {
        return {
          isValid: true,
          msg: ''
        }
      } else {
        return {
          isValid: false,
          msg: '不能包含 \\/:@&*=#"*?<>| 不能以 / 开头'
        }
      }
    },
    setUrl() {
      if (!this.checkTempUrlValid()) {
        return
      }
      if (this.tempUrl == '' || _.isNull(this.tempUrl)) {
        this.editingLessonDetail.url = null
        return
      }
      this.editingLessonDetail.url = this.linkPagePrefix + this.tempUrl
    },
    setCoursewareUrl() {
      if (!this.checkTempCoursewareUrlValid()) {
        return
      }
      let coursewareUrl = this.tempCoursewareUrl
      if (coursewareUrl == '' || _.isNull(coursewareUrl)) {
        this.editingLessonDetail.coursewareUrl = null
        return
      }
      this.editingLessonDetail.coursewareUrl =
        this.linkPagePrefix + coursewareUrl
    },
    subjectName(subject) {
      return colI18n.getLangValue(subject, 'subjectName')
    },
    getTemplateUrl(url) {
      let username = this.username
      let usernameLen = username.length
      let usernameIndex = url.indexOf(username)
      let templateUrlStartIndex =
        usernameIndex >= 0 ? usernameIndex + usernameLen + 1 : 0
      return url.substring(templateUrlStartIndex)
    }
  }
}
</script>
<style lang="scss">
.lesson-basic-info {
  background-color: #fff;
  padding: 26px 118px 26px 36px;
  font-size: 14px;
  color: #414141;
  &-label {
    font-weight: bold;
    margin: 0 12px 10px 0;
    display: inline-block;
    line-height: 24px;
  }
  &-sub {
    font-weight: normal;
    color: #409efe;
    margin-right: 3px;
  }
  &-link-url {
    display: flex;
    align-items: center;
    margin-bottom: 48px;
    &:first-child {
      margin-bottom: 24px;
    }
    &-label {
      margin-bottom: 0;
    }
    .el-input-group {
      margin-left: 10px;
      max-width: 480px;
    }
    .el-input-group__prepend {
      background-color: transparent;
      border-width: 0 0 1px;
      border-radius: 0;
      color: #409efe;
      border-color: initial;
      padding: 0;
    }
    .el-input__inner {
      border-width: 0 0 1px;
      border-color: #409efe;
      border-radius: 0;
    }
  }
  &-url-box {
    position: relative;
    &-error {
      position: absolute;
      left: 10px;
      bottom: -20px;
      font-size: 12px;
      color: #f75858;
    }
  }
  &-subject-packages {
    display: flex;
    margin-bottom: 46px;
  }
  &-subject {
    width: 380px;
    padding-right: 20px;
    box-sizing: border-box;
    border-right: 1px solid #f5f5f5;
    margin-right: 24px;
    .el-select {
      width: 270px;
    }
    .el-input__inner {
      font-size: 12px;
      color: #414141;
    }
  }
  &-packages {
    flex: 1;
    min-width: 0;
    &-list {
      .el-checkbox-group {
        max-height: 220px;
        overflow: auto;
      }
      .el-checkbox {
        width: 100%;
        padding-top: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 0;
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }
    }
    &-new-editor {
      display: flex;
      align-items: center;
      margin-top: 20px;
      .el-input {
        width: 160px;
        margin: 0 10px;
      }
      .el-input__inner {
        border-color: #17da98;
      }
      .el-icon-circle-close {
        font-size: 20px;
        margin-right: 3px;
        color: #ccc;
        cursor: pointer;
      }
      .el-checkbox {
        margin-right: 0;
      }
      .el-icon-circle-check {
        font-size: 20px;
        color: #17da98;
        cursor: pointer;
      }
    }
    &-new {
      margin-top: 8px;
      color: #17da98;
      cursor: pointer;
      .el-icon-circle-plus-outline {
        margin-right: 6px;
        font-size: 16px;
        vertical-align: middle;
      }
    }
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .lesson-basic-info {
    padding: 16px;
    &-subject-packages {
      flex-direction: column;
    }
    &-subject {
      max-width: 100%;
      padding: 0;
    }
    &-link-url {
      .el-input-group {
        margin: 0;
      }
      .el-input-group__prepend {
        font-size: 12px;
      }
    }
  }
}
</style>
