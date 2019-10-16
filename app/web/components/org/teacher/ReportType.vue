<template>
  <div class="report-type">
    <div class="type-title">
      报告类型:
    </div>
    <div class="type-tips">
      请选择
    </div>
    <div class="type-choice">
      <div v-for="item in choiceList" :key="item.id" class="type-choice-item">
        <div @click="hanldeSelectType(item.id)" :class="['type-choice-item-main', { 'checked': item.id === selectedType }]">
          <img :src="item.logo" :alt="item.title">
          <div class="type-choice-item-main-title">
            {{item.title}}
          </div>
          <div class="type-choice-item-main-tips">
            {{item.tips}}
          </div>
          <i v-show="item.id === selectedType" class="el-icon-success type-choice-item-main-checked-icon"></i>
        </div>
        <div class="type-choice-item-preview">
          <span @click="handleShowPreview(item.preview)">预览</span>
        </div>
      </div>
    </div>
    <el-dialog top="2vh" custom-class="report-type-preview" :visible.sync="isShowPreview">
      <img class="report-type-preview-image" :src="previewUrl" alt="预览图">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ReportType',
  model: {
    prop: 'selectedType',
    event: 'change'
  },
  props: {
    selectedType: Number
  },
  data() {
    return {
      smallEvaluationLogo: require('@/assets/org/teacher/small_evaluation.png'),
      stageSummaryLogo: require('@/assets/org/teacher/stage_summary.png'),
      smallEvaluationPreview: require('@/assets/org/teacher/small_evaluation_preview.png'),
      stageSummaryPreview: require('@/assets/org/teacher/stage_summary_preview.png'),
      isShowPreview: false,
      previewUrl: ''
    }
  },
  methods: {
    hanldeSelectType(id) {
      this.$emit('change', id)
    },
    handleShowPreview(url) {
      this.previewUrl = url
      this.isShowPreview = true
    }
  },
  computed: {
    choiceList() {
      return [
        {
          id: 1,
          logo: this.smallEvaluationLogo,
          title: '小评',
          tips: '报告中，仅包含本次的点评内容',
          preview: this.smallEvaluationPreview
        },
        {
          id: 2,
          logo: this.stageSummaryLogo,
          title: '阶段总结',
          tips:
            '报告中，除了本次的点评内容外，还将附上对学生历次点评的统计分析（由系统自动生成）',
          preview: this.stageSummaryPreview
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.report-type {
  padding: 34px 24px 86px;
  background: #fff;
  font-size: 14px;
  .type-title {
    margin-bottom: 16px;
  }
  .type-tips {
    color: #999;
    margin-bottom: 20px;
  }

  .type-choice {
    display: flex;
    &-item {
      margin-right: 38px;
      &-main {
        width: 223px;
        height: 273px;
        padding: 29px 22px 0;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        text-align: center;
        border-radius: 8px;
        border: solid 2px #e8e8e8;
        cursor: pointer;
        &.checked {
          border: solid 2px #409efe;
        }
        &-checked-icon {
          position: absolute;
          top: 0;
          right: 0;
          color: #409efe;
          font-size: 44px;
          margin-right: -8px;
          margin-top: -8px;
        }
        &-title {
          font-size: 14px;
          color: #333;
          margin-top: 20px;
          font-weight: bold;
          line-height: 20px;
        }
        &-tips {
          margin-top: 14px;
          font-size: 12px;
          color: #666;
          line-height: 20px;
        }
      }
      &-preview {
        margin-top: 22px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        color: #2397f3;
      }
    }
  }

  /deep/ &-preview {
    max-width: 630px;
    .el-dialog__header {
      position: relative;
      padding: 0;
      .el-dialog__headerbtn {
        position: absolute;
        margin-bottom: -20px;
      }
    }
    .el-dialog__body {
      padding: 0;
    }
    &-image {
      width: 100%;
    }
  }
}
</style>