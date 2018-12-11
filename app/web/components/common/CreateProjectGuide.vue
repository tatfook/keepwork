<template>
<div class="create-project-guide">
  <el-dialog :visible.sync="showGuideDialog" width="30%" center :before-close="handleClose">
    <div class="create-project-guide-title">项目是什么？</div>
    <div class="create-project-guide-step" v-if="step == 1">
      <img src="@/assets/pblImg/step_1.png" alt="">
      <p class="tip_1">项目，是一个作品的开始。</p>
      <p>它将让你在学习中成长，</p>
      <p>让你体会到团结协作的快乐，让你成为优秀的管理者！</p>
    </div>
    <div class="create-project-guide-step" v-if="step == 2">
      <p>第一步：设置项目名称、项目类型</p>
      <img class="step-pic" src="@/assets/pblImg/step_2.png" alt="">
    </div>
    <div class="create-project-guide-step" v-if="step == 3">
      <p class="tip_1">第二步：创建项目相关的资源内容</p>
      <p class="tip_2">如果你选择的项目类型是<span class="emphasis">Paracraft</span>：请在<span class="emphasis">Paracraft创意空间</span>中完成创建；</p>
      <p class="tip_2">如果你选择的项目类型是<span class="emphasis">网站</span>。请在<span class="emphasis">网站编辑器</span>中完成创建</p>
    </div>
    <div class="create-project-guide-step" v-if="step == 4">
      <p class="tip_1">第三步：创建成功，编辑项目详情元素</p>
      <div class="detail-element">
        <span class="element">项目</span>
        <span class="element">资源网站</span>
        <span class="element">标签</span>
        <span class="element">成员</span>
        <span class="element">白板</span>
        <span class="element">评论</span>
      </div>
    </div>
    <div class="create-project-guide-next">
      <el-button @click="goPreviousStep" round v-if="step > 1">上一步</el-button>
      <el-button type="primary" @click="goNext" round>{{step === 4 ? '完成':'继续'}}</el-button>
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
export default {
  name: 'CreateProjectGuide',
  props:{
    showGuideDialog: Boolean
  },
  data(){
    return{
      step: 1,
    }
  },
  methods: {
    handleClose(){
      this.$emit('close')
    },
    goPreviousStep(){
      this.step--
    },
    goNext(){
      if(this.step == 4){
        this.handleClose()
        this.step = 1
      }else{
        this.step++
      }
    }
  }
}
</script>
<style lang="scss">
.create-project-guide{
  .el-dialog__header{
    padding: 0;
  }
  &-title{
    font-size: 18px;
    font-weight: 700;
    color: #303133;
  }
  &-step{
    text-align: center;
    font-size: 14px;
    padding: 50px 0;
    .step-pic{
      width: 100%;
      object-fit: contain;
      box-shadow: 0 0 8px #ccc;
    }
    .tip_1{
      color: #909399; 
    }
    .tip_2{
      color: #606266;
      .emphasis{
        color: #2397f3
      }
    }
    .detail-element{
      text-align: center;
      margin: 30px 0;
      .element{
        display: inline-block;
        height: 32px;
        line-height: 32px;
        color: #2397f3;
        padding: 0 24px;
        box-shadow: 3px 3px 8px #ddd9d9;
      }
    }
  }
  &-next{
    text-align: center;
  }
  &-progress{
    text-align: center;
    .progress-dot{
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #c0c4cc;
      margin: 0 15px;
    }
    .isCurrStep{
      background: #2397f3;
    }
  }
}
</style>


