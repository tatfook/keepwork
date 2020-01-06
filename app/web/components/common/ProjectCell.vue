<template>
  <div class="project-cell" :class="{'project-cell-topped': isTopizable && project.isTopped}">
    <span v-if="ranking && level < 3" class="project-cell-medal"><img :src="rankingIcon" alt="medal"></span>
    <span v-if="ranking && level>=3" class="project-cell-medal-4">{{level+1}}</span>
    <div class="project-cell-cover" @click="goProjectDetail(project)">
      <video v-if="(project.extra && project.extra.videoUrl)" class="project-cell-cover-img" controls="controls" :src="(project.extra && project.extra.videoUrl) || ''"></video>
      <img v-else class="project-cell-cover-img" :src="(project.extra && project.extra.imageUrl) || project_default_cover" :alt="projectDisplayName" @error="showDefault">
      <div class="video-mask"></div>
      <span class="project-cell-cover-tag" v-if='showRate && showProjectRate'>{{projectRate}}</span>
      <span class="project-cell-cover-visibility" v-if='project.visibility == 1'>
        <i class="iconfont icon-private___"></i>
      </span>
    </div>
    <h4 class="project-cell-title" @click="goProjectDetail(project)">
      <span class="picked" title="精选" v-if="project.choicenessNo"><img src="@/assets/pblImg/picked.png" alt=""></span>
      <span class="recruitment" :title='$t("explore.recruiting")' v-if="project.privilege & 1">{{isEn ? 'R':'招'}}</span>
      <span class="text" :title="projectDisplayName" v-html="projectDisplayName"></span>
      <span class="id" v-html="`${project._id || '#' + project.id}`"></span>
      <span class="project-type">
        <el-popover popper-class="project-cell-type-popover" placement="top" :title="projectType" trigger="hover" content="">
          <img slot="reference" :src="projectTypeIcon" alt="">
        </el-popover>
      </span>
    </h4>
    <div class="project-cell-like">
      <i class="iconfont icon-browse_fill"></i>
      <span>{{project.visit}}</span>
      <i class="iconfont icon-like-fill"></i>
      <span>{{project.star}}</span>
      <i class="iconfont icon-message_fill"></i>
      <span>{{project.comment}}</span>
    </div>
    <div class="project-cell-author">
      <a :href="`/u/${projectUsername}`" target="_blank" class="project-cell-author-name">
        <user-portrait class="project-cell-author-profile" :user="project.user || {}" :width="30" size="small" badgePosition="relative"></user-portrait>
        <span class="username" :title="projectUsername">{{projectUsername}}</span>
      </a>
      <div class="project-cell-author-time">
        <p class="project-cell-author-time-text" :title="updatedAtTime">{{isEn ? $t('common.update')+'d' : ''}} {{relativeTime(project.updatedAt)}}{{isEn ? '' : $t('common.update')}}</p>
        <span v-if="isTopizable" class="project-cell-stick stick-hover" @click="toggleStickProject(project)">
          <i class="iconfont icon-vertical-align-top" v-show="!project.isTopped"></i>
          {{project.isTopped ? $t('profile.unTop') : $t('profile.top')}}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { locale } from '@/lib/utils/i18n'
import project_default_cover from '@/assets/pblImg/project_default_cover.png'
import UserPortrait from '@/components/common/UserPortrait'

export default {
  name: 'ProjectCell',
  props: {
    isTopizable: {
      type: Boolean,
      default: false,
    },
    ranking: {
      type: Boolean,
      default: false,
    },
    showProjectRate: {
      type: Boolean,
      default: true,
    },
    level: {
      type: Number,
      default: 0,
    },
    project: {
      type: Object,
      default() {
        return {
          user: {},
        }
      },
    },
  },
  data() {
    return {
      project_default_cover: project_default_cover,
    }
  },
  computed: {
    isEn() {
      return locale === 'en-US'
    },
    projectDisplayName() {
      return (
        _.get(this.project, 'highlight.world_tag_name.0') ||
        _.get(this.project, 'extra.worldTagName') ||
        this.project.name
      )
    },
    updatedAtTime() {
      return (
        (this.isEn ? this.$t('common.update') + 'd' : '') +
        ' ' +
        this.relativeTime(this.project.updatedAt) +
        (this.isEn ? '' : this.$t('common.update'))
      )
    },
    projectType() {
      return this.project.type == 0 ? this.$t('common.websiteB') : 'paracraft'
    },
    projectTypeIcon() {
      return this.project.type == 0 ? require('@/assets/pblImg/website.png') : require('@/assets/pblImg/paracraft.png')
    },
    rankingIcon() {
      return this.level === 0
        ? require('@/assets/pblImg/gold.png')
        : this.level === 1
        ? require('@/assets/pblImg/silver.png')
        : require('@/assets/pblImg/copper.png')
    },
    projectRate() {
      return this.project.rate.toFixed(1)
    },
    showRate() {
      return this.project.type == 1 && this.projectRate > 0 && _.get(this.project.extra.rate, 'count', 0) >= 8
    },
    projectUsername() {
      return _.get(this.project, 'user.username', '未命名')
    },
  },
  methods: {
    showDefault(e) {
      const img = e.srcElement
      img.src = project_default_cover
      img.onerror = null
    },
    goProjectDetail(project) {
      window.open(`/pbl/project/${project.id}/`)
    },
    relativeTime(time) {
      const offset = moment().utcOffset()
      this.isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment(time)
        .utcOffset(offset)
        .fromNow()
    },
    toggleStickProject(project) {
      this.$emit('toggleStickProject', project)
    },
  },
  components: {
    UserPortrait,
  },
}
</script>

