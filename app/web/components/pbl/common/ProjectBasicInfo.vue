<template>
  <div class="project-basic-info">
    <div class="project-basic-info-header">
      <p class="project-basic-info-name">一个新的项目
        <span class="project-basic-info-state">招募中</span>
      </p>
      <p class="project-basic-info-more">
        <span class="project-basic-info-more-created">由
          <span class="project-basic-info-more-username">evanna-yl</span>
          创建
        </span>
        <span class="project-basic-info-more-viewcount">
          <i class="icon-browse_fill iconfont"></i>2087
        </span>
        <span class="project-basic-info-more-starcount">
          <i class="icon-like-fill iconfont"></i>1746
        </span>
        <span class="project-basic-info-more-commontcount">
          <i class="icon-message_fill iconfont"></i>26
        </span>
      </p>
    </div>
    <div class="project-basic-info-detail">
      <div class="project-basic-info-detail-cover">
        <p><i class="iconfont icon-uploading"></i>点击更换图片或视频</p>
      </div>
      <div class="project-basic-info-detail-message">
        <p class="project-basic-info-detail-message-item"><label>项目类型:</label>Paracraft创意空间</p>
        <p class="project-basic-info-detail-message-item"><label>项目ID:</label>13548723</p>
        <p class="project-basic-info-detail-message-item"><label>创建时间:</label>2018年8月9日</p>
        <p class="project-basic-info-detail-message-item"><label>当前版本:</label>12.1</p>
        <div class="project-basic-info-detail-operations">
          <el-button type="primary">访问项目</el-button>
          <el-button plain>申请加入</el-button>
        </div>
      </div>
    </div>
    <div class="project-basic-info-description">
      <p class="project-basic-info-description-title">项目描述:</p>
      <div id="projectDescriptoinEditor" class="project-basic-info-description-editor"></div>
    </div>
  </div>
</template>
<script>
import E from 'wangeditor'
export default {
  name: 'ProjectBasicInfo',
  mounted() {
    // log
    // let wangEditor = window.wangEditor
    let descriptionEditor = new E('#projectDescriptoinEditor')
    descriptionEditor.create()
  }
}
</script>
<style lang="scss">
.project-basic-info {
  background-color: #fff;
  &-header {
    padding: 10px 16px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-name {
    font-size: 20px;
    color: #303133;
    font-weight: bold;
    margin: 0;
  }
  &-state {
    background-color: #ef5936;
    font-size: 12px;
    position: relative;
    height: 20px;
    line-height: 20px;
    padding: 0 8px 0 20px;
    border-radius: 20px;
    display: inline-block;
    color: #fff;
  }
  &-state::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    left: 8px;
    top: 8px;
  }
  &-more {
    font-size: 12px;
    color: #909399;
    margin: 9px 0 0;
    &-created {
      padding-right: 16px;
      margin-right: 16px;
      position: relative;
    }
    &-created::after {
      content: '';
      display: inline-block;
      width: 1px;
      height: 10px;
      background-color: #eee;
      position: absolute;
      bottom: 2px;
      right: 0;
    }
    &-starcount {
      margin: 0 10px;
    }
    .iconfont {
      color: #cdcdcd;
      margin-right: 3px;
    }
  }

  &-detail {
    display: flex;
    padding: 16px;
    border-bottom: 1px solid #e8e8e8;
    &-cover {
      width: 480px;
      height: 270px;
      background-color: #303133;
      color: #fff;
      text-align: center;
      line-height: 230px;
      border-radius: 4px;
      margin-right: 16px;
      .iconfont {
        margin-right: 6px;
      }
    }
    &-message {
      position: relative;
      padding-bottom: 36px;
      flex: 1;
      &-item {
        font-size: 14px;
        color: #404144;
        margin: 8px 0 0;
        label {
          color: #909399;
          width: 72px;
          display: inline-block;
        }
      }
    }
    &-operations {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }

  &-description {
    padding: 16px;
    &-title {
      margin: 8px 0 16px;
      font-size: 16px;
      font-weight: bold;
    }
    .w-e-toolbar {
      border-color: #e8e8e8 !important;
      border-bottom: none !important;
    }
    .w-e-text-container {
      height: 250px !important;
      border-color: #e8e8e8 !important;
    }
    .w-e-text {
      padding: 0 8px;
    }
  }
}
</style>
