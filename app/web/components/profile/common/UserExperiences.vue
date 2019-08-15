<template>
  <div class="user-experience">
    <el-card class="user-experience-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>{{$t("profile.experience")}}</span>
        <el-button v-if="isLoginUserEditable" v-show="!isExperienceEmpty" class="user-experience-card-header-button" type="text" @click="showAddingDialog">{{$t("profile.add")}}</el-button>
      </div>
      <div class="user-experience-list" v-if="!isExperienceEmpty" v-loading="isLoading">
        <div class="user-experience-item" v-for="(experience, index) in userExperiences" :key="index">
          <div class="user-experience-item-title" :title="experience.title">
            {{experience.title}}
            <div class="user-experience-item-date">
              <span v-if="experience.startDate && experience.endDate">{{experience.startDate | formatDate}} - {{experience.endDate | formatDate}}</span>
            </div>
            <div class="user-experience-item-operations" v-if="isLoginUserEditable">
              <el-button type="text" @click="deleteExperience(experience, index)">
                <i class="iconfont icon-delete1"></i>{{$t("profile.delete")}}
              </el-button>
              <el-button type="text" @click="editExperience(experience, index)">
                <i class="iconfont icon-edit-square"></i>{{$t("profile.edit")}}
              </el-button>
            </div>
          </div>
          <a class="user-experience-item-link" :href="experience.link" target="_blank" :title="experience.link">{{experience.link}}</a>
          <div class="user-experience-item-desc">
            <div class="user-experience-item-desc-label">{{$t('profile.experienceDescription')}}</div>
            <div class="user-experience-item-desc-detail">{{experience.description}}</div>
          </div>
        </div>
      </div>
      <div class="user-experience-empty" v-if="isExperienceEmpty">
        <img src="@/assets/img/default_experience.png" alt="">
        <p><span v-if="isLoginUserEditable" class="user-experience-empty-anchor" @click="showAddingDialog">{{$t("profile.add")}}</span>{{isLoginUserEditable ? $t("profile.addExperienceInfo") : $t("profile.noContentForExperience")}}</p>
      </div>
    </el-card>
    <el-dialog v-if="isLoginUserEditable" :title="$t('profile.addExperience')" :visible.sync="isAddingDialogVisible" class="user-experience-adding-dialog" :before-close="handleAddingDialogClose" v-loading="isLoading">
      <el-form label-position="top" :model="newExperience">
        <el-form-item :label="$t('profile.name')">
          <el-input v-model="newExperience.title"></el-input>
        </el-form-item>
        <el-form-item :label="$t('profile.period')">
          <el-date-picker unlink-panels v-model="newExperienceRangeDate" type="daterange" :range-separator="$t('profile.startToEnd')" :start-placeholder="$t('profile.startDate')" :end-placeholder="$t('profile.endDate')" @change='setExperienceDate'>
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('profile.url')">
          <el-input v-model="newExperience.link"></el-input>
        </el-form-item>
        <el-form-item :label="$t('profile.experienceDescription')">
          <el-input type="textarea" resize="none" v-model="newExperience.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddingDialogClose">{{$t("common.Cancel")}}</el-button>
        <el-button type="primary" @click="handleAddExperience">{{$t("common.Sure")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'UserExperiences',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    },
    isLoginUserEditable: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.userExperiences = _.cloneDeep(
      _.get(this.nowUserDetail, 'extra.experiences', [])
    )
  },
  data() {
    return {
      isLoading: false,
      editingIndex: undefined,
      isAddingDialogVisible: false,
      newExperienceRangeDate: undefined,
      newExperience: {
        title: '',
        link: '',
        startDate: '',
        endDate: '',
        description: ''
      },
      userExperiences: [],
      updatingExperiences: []
    }
  },
  computed: {
    ...mapGetters({
      isRealNamed: 'user/isRealNamed'
    }),
    isEditMode() {
      return !_.isUndefined(this.editingIndex)
    },
    isExperienceEmpty() {
      return Boolean(
        this.userExperiences && this.userExperiences.length == 0
      )
    },
    originExtra() {
      return _.cloneDeep(_.get(this.nowUserDetail, 'extra'))
    },
    updatingExtra() {
      return _.mergeWith(this.originExtra, {
        experiences: this.updatingExperiences
      }, (objValue, srcValue) => {
        return srcValue
      })
    },
    updatingUserInfo() {
      return _.mergeWith(
        this.nowUserDetail,
        {
          extra: this.updatingExtra
        }, (objValue, srcValue) => {
          return srcValue
        }
      )
    }
  },
  methods: {
    ...mapActions({
      toggleRealName: 'user/toggleRealName',
      userUpdateUserInfo: 'user/updateUserInfo'
    }),
    showAddingDialog() {
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      this.isAddingDialogVisible = true
      this.updatingExperiences = _.cloneDeep(this.userExperiences)
    },
    handleAddingDialogClose() {
      this.isAddingDialogVisible = false
      this.editingIndex = undefined
      this.newExperience = {}
      this.newExperienceRangeDate = []
    },
    async handleAddExperience() {
      if (this.isEditMode) {
        this.updatingExperiences[this.editingIndex] = this.newExperience
      } else {
        this.updatingExperiences.push(this.newExperience)
      }
      await this.updateData()
    },
    async updateData() {
      this.isLoading = true
      await this.userUpdateUserInfo(this.updatingUserInfo).catch()
      this.isLoading = false
      this.handleAddingDialogClose()
    },
    editExperience(experience, index) {
      this.newExperience = _.cloneDeep(experience)
      this.newExperienceRangeDate = [this.newExperience.startDate, this.newExperience.endDate]
      this.editingIndex = index
      this.showAddingDialog()
    },
    async deleteExperience(experience, index) {
      let updatingExperience = _.cloneDeep(this.userExperiences)
      updatingExperience.splice(index, 1)
      this.updatingExperiences = updatingExperience
      await this.updateData()
    },
    setExperienceDate(newDateRange) {
      this.newExperience.startDate = newDateRange[0]
      this.newExperience.endDate = newDateRange[1]
    }
  },
  watch: {
    nowUserDetail() {
      this.userExperiences = _.cloneDeep(
        _.get(this.nowUserDetail, 'extra.experiences', [])
      )
    }
  },
  filters: {
    formatDate(date) {
      return moment(date).format('YYYY/MM/DD')
    }
  }
}
</script>
<style lang="scss">
.user-experience {
  &-card {
    .el-card__header {
      font-weight: bold;
      padding: 18px 16px;
    }
    .el-card__body {
      padding: 0 16px 12px;
    }
    &-header {
      &-button {
        float: right;
        padding: 3px 0;
        font-size: 12px;
        color: #909399;
      }
      &-button + &-button {
        margin-right: 6px;
      }
    }
  }
  &-list {
    font-size: 14px;
    color: #555;
  }
  &-item {
    padding: 24px 0;
    border-bottom: 1px dashed #e8e8e8;
    &:last-child {
      border-bottom: none;
    }
    &-title {
      font-size: 16px;
      color: #303133;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 160px;
    }
    &-date,
    &-operations {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 12px;
      color: #909399;
    }
    &-operations {
      display: none;
      background-color: #fff;
      padding-left: 36px;
      .iconfont {
        vertical-align: middle;
        margin-right: 6px;
      }
    }
    &:hover &-operations {
      display: inline-block;
    }
    .el-button {
      padding: 0;
      font-size: 12px;
      color: #909399;
    }
    .el-button:hover {
      color: #2397f3;
    }
    &-link {
      color: #909399;
      margin: 8px 0 24px;
      text-decoration: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      width: 100%;
      &:hover {
        color: #2397f3;
      }
    }
    &-desc {
      padding-left: 20px;
      position: relative;
      &::before {
        content: "";
        display: inline-block;
        width: 2px;
        background-color: #cceaf9;
        position: absolute;
        left: 3px;
        top: 8px;
        bottom: 0;
      }
      &-label {
        font-size: #303133;
        &::before {
          content: "";
          display: inline-block;
          width: 4px;
          height: 4px;
          border: 2px solid #2397f3;
          background-color: #fff;
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: 6px;
        }
      }
      &-detail {
        color: #909399;
        margin-top: 16px;
        width: 553px;
        max-width: 100%;
        word-break: break-all;
      }
    }
  }
  &-empty {
    color: #909399;
    font-size: 14px;
    text-align: center;
    padding: 44px 0 16px;
    &-anchor {
      color: #2397f3;
      cursor: pointer;
      margin-right: 4px;
    }
  }
  &-adding-dialog {
    .el-dialog {
      width: 416px;
      max-width: 100%;
    }
    .el-dialog__header {
      border-bottom: 1px solid #e8e8e8;
      padding: 16px;
    }
    .el-dialog__title {
      font-size: 16px;
      font-weight: bold;
    }
    .el-dialog__body {
      padding: 24px 16px 0;
    }
    .el-form--label-top .el-form-item__label {
      line-height: 1;
    }
    .el-form-item {
      margin-bottom: 24px;
    }
    .el-date-editor--daterange.el-input__inner {
      width: 100%;
    }
    .el-textarea__inner {
      height: 96px;
    }
    .el-button {
      width: 88px;
      height: 36px;
      line-height: 36px;
      padding: 0 16px;
    }
  }
}
</style>
<style lang="scss">
@media only screen and (max-width: 991px) {
  .user-experience {
    &-card {
      border-radius: 0;
      border-width: 1px 0;
      .el-card__header {
        padding: 9px 16px;
      }
    }
    &-item {
      padding: 16px 0;
      &-link {
        margin: 4px 0 12px;
      }
    }
    &-adding-dialog {
      padding: 0 16px;
    }
  }
}
</style>