<style lang='scss'>
.project-cell {
  width: 290px;
  padding: 16px 16px 8px;
  margin: 0 auto 16px;
  box-sizing: border-box;
  // border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  transition: all 200ms ease-in;
  position: relative;
  &-medal {
    position: absolute;
    top: 0;
    z-index: 10;
  }
  &-medal-4 {
    position: absolute;
    top: 20px;
    left: 0;
    z-index: 10;
    background: url(../../assets/pblImg/top4_100.png);
    display: inline-block;
    width: 60px;
    height: 28px;
    line-height: 28px;
    color: #fff;
    font-weight: bold;
    text-shadow: 1px 2px 2px #303133;
    text-align: center;
  }
  .red {
    color: red;
  }
  &-topped::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
    border-bottom: 16px solid #2397f3;
    transform: rotate(-45deg);
    left: -10px;
    top: -2px;
  }
  &-stick {
    position: absolute;
    right: 0;
    top: 0;
    left: 0;
    background-color: #fff;
    color: #aaa;
    font-size: 12px;
    cursor: pointer;
    display: none;
  }
  &:hover {
    box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.16);
    transition: all 200ms ease-in;
    .stick-hover {
      display: inline-block;
    }
  }
  &-cover {
    width: 100%;
    height: 143px;
    cursor: pointer;
    position: relative;
    &-img {
      width: 100%;
      height: 143px;
      object-fit: cover;
      border-radius: 6px;
      cursor: pointer;
    }
    .video-mask {
      width: 100%;
      height: 143px;
      position: absolute;
      top: 0;
      left: 0;
    }
    &-tag {
      position: absolute;
      top: 5px;
      font-size: 24px;
      line-height: 26px;
      background: rgba(255, 255, 255, 0.7);
      padding: 0 3px;
      border-radius: 3px;
      right: 5px;
      font-style: italic;
      color: #ffa405;
      font-family: 'SourceHanSansCN-Medium';
      background: rgba(0, 0, 0, 0.1);
    }
    &-visibility {
      position: absolute;
      display: inline-block;
      width: 18px;
      height: 18px;
      background-color: #000;
      border-radius: 50%;
      line-height: 20px;
      color: #fac746;
      left: 6px;
      text-align: center;
      top: 4px;
      .iconfont {
        font-size: 24px;
        position: relative;
        left: -2px;
      }
    }
  }
  &-title {
    font-size: 14px;
    margin: 10px 0;
    line-height: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    position: relative;
    .text {
      display: inline-block;
      max-width: 140px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 20px;
      & > span {
        color: red;
      }
    }
    .id {
      color: #909399;
      padding-left: 4px;
    }
    .picked {
      margin-right: 4px;
      img {
        height: 20px;
        width: 20px;
        object-fit: contain;
      }
    }
    .recruitment {
      display: inline-block;
      background: #ef5936;
      border-radius: 10px;
      color: #fff;
      margin-right: 4px;
      padding: 0 6px;
      font-size: 11px;
      height: 20px;
    }
    .project-type {
      position: absolute;
      right: 2px;
      top: 0;
    }
  }
  &-like {
    font-size: 12px;
    color: #909399;
  }
  &-author {
    display: flex;
    align-items: center;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    padding-top: 12px;
    &-profile {
      padding: 0 5px;
      flex-shrink: 0;
    }
    &-name {
      flex: 1;
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #303133;
      &:hover {
        color: #2397f3;
      }
      .username {
        display: inline-block;
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
      }
    }
    &-time {
      width: 120px;
      text-align: right;
      position: relative;
      &-text {
        line-height: 15px;
        height: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        font-size: 12px;
        color: #b0b4bb;
      }
    }
  }
}
.project-cell-type-popover.el-popper.el-popover {
  min-width: unset;
  padding: 6px;
  .el-popover__title {
    font-size: 12px;
    text-align: center;
    margin: 0;
  }
}
@media screen and (max-width: 768px) {
  .project-cell {
    width: 100%;
    max-width: 230px;
    padding: 4px;
    font-size: 12px;
    border: none;
    &-cover {
      width: 100%;
      height: 90px;
      &-img {
        width: 100%;
        height: 90px;
        object-fit: cover;
        border-radius: 4px;
      }
    }
    &-title {
      font-size: 12px;
    }
    &-author {
      font-size: 12px;
      &-name {
        .username {
          width: 50px;
        }
      }
    }
  }
}
</style>
