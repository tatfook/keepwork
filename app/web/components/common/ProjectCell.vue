<template>
  <div class="item">
    <img class="item-cover" :src="project.extra.coverUrl" alt="">
    <h4 class="item-title">{{project.name}}</h4>
    <div class="item-like">
      <i class="iconfont icon-browse_fill"></i>
      <span>{{project.visit}}</span>
      <i class="iconfont icon-like-fill"></i>
      <span>{{project.star}}</span>
      <i class="iconfont icon-message_fill"></i>
      <span>{{project.comment}}</span>
    </div>
    <div class="item-author">
      <div class="item-author-name"><img :src="project.user.portrait" alt="portrait">{{project.user.nickname}}</div>
        <div class="item-author-time">{{relativeTime(project.updatedAt)}}</div>
      </div>
    </div>
</template>
<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { locale } from '@/lib/utils/i18n'

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
    return {}
  },
  computed:{
    isEn() {
      return locale === 'en-US'
    }
  },
  methods:{
    relativeTime(time){
      this.isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment(time,"YYYYMMDD").fromNow();
    }
  }
}
</script>

<style lang='scss'>
.item {
  width: 290px;
  padding: 16px;
  margin-bottom: 16px;
  box-sizing: border-box;
  border: 1px solid #e8e8e8;
  background: #fff;
  &:hover {
    box-shadow: 2px 2px 8px rgb(228, 226, 226), -2px -2px 8px rgb(228, 226, 226);
    transition: all 0.5s ease-in;
  }
  &-cover {
    width: 100%;
    height: 143px;
    object-fit: cover;
    border-radius: 4px;
  }
  &-title {
    font-size: 14px;
    margin: 10px 0;
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
</style>
