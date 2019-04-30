<template>
  <div class="create-project-guide">
    <el-dialog :visible="showGuideDialog" width="30%" center :before-close="handleClose">
      <div class="create-project-guide-title">{{$t("project.whatAreProjects")}}</div>
      <div class="create-project-guide-step" v-if="step == 1">
        <img src="@/assets/pblImg/step_1.png" alt="">
        <p class="tip_1">{{$t("project.projectsAreWorksStart")}}</p>
        <p>{{$t("project.youCanLearnKnowledge")}}</p>
        <p>{{$t("project.youCanLearnTeamworkAndLeaderShip")}}</p>
      </div>
      <div class="create-project-guide-step" v-if="step == 2">
        <p>{{$t("project.firstStepContent")}}</p>
        <img v-if="!isEn" class="step-pic" src="@/assets/pblImg/step_2.png" alt="">
        <img v-if="isEn" class="step-pic" src="@/assets/pblImg/step_2_en.png" alt="">
      </div>
      <div class="create-project-guide-step" v-if="step == 3">
        <p class="tip_1">{{$t("project.secontStepContent")}}</p>
        <p class="tip_2" v-html="paracraftTypeWarning"></p>
        <p class="tip_2" v-html="webTypeWarning"></p>
      </div>
      <div class="create-project-guide-step" v-if="step == 4">
        <p class="tip_1">{{$t("project.thirdStepContent")}}</p>
        <div class="detail-element">
          <span class="element">{{$t("project.ProjectLabel")}}</span>
          <span class="element">{{$t("project.ResourceSiteLabel")}}</span>
          <span class="element">{{$t("project.TagsLabel")}}</span>
          <span class="element">{{$t("project.MembersLabel")}}</span>
          <span class="element">{{$t("project.WhiteBoardLabel")}}</span>
          <span class="element">{{$t("project.CommentsLabel")}}</span>
        </div>
      </div>
      <div class="create-project-guide-next">
        <el-button @click="goPreviousStep" round v-if="step > 1">{{$t("project.Prev")}}</el-button>
        <el-button type="primary" @click="goNext" round>{{step === 4 ? $t('project.Finish'):$t('project.Next')}}</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="create-project-guide-progress">
          <span :class="['progress-dot',{'isCurrStep': step == 1}]"></span>
          <span :class="['progress-dot',{'isCurrStep': step == 2}]"></span>
          <span :class="['progress-dot',{'isCurrStep': step == 3}]"></span>
          <span :class="['progress-dot',{'isCurrStep': step == 4}]"></span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { locale } from '@/lib/utils/i18n'
export default {
  name: 'CreateProjectGuide',
  props: {
    showGuideDialog: Boolean
  },
  data() {
    return {
      step: 1,
      paracraftTypeWarning: this.$t('project.projectTypeWarning', {
        projectTypeZhHtml: '<span class="emphasis">Paracraft</span>',
        projectTypeEnHtml:
          '<span class="emphasis">3D games and animations</span>',
        projectAppZhHmlt: '<span class="emphasis">Paracraft创意空间</span>',
        projectAppEnHtml: '<span class="emphasis">Paracraft</span>'
      }),
      webTypeWarning: this.$t('project.projectTypeWarning', {
        projectTypeZhHtml: '<span class="emphasis">网站</span>',
        projectTypeEnHtml: '<span class="emphasis">websites</span>',
        projectAppZhHmlt: '<span class="emphasis">网站编辑器</span>',
        projectAppEnHtml: '<span class="emphasis">Website Editor</span>'
      })
    }
  },
  computed: {
    isEn() {
      return locale === 'en-US'
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    goPreviousStep() {
      this.step--
    },
    goNext() {
      if (this.step == 4) {
        this.handleClose()
        this.step = 1
      } else {
        this.step++
      }
    }
  }
}
</script>
<style lang="scss">
.create-project-guide {
  .el-dialog__header {
    padding: 0;
  }
  &-title {
    font-size: 18px;
    font-weight: 700;
    color: #303133;
  }
  &-step {
    text-align: center;
    font-size: 14px;
    padding: 50px 0;
    .step-pic {
      width: 100%;
      object-fit: contain;
      box-shadow: 0 0 8px #ccc;
    }
    .tip_1 {
      color: #909399;
    }
    .tip_2 {
      color: #606266;
      .emphasis {
        color: #2397f3;
      }
    }
    .detail-element {
      text-align: center;
      margin: 30px 0;
      .element {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        color: #2397f3;
        padding: 0 24px;
        box-shadow: 3px 3px 8px #ddd9d9;
      }
    }
  }
  &-next {
    text-align: center;
  }
  &-progress {
    text-align: center;
    .progress-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #c0c4cc;
      margin: 0 15px;
    }
    .isCurrStep {
      background: #2397f3;
    }
  }
}
</style>


