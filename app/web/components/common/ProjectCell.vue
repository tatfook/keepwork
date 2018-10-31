<template>
  <div class="project-cell">
    <img class="project-cell-cover" :src="project.extra.coverUrl || project_default_cover" alt="" @click="goProjectDetail(project)">
    <h4 class="project-cell-title" @click="goProjectDetail(project)" :title="project.name">
      <span class="text">{project.name}}</span>
      <span class="recruitment" v-if="project.privilege == 1">招募中</span>
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
      <div class="project-cell-author-name"><img :src="(project.user && project.user.portrait) || default_portrait" alt="portrait">{{project.user && project.user.username}}</div>
      <div class="project-cell-author-time">{{relativeTime(project.updatedAt)}}</div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { locale } from '@/lib/utils/i18n'
import project_default_cover from '@/assets/pblImg/project_default_cover.png'
import default_portrait from '@/assets/img/default_portrait.png'

export default {
  name: 'ProjectCell',
  props: {
    project: {
      type: Object,
      default() {
        return {
          user: {}
        }
      }
    }
  },
  data() {
    return {
      project_default_cover: project_default_cover,
      default_portrait: default_portrait
    }
  },
  computed: {
    isEn() {
      return locale === 'en-US'
    }
  },
  methods: {
    goProjectDetail(project) {
      window.open(`/pbl/project/${project.id}/`)
    },
    relativeTime(time) {
      // console.log('time',moment(time).format('MMMM Do YYYY, h:mm:ss a'))
      this.isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment(time, 'YYYYMMDDHH').fromNow()
    }
  }
}
</script>

<style lang='scss'>
.project-cell {
  width: 290px;
  padding: 16px;
  margin-bottom: 16px;
  box-sizing: border-box;
  border: 1px solid #e8e8e8;
  background: #fff;
  &:hover {
    box-shadow: 0 0 25px 3px #ccc;
    transition: all 0.5s ease-in;
  }
  &-cover {
    width: 100%;
    height: 143px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
  }
  &-title {
    font-size: 14px;
    margin: 10px 0;
    line-height: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    .red {
      color: red;
    }
    .text {
      display: inline-block;
      max-width: 190px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 20px;
    }
    .recruitment {
      display: inline-block;
      background: #ef5936;
      border-radius: 10px;
      color: #fff;
      margin-left: 4px;
      padding: 0 8px;
      font-size: 11px;
      height: 20px;
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
    &-name {
      flex: 1;
      display: flex;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 8px;
      }
    }
    &-time {
      width: 80px;
      text-align: right;
    }
  }
}
@media screen and (max-width: 768px) {
  .project-cell {
    margin: 0 auto 15px;
  }
}
</style>
