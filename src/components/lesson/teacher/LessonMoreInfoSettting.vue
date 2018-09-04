<template>
  <div class="lesson-more-info-setting">
    <cover-media-setter ref="videoUrlComponent" :title='coverSetterTitle' :subTitle='coverSetterSubTitle'></cover-media-setter>
    <div class="lesson-more-info-setting-intro">
      <div class="lesson-more-info-setting-label">{{$t('lesson.intro')}}</div>
      <el-input type="textarea" :placeholder="$t('lesson.intro')" resize='none' v-model="moreInfoData.goals">
      </el-input>
    </div>
    <div class="lesson-more-info-setting-duration">
      <div class="lesson-more-info-setting-label">{{$t('lesson.duration')}}</div>
      <el-select v-model="moreInfoData.duration">
        <el-option label="45min" value="45min">
        </el-option>
      </el-select>
    </div>
    <div class="lesson-more-info-setting-skills">
      <div class="lesson-more-info-setting-label">{{$t('lesson.skillsPoints')}}</div>
      <el-button type='primary' @click="showAddSkillsDialog">{{$t('common.add')}}</el-button>
      <div class="lesson-more-info-setting-skills-list">
        <div class="lesson-more-info-setting-skills-item" v-for="(skill, index) in moreInfoData.skills" :key="index">
          <span class="lesson-more-info-setting-skills-item-label">{{skill.skillName}}</span>
          <el-input-number size="mini" v-model="skill.score" :controls='false' :min='1'></el-input-number>
          <i class="el-icon-delete" @click="removeSkill(index)"></i>
        </div>
      </div>
    </div>
    <div class="lesson-more-info-setting-references">
      <div class="lesson-more-info-setting-label">
        <span class="lesson-more-info-setting-references-label">{{$t('lesson.lessonManage.optionalLabel')}}</span>
        {{$t('lesson.references')}}
      </div>
      <el-button type='primary' @click="addReferences">{{$t('lesson.lessonManage.addReference')}}</el-button>
    </div>
    <el-dialog class="lesson-more-info-setting-skills-dialog" width='455px' :visible.sync="isSkillDialogShow" :title="$t('lesson.lessonManage.addSkillPoint')" :before-close="handleClose">
      <div class="lesson-more-info-setting-skills-dialog-list">
        <div class="lesson-more-info-setting-skills-dialog-item" v-for="(skill, index) in skillList" :key="index">
          <span>{{skill.skillName}}</span>
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
export default {
  name: 'LessonMoreInfoSettting',
  async mounted() {
    await this.getAllSkills({})
    this.skillList = _.cloneDeep(this.lessonSkills)
    this.isMounted = true
  },
  data() {
    return {
      isSkillDialogShow: false,
      skillList: [],
      isMounted: false,
      coverSetterTitle: this.$t('lesson.lessonManage.videoLabel'),
      coverSetterSubTitle: this.$t('lesson.lessonManage.optionalLabel'),
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
    },
    videoUrl() {
      if (!this.isMounted) {
        return ''
      }
      let newVideoUrl = this.$refs.videoUrlComponent.newPackageCoverUrl
      this.moreInfoData.videoUrl = newVideoUrl
      return newVideoUrl
    }
  },
  methods: {
    ...mapActions({
      getAllSkills: 'lesson/getAllSkills'
    }),
    showAddSkillsDialog() {
      this.isSkillDialogShow = true
    },
    handleClose() {
      this.isSkillDialogShow = false
    },
    toAdd() {
      this.moreInfoData.skills = []
      _.forEach(this.selectedSkills, selectSkill => {
        this.moreInfoData.skills.push({
          id: selectSkill.id,
          skillName: selectSkill.skillName,
          score: 1
        })
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
