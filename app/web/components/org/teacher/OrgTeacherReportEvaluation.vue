<template>
  <div class="teacher-evaluation-report">
    <div class="teacher-evaluation-report-header">
      <span>发起点评</span>
      <span>
        <el-button size="mini" @click="handleBack">取消</el-button>
        <el-button size="mini" @click="hanldeToComment" type="primary">去点评</el-button>
      </span>
    </div>
    <div class="teacher-evaluation-report-title">
      <div class="report-name">
        报告名称：
      </div>
      <el-form class="report-name-form" ref="form" :model="form" :rules="rules">
        <el-form-item class="report-name-form-item" prop="reportName">
          <el-input class="report-name-input" placeholder="请输入" v-model="form.reportName"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="teacher-evaluation-report-type">
      <div class="type-title">
        报告类型:
      </div>
      <div class="type-tips">
        请选择
      </div>
      <div class="type-choice">
        <div v-for="item in choiceList" :key="item.id" class="type-choice-item">
          <div @click="hanldeSelectType(item.id)" :class="['type-choice-item-main', { 'checked': item.id === selecedId }]">
            <img :src="item.logo" :alt="item.title">
            <div class="type-choice-item-main-title">
              {{item.title}}
            </div>
            <div class="type-choice-item-main-tips">
              {{item.tips}}
            </div>
            <i v-show="item.id === selecedId" class="el-icon-success type-choice-item-main-checked-icon"></i>
          </div>
          <div class="type-choice-item-preview">
            <span>预览</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrgTeacherReportEvaluation',
  data() {
    return {
      smallEvaluationLogo: require('@/assets/org/teacher/small_evaluation.png'),
      stageSummaryLogo: require('@/assets/org/teacher/stage_summary.png'),
      selecedId: 0,
      form: {
        reportName: ''
      },
      rules: {
        reportName: [
          { required: true, message: '请输入报告名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    choiceList() {
      return [
        {
          id: 0,
          logo: this.smallEvaluationLogo,
          title: '小评',
          tips: '报告中，仅包含本次的点评内容'
        },
        {
          id: 1,
          logo: this.stageSummaryLogo,
          title: '阶段总结',
          tips:
            '报告中，除了本次的点评内容外，还将附上对学生历次点评的统计分析（由系统自动生成）'
        }
      ]
    }
  },
  methods: {
    handleBack() {
      this.$router.back(-1)
    },
    hanldeSelectType(id) {
      this.selecedId = id
    },
    hanldeToComment() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$router.push({
            name: 'OrgTeacherReportComment',
            query: this.$route.query
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.teacher-evaluation-report {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    height: 57px;
    padding: 0 24px;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }
  &-title {
    background: #fff;
    padding: 29px 24px 0;
    .report-name {
      color: #303133;
      font-size: 14px;
    }
    .report-name-form {
      margin-top: 13px;
      &-item {
        margin-bottom: 0;
      }
    }
  }

  &-type {
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
  }
}
</style>