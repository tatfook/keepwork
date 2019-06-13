<template>
  <div class="project-mod-mini">
    <img @click="toProejctHomePage" class="project-cover" :src='tempCoverUrl || defaultCoverUrl' alt="" @load="coverImageLoaded">
    <div class="project-info">
      <div class="project-info-data">
        <div class="project-info-data-row">
          <span @click="toProejctHomePage" class="project-name">{{projectName}}</span>
          <span @click="toProejctHomePage" class="project-id">{{projectID}}</span>
          <span v-if="isRecruitment" class="project-tags state">{{isEn ? 'R': '招'}}</span>
          <img class="project-tags picked" v-if="isPickedProject" :src="pickedIcon" alt="精选">
          <img class="project-tags type" :src="projectTypeIcon" :alt="projectAlt">
        </div>
        <div class="project-info-count">
          <span class="project-info-count-item project-viewcount">
            <i class="icon-browse_fill iconfont"></i>{{originProjectDetail.visit + 1}}
          </span>
          <span class="project-info-count-item project-starcount">
            <i class="icon-like-fill iconfont"></i>{{originProjectDetail.star}}
          </span>
          <span class="project-info-count-item project-commentcount">
            <i class="icon-message_fill iconfont"></i>{{originProjectDetail.comment}}
          </span>
        </div>
      </div>
      <div class="project-info-owner">
        <span class="project-info-owner-name">{{$t('project.createByAt', { username: projectOwnerUsername})}}</span>
        <span>{{originProjectDetail.createdAt | formatDate(formatType)}}</span>
      </div>
    </div>
    <div class="project-button">
      <el-button @click="toProjectPage" type="primary">{{buttonName}}</el-button>
    </div>
    <paracraft-info :isDialogVisible='isParacraftInfoDialogVisible' :paracraftUrl='paracraftUrl' @close='handleParacraftInfoDialogClose'></paracraft-info>
  </div>
</template>

<script>
import projectMixins from './project.mixins'
import ParacraftInfo from '@/components/common/ParacraftInfo'
import pickedIcon from '@/assets/pblImg/picked.png'
import websiteIcon from '@/assets/pblImg/website.png'
import paracraftIcon from '@/assets/pblImg/paracraft.png'

export default {
  name: 'ProjectMini',
  mixins: [projectMixins],
  data() {
    return {
      pickedIcon,
      websiteIcon,
      paracraftIcon
    }
  },
  components: {
    ParacraftInfo
  },
  computed: {
    projectName() {
      return _.get(this.originProjectDetail, 'name', '')
    },
    projectID() {
      const ID = _.get(this.originProjectDetail, 'id', '')
      return ID ? `#${ID}` : ''
    },
    projectTypeIcon() {
      return this.isWebType ? this.websiteIcon : this.paracraftIcon
    },
    projectAlt() {
      return this.isWebType ? '网站' : 'paracraft'
    },
    isPickedProject() {
      return this.originProjectDetail.choicenessNo > 0
    },
    isRecruitment() {
      return this.originProjectDetail.privilege & 1
    }
  }
}
</script>

<style lang="scss" scoped>
.project-mod-mini {
  height: 100px;
  padding: 8px;
  display: flex;
  box-sizing: border-box;
  .project-cover {
    height: 84px;
    width: 151px;
    border-radius: 4px;
    object-fit: cover;
    cursor: pointer;
  }
  .project-info {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex: 1;
    height: 84px;
    padding-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    &-data {
      &-row {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: 26px;
      }
      .project {
        &-name {
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          margin-right: 4px;
          overflow: hidden;
          word-break: keep-all;
          text-overflow: ellipsis;
        }
        &-id {
          font-size: 20px;
          color: #3ba4ff;
          cursor: pointer;
          margin-right: 10px;
        }
        &-tags {
          margin-right: 4px;
          &.state {
            height: 20px;
            width: 20px;
            background-color: #ef5936;
            font-size: 12px;
            line-height: 20px;
            border-radius: 20px;
            display: inline-block;
            text-align: center;
            color: #fff;
          }
        }
      }
    }
    &-count {
      margin-top: 4px;
      color: #909399;
      font-size: 12px;
      .iconfont {
        color: #cdcdcd;
      }
      &-item {
        margin: 0 16px 0 0;
      }
    }
    &-owner {
      color: #303133;
      font-size: 12px;
      &-name {
        margin-right: 6px;
      }
    }
  }
  .project-button {
    width: 132px;
    display: flex;
    align-items: center;
    justify-content: center;
    /deep/ .el-button {
      background: #3ba4ff;
      padding: 8px 20px;
    }
  }
}

</style>


