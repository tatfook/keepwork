<template>
  <div class="project-basic-info">
    <div class="project-basic-info-header">
      <p class="project-basic-info-name">{{originProjectDetail.name}}
        <span class="project-basic-info-state" v-if="!isProjectStopRecruit">{{$t("explore.recruiting")}}</span>
      </p>
      <p class="project-basic-info-more">
        <span class="project-basic-info-more-created">{{$t("project.createBy")}}
          <span class="project-basic-info-more-username">{{projectOwnerUsername}}</span>
          {{$t("project.created")}}
        </span>
        <span class="project-basic-info-more-viewcount">
          <i class="icon-browse_fill iconfont"></i>{{originProjectDetail.visit ? originProjectDetail.visit : 0}}
        </span>
        <span class="project-basic-info-more-starcount">
          <i class="icon-like-fill iconfont"></i>{{originProjectDetail.star || 0}}
        </span>
        <span class="project-basic-info-more-commentcount">
          <i class="icon-message_fill iconfont"></i>{{originProjectDetail.comment || 0}}
        </span>
      </p>
    </div>
    <div class="project-basic-info-detail">
      <div class="project-basic-info-detail-cover" v-loading='isCoverZoneLoading'>
        <img v-show="!isVideoShow" class="project-basic-info-detail-cover-image" :src='projectCover' alt="" @load="coverImageLoaded">
        <video v-show="isVideoShow" class="project-basic-info-detail-cover-video" :src="tempVideoUrl" controls></video>
      </div>
      <div class="project-basic-info-detail-message">
        <p class="project-basic-info-detail-message-item"><label>{{$t("project.projectType")}}:</label>{{ projectType | projectTypeFilter(projectTypes) }}</p>
        <p class="project-basic-info-detail-message-item"><label>{{$t("project.projectId")}}:</label>{{originProjectDetail.id}}</p>
        <p class="project-basic-info-detail-message-item"><label>{{$t("project.createTime")}}:</label>{{originProjectDetail.createdAt | formatDate(formatType)}}</p>
        <div class="project-basic-info-detail-operations">
          <el-button type="primary" @click="toProjectPage">{{ buttonName }}</el-button>
          <el-button @click="toProejctHomePage" plain>{{$t('card.projectHome')}}</el-button>
        </div>
      </div>
    </div>
    <div class="project-basic-info-description"  v-if="tempDesc" v-loading='isLoading'>
      <div class="project-basic-info-description-title">
        {{$t("project.projectDescription")}}:
      </div>
      <div class="project-basic-info-description-content" v-show="!isDescriptionEditing" v-html="tempDesc || $t('project.noDescripton')"></div>
      <div :id="descriptionId" v-show="isDescriptionEditing" class="project-basic-info-description-editor"></div>
    </div>
    <el-dialog title="提示" v-loading='isBinderDialogLoading' :visible.sync="binderDialogVisible" :before-close="handleBinderDialogClose">
      <website-binder @confirmSiteId='handleConfirmSiteId'></website-binder>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleBinderDialogClose">{{$t("common.Cancel")}}</el-button>
      </span>
    </el-dialog>
    <el-dialog class="project-basic-info-apply-dialog" :title='$t("project.applyForProject")' :visible.sync="isApplyDialogVisible" width="400px" :before-close="handleApplyDialogClose">
      <el-input type="textarea" :placeholder="$t('project.enterApplicationReason')" resize='none' v-model="applyText">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleApplyDialogClose">{{$t("common.Cancel")}}</el-button>
        <el-button type="primary" @click="applyJoinProject">{{$t("common.Sure")}}</el-button>
      </span>
    </el-dialog>
    <paracraft-info :isDialogVisible='isParacraftInfoDialogVisible' :paracraftUrl='paracraftUrl' @close='handleParacraftInfoDialogClose'></paracraft-info>
  </div>
</template>

<script>
import ParacraftInfo from '@/components/common/ParacraftInfo'
import WebsiteBinder from './WebsiteBinder'
import projectMixins from './project.mixins'

export default {
  name: 'ProjectBasicInfo',
  mixins: [projectMixins],
  components: {
    ParacraftInfo,
    WebsiteBinder
  },
  computed: {
    projectCover() {
      return this.tempCoverUrl || this.defaultCoverUrl
    }
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
      // line-height: 270px;
      border-radius: 4px;
      margin-right: 16px;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      &-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      &-video {
        width: 100%;
        height: 100%;
      }
      &-cursor {
        position: absolute;
        margin: 0;
        cursor: pointer;
        display: none;
        z-index: 3000;
        height: 36px;
        line-height: 36px;
        right: 24px;
        top: 18px;
        font-size: 14px;
        background-color: #212121;
        color: #fff;
        border-radius: 36px;
        padding: 0 18px;
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.16);
        .el-icon-edit-outline {
          margin-right: 6px;
        }
      }
      .el-loading-spinner {
        line-height: 1;
      }
    }
    &-cover:hover {
      .show-on-hover {
        display: inline-block;
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
      position: relative;
      .el-button {
        position: absolute;
        top: -8px;
        right: 0;
      }
    }
    &-content {
      max-height: 280px;
      overflow: auto;
      p {
        word-break: break-all;
      }
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
    &-editor {
      position: relative;
      z-index: 1;
    }
  }
  &-apply-dialog {
    .el-dialog__header {
      font-size: 16px;
      color: #303133;
      border-bottom: 1px solid #e8e8e8;
      padding: 0 24px;
      height: 60px;
      line-height: 60px;
      font-weight: bold;
    }
    .el-dialog__body {
      padding: 24px;
    }
    .el-textarea__inner {
      resize: none;
      min-height: 33px;
      height: 160px;
      font-size: 14px;
      color: #303133;
    }
    .el-dialog__footer {
      padding: 0 24px 24px;
    }
  }
}

@media (max-width: 768px) {
  .project-basic-info {
    &-detail {
      display: flex;
      flex-direction: column;
      &-cover {
        width: auto;
        height: auto;
        margin-right: 0;
        padding-bottom: 56.25%;
        position: relative;
        &-image {
          position: absolute;
          top: 0;
          left: 0;
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
        &-video {
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      &-operations {
        bottom: -10px;
        display: flex;
        .el-button {
          flex: 1;
          height: 36px;
          font-size: 14px;
          padding: 0;
          line-height: 36px;
        }
      }
    }
    &-description-editor {
      .w-e-toolbar {
        flex-wrap: wrap;
      }
    }
    &-apply-dialog {
      .el-dialog {
        width: 94% !important;
      }
    }
  }
  .el-message {
    min-width: 90%;
  }
}
</style>

