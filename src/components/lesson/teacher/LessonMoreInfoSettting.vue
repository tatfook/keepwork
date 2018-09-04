<template>
  <div class="lesson-more-info-setting">
    <cover-media-setter ref="videoUrlComponent"></cover-media-setter>
    <div class="lesson-more-info-setting-intro">
      <div class="lesson-more-info-setting-label">简介</div>
      <el-input type="textarea" placeholder="简介" resize='none' v-model="moreInfoData.intro">
      </el-input>
    </div>
    <div class="lesson-more-info-setting-duration">
      <div class="lesson-more-info-setting-label">时长</div>
      <el-select v-model="moreInfoData.duration" placeholder="请选择">
        <el-option label="45min" value="45分钟">
        </el-option>
      </el-select>
    </div>
    <div class="lesson-more-info-setting-skills">
      <div class="lesson-more-info-setting-label">技能点</div>
      <el-button type='primary' @click="showAddSkillsDialog">添加</el-button>
    </div>
    <div class="lesson-more-info-setting-references">
      <div class="lesson-more-info-setting-label">素材</div>
      <el-button type='primary'>添加素材</el-button>
    </div>
    <el-dialog class="lesson-more-info-setting-skills-dialog" width='455px' :visible.sync="isSkillDialogShow" title="添加技能" :before-close="handleClose">
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
    this.skillList = _.clone(this.lessonSkills)
  },
  data() {
    return {
      isSkillDialogShow: false,
      skillList: [],
      newLessonSkills: [],
      moreInfoData: {
        duration: '45min',
        intro: '',
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
    videoUrl: {
      get() {
        return this.$refs.videoUrlComponent.newPackageCoverUrl
      },
      set(newVideoUrl) {
        this.moreInfoData.videoUrl = newVideoUrl
      }
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
      this.newLessonSkills = []
      _.forEach(this.selectedSkills, selectSkill => {
        this.newLessonSkills.push({
          id: selectSkill.id,
          skillName: selectSkill.skillName,
          score: 1
        })
      })
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
    margin-top: 20px;
  }
  &-duration,
  &-skills,
  &-references {
    margin-top: 35px;
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
