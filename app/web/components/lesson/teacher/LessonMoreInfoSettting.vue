<template>
  <div class="lesson-more-info-setting">
    <cover-media-setter :isEditable='isEditable' v-if="!isGetData" ref="videoUrlComponent" :title='coverSetterTitle' :editingCoverUrl='editingCoverUrl' :subTitle='coverSetterSubTitle' :isEditing='isEditing' :isImageTabShow='false' :isVideoTabShow='true' @urlChange='setVideoUrl'></cover-media-setter>
    <div class="lesson-more-info-setting-intro">
      <div class="lesson-more-info-setting-label">{{$t('lesson.intro')}}</div>
      <el-input :disabled="!isEditable" type="textarea" :placeholder="$t('lesson.intro')" resize='none' v-model="moreInfoData.goals">
      </el-input>
    </div>
    <div class="lesson-more-info-setting-duration">
      <div class="lesson-more-info-setting-label">{{$t('lesson.duration')}}</div>
      <el-select v-model="moreInfoData.duration" :disabled="!isEditable">
        <el-option label="45min" value="45min">
        </el-option>
      </el-select>
    </div>
    <div class="lesson-more-info-setting-skills">
      <div class="lesson-more-info-setting-label">{{$t('lesson.skillPoints')}}</div>
      <el-button type='primary' @click="showAddSkillsDialog" :disabled="!isEditable">{{$t('common.add')}}</el-button>
      <div class="lesson-more-info-setting-skills-list">
        <div class="lesson-more-info-setting-skills-item" v-for="(skill, index) in moreInfoData.skills" :key="index">
          <span class="lesson-more-info-setting-skills-item-label">{{skillName(skill)}}</span>
          <el-input-number :disabled="!isEditable" size="mini" v-model="skill.score" :controls='false' :min='1'></el-input-number>
          <i class="el-icon-delete" @click="removeSkill(index)" v-if="isEditable"></i>
        </div>
      </div>
    </div>
    <div class="lesson-more-info-setting-references">
      <div class="lesson-more-info-setting-label">
        <span class="lesson-more-info-setting-references-label">{{$t('lesson.lessonManage.optionalLabel')}}</span>
        {{$t('lesson.references')}}
      </div>
      <el-button type='primary' @click="addReferences" :disabled="!isEditable">{{$t('lesson.lessonManage.addReference')}}</el-button>
    </div>
    <el-dialog class="lesson-more-info-setting-skills-dialog" width='455px' :append-to-body="true" :modal-append-to-body="true" :visible.sync="isSkillDialogShow" :title="$t('lesson.lessonManage.addSkillPoint')" :before-close="handleClose">
      <div class="lesson-more-info-setting-skills-dialog-list">
        <div class="lesson-more-info-setting-skills-dialog-item" v-for="(skill, index) in skillList" :key="index">
          <span>{{skillName(skill)}}</span>
          <el-checkbox v-model="skill.isSelect"></el-checkbox>
        </div>
      </div>
      <div class="lesson-more-info-setting-skills-dialog-operations">
        <el-button type="info" @click="handleClose">{{$t('common.Cancel')}}</el-button>
        <el-button type="primary" @click="toAdd">{{$t('common.add')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CoverMediaSetter from './CoverMediaSetter'
import { mapActions, mapGetters } from 'vuex'
import colI18n from '@/lib/utils/i18n/column'

export default {
  name: 'LessonMoreInfoSettting',
  props: {
    editingLessonDetailProp: Object,
    isEditable: {
      type: Boolean,
      default: true
    },
    isEditing: Boolean
  },
  async mounted() {
    this.isGetData = true
    await this.getAllSkills({})
    this.isGetData = false
    this.skillList = _.cloneDeep(this.lessonSkills)
    if (this.isEditing) {
      let editingLessonDetailProp = this.editingLessonDetailProp
      let { goals, extra, skills } = editingLessonDetailProp
      let { videoUrl } = extra
      let formatedSkills = this.formatSkill(skills)
      this.editingCoverUrl = videoUrl
      this.moreInfoData = {
        goals,
        videoUrl,
        skills: formatedSkills,
        duration: '45min'
      }
    }
    this.isMounted = true
  },
  data() {
    return {
      isSkillDialogShow: false,
      skillList: [],
      isMounted: false,
      coverSetterTitle: this.$t('lesson.lessonManage.videoLabel'),
      coverSetterSubTitle: this.$t('lesson.lessonManage.optionalLabel'),
      editingCoverUrl: undefined,
      isGetData: true,
      moreInfoData: {
        duration: '45min',
        goals: '',
        videoUrl: '',
        skills: []
      }
    }
  },
  computed: {
    ...mapGetters({
      lessonSkills: 'lesson/skills'
    }),
    selectedSkills() {
      return _.filter(this.skillList, { isSelect: true })
    }
  },
  methods: {
    ...mapActions({
      getAllSkills: 'lesson/getAllSkills'
    }),
    setVideoUrl(newVideoUrl) {
      this.moreInfoData.videoUrl = newVideoUrl
    },
    formatSkill(originSkills) {
      let skills = []
      _.forEach(originSkills, skill => {
        let indexInSkillList = _.findIndex(this.skillList, {
          id: skill.skillId
        })
        this.$set(this.skillList[indexInSkillList], 'isSelect', true)
        let skillDetail = this.skillList[indexInSkillList]
        skills.push({
          id: skill.skillId,
          skillName: this.skillName(skillDetail),
          score: skill.score
        })
      })
      return skills
    },
    showAddSkillsDialog() {
      this.isSkillDialogShow = true
    },
    handleClose() {
      this.isSkillDialogShow = false
    },
    toAdd() {
      let oldSelectSkills = this.moreInfoData.skills
      this.moreInfoData.skills = []
      _.forEach(this.selectedSkills, selectSkill => {
        let oldSkillObj = _.find(oldSelectSkills, { id: selectSkill.id })
        this.moreInfoData.skills.push(
          oldSkillObj || {
            id: selectSkill.id,
            skillName: this.skillName(selectSkill),
            score: 1
          }
        )
      })
      this.handleClose()
    },
    removeSkill(index) {
      let removintSkill = this.moreInfoData.skills[index]
      this.moreInfoData.skills.splice(index, 1)
      let skillListIndex = _.findIndex(this.skillList, { id: removintSkill.id })
      skillListIndex >= 0 && (this.skillList[skillListIndex].isSelect = false)
    },
    addReferences() {
      this.$message('添加素材功能尚未开发')
    },
    skillName(skill) {
      return colI18n.getLangValue(skill, 'skillName')
    }
  },
  components: {
    CoverMediaSetter
  }
}
</script>
<style lang="scss">
.lesson-more-info-setting {
  &-label {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    margin-bottom: 10px;
    display: inline-block;
    line-height: 24px;
  }
  &-intro {
    margin: 20px 0;
    .el-textarea__inner {
      height: 150px;
      max-width: 655px;
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
    }
  }
  &-skills,
  &-references {
    margin-top: 35px;
    &-label {
      color: #409efe;
      font-weight: normal;
    }
  }
  &-skills {
    &-list {
      margin-top: 25px;
    }
    &-item {
      margin-bottom: 15px;
      font-size: 14px;
      color: #333;
      &-label {
        margin-right: 5px;
      }
      .el-input-number {
        width: 190px;
        .el-input__inner {
          text-align: left;
        }
      }
      .el-icon-delete {
        font-size: 20px;
        color: #b3b3b3;
        vertical-align: middle;
        margin-left: 8px;
        cursor: pointer;
      }
    }
  }
  &-skills-dialog {
    .el-dialog__header {
      background-color: #409efe;
      padding: 10px 30px 6px;
    }
    .el-dialog__title {
      color: #fff;
      font-size: 14px;
    }
    .el-dialog__headerbtn {
      top: 13px;
      right: 13px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
    .el-dialog__body {
      padding: 44px 5px 42px;
    }
    &-list {
      max-height: 295px;
      overflow: auto;
      margin-bottom: 75px;
      padding-left: 30px;
    }
    &-item {
      display: flex;
      align-items: center;
      padding: 0 36px 30px 0;
      span {
        flex: 1;
      }
      .el-checkbox__inner {
        width: 28px;
        height: 28px;
        border-radius: 50%;
      }
      .el-checkbox__inner::after {
        width: 7px;
        height: 13px;
        left: 9px;
        top: 4px;
        border-width: 2px;
      }
    }
    &-operations {
      text-align: center;
      .el-button {
        width: 170px;
        height: 42px;
        padding: 0;
        font-size: 17px;
      }
      .el-button + .el-button {
        margin-left: 28px;
      }
      .el-button--info {
        background-color: #d2d2d2;
        border-color: #d2d2d2;
      }
    }
  }
}
</style>
