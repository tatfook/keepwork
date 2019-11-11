<template>
  <div class="lesson-more-info-setting">
    <div class="lesson-more-info-setting-videos">
      <cover-media-setter class="lesson-more-info-setting-videos-item" :isEditable='isEditable' v-if="!isGetData" :title='teacherVideoTitle' :editingCoverUrl='editingTeacherVideoUrl' :subTitle='coverSetterSubTitle' :isEditing='isEditing' :isImageTabShow='false' :isVideoTabShow='true' @urlChange='setTeacherVideoUrl'></cover-media-setter>
      <cover-media-setter class="lesson-more-info-setting-videos-item" :isEditable='isEditable' v-if="!isGetData" :title='studentVideoTitle' :editingCoverUrl='editingStudentVideoUrl' :subTitle='coverSetterSubTitle' :isEditing='isEditing' :isImageTabShow='false' :isVideoTabShow='true' @urlChange='setStudentVideoUrl'></cover-media-setter>
    </div>
    <div class="lesson-more-info-setting-intro">
      <div class="lesson-more-info-setting-label">{{$t('lesson.intro')}}</div>
      <el-input :disabled="!isEditable" type="textarea" :placeholder="$t('lesson.intro')" resize='none' v-model="moreInfoData.goals">
      </el-input>
    </div>
    <div class="lesson-more-info-setting-duration">
      <div class="lesson-more-info-setting-label">{{$t('lesson.duration')}}</div>
      <el-select v-model="moreInfoData.duration" :disabled="!isEditable">
        <el-option :label="this.$t('lesson.45min')" value="45min">
        </el-option>
        <el-option :label="this.$t('lesson.90min')" value="90min">
        </el-option>
        <el-option :label="this.$t('lesson.1day')" value="1day">
        </el-option>
        <el-option :label="this.$t('lesson.1week')" value="1week">
        </el-option>
      </el-select>
    </div>
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
      let { goals, teacherVideoUrl, studentVideoUrl, duration, skills } = editingLessonDetailProp
      let formatedSkills = this.formatSkill(skills)
      this.editingTeacherVideoUrl = teacherVideoUrl
      this.editingStudentVideoUrl = studentVideoUrl
      this.moreInfoData = {
        goals,
        teacherVideoUrl,
        studentVideoUrl,
        skills: formatedSkills,
        duration: duration || '90min'
      }
    }
    this.isMounted = true
  },
  data() {
    return {
      skillList: [],
      isMounted: false,
      teacherVideoTitle: '教师视频',
      studentVideoTitle: '学生视频',
      coverSetterSubTitle: this.$t('lesson.lessonManage.optionalLabel'),
      editingTeacherVideoUrl: undefined,
      editingStudentVideoUrl: undefined,
      isGetData: true,
      moreInfoData: {
        duration: '90min',
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
    setTeacherVideoUrl(newVideoUrl) {
      this.moreInfoData.teacherVideoUrl = newVideoUrl
    },
    setStudentVideoUrl(newVideoUrl) {
      this.moreInfoData.studentVideoUrl = newVideoUrl
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
  &-videos {
    display: flex;
    &-item {
      flex: 1;
      min-width: 0;
      padding-left: 40px;
      &:first-child {
        border-right: 1px solid #e8e8e8;
        padding-right: 40px;
        padding-left: 0;
      }
    }
  }
}
</style>
