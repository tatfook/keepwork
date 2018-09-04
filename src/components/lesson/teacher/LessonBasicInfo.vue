<template>
  <div class="lesson-basic-info">
    <div class="lesson-basic-info-row">
      <div class="lesson-basic-info-link-url">
        <label class="lesson-basic-info-label" for="linkUrlInput">链接页面是</label>
        <el-input id="linkUrlInput" placeholder="请输入内容" v-model="tempUrl" @blur='setUrl'>
          <template slot="prepend">{{linkPagePrefix}}</template>
        </el-input>
      </div>
      <div class="lesson-basic-info-subject-packages">
        <div class="lesson-basic-info-subject">
          <label class="lesson-basic-info-label" for="subjectSelector">{{$t('lesson.packageManage.Subject')}}</label>
          <el-select size="mini" v-model="editingLessonDetail.subjectId">
            <el-option v-for="item in lessonSubjects" :key="item.id" :label="item.subjectName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="lesson-basic-info-packages" v-loading='isPackageZoneLoading'>
          <label class="lesson-basic-info-label" for="priceInput">课程包</label>
          <div class="lesson-basic-info-packages-list">
            <el-checkbox-group v-model="belongToPackageIds">
              <el-checkbox v-for='(packageDetail, index) in userPackages' :key="index" :label="packageDetail.id">{{packageDetail.packageName}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="lesson-basic-info-packages-new-editor" v-show="isNewPackageEditorShow">
            <el-checkbox v-model="isNewPackageSelected"></el-checkbox>
            <el-input v-model="newPackageName" size="small"></el-input>
            <i class="el-icon-circle-close" :title="$t('common.Cancel')" @click="hideNewPackageEditor"></i>
            <i class="el-icon-circle-check-outline" :title="$t('common.Save')" @click="createNewPackage"></i>
          </div>
          <div class="lesson-basic-info-packages-new" @click="showNewPackageEditor">
            <i class="el-icon-circle-plus-outline"></i>新建课程包
          </div>
        </div>
      </div>
      <div class="lesson-basic-info-name">
        <label class="lesson-basic-info-label" for="priceInput">名称</label>
        <el-input v-model="editingLessonDetail.lessonName" :maxlength='255'></el-input>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LessonBasicInfo',
  props: {
    editingPackageDetail: Object,
    isEditing: Boolean
  },
  async mounted() {
    this.isPackageZoneLoading = true
    await this.lessonGetUserPackages({})
    this.isPackageZoneLoading = false
    await this.lessonGetAllSubjects({})
    if (this.isEditing) {
      let editingPackageDetail = this.editingPackageDetail
      let { minAge, maxAge } = editingPackageDetail
      if (minAge !== 0 || maxAge !== 0) {
      }
      this.editingLessonDetail = _.clone(editingPackageDetail)
    } else {
      this.editingLessonDetail.subjectId = this.lessonSubjects[0].id
    }
  },
  data() {
    return {
      newPackageName: '',
      belongToPackageIds: [],
      isNewPackageEditorShow: false,
      isPackageZoneLoading: false,
      isNewPackageSelected: true,
      tempUrl: '',
      editingLessonDetail: {
        url: '',
        subjectId: null,
        lessonName: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      lessonSubjects: 'lesson/subjects',
      userPackages: 'lesson/teacher/userPackages'
    }),
    username() {
      return _.get(this.userProfile, 'username')
    },
    linkPagePrefix() {
      return `${window.location.origin}/${this.username}/`
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
      this.isPackageZoneLoading = true
      await this.teacherCreateNewPackage({
        newPackageData: {
          packageName: this.newPackageName
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
    setUrl() {
      this.editingLessonDetail.url = this.linkPagePrefix + this.tempUrl
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
  &-link-url {
    display: flex;
    align-items: center;
    margin-bottom: 46px;
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
      .el-icon-circle-check-outline {
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
