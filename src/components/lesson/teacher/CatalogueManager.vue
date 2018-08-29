<template>
  <div class="catalogue-manager">
    <div class="catalogue-manager-title">目录:
      <el-button type="success" round size="small" v-show="catalogues.length > 0" @click="showLessonsListModal">添加课程</el-button>
    </div>
    <div class="catalogue-manager-empty" v-show="catalogues.length <= 0">
      <div class="catalogue-manager-empty-info">请先添加课程</div>
      <el-button type="primary" @click="showLessonsListModal">添加课程</el-button>
    </div>
    <div class="catalogue-manager-list" v-show="catalogues.length > 0">
      <vue-draggable v-model="catalogues" :options="{handle:'.icon-drag'}">
        <div class="catalogue-manager-item" v-for="(lesson, index) in catalogues" :key='index'>
          <div class="catalogue-manager-item-index">{{index}}</div>
          <div class="catalogue-manager-item-cover">
            <img :src='lesson.extra.coverUrl' alt="">
          </div>
          <div class="catalogue-manager-item-name">{{lesson.lessonName}}</div>
          <div class="catalogue-manager-item-date">{{lesson.updatedAt}}</div>
          <div class="catalogue-manager-item-operations">
            <el-tooltip effect="dark" content="上下移动" placement="top">
              <span class="iconfont icon-drag"></span>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <span class="iconfont icon-delete1" @click="deleteLessonFromCatalogue(index)"></span>
            </el-tooltip>
          </div>
        </div>
      </vue-draggable>
    </div>
    <lessons-list-dialog :isDialogShow='isLessonsListModalShow' :selectedLessonIds='selectedLessonIds' @close='handleClose' @save='setPackageLessonsList'></lessons-list-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import VueDraggable from 'vuedraggable'
import { mapActions, mapGetters } from 'vuex'
import LessonsListDialog from './LessonsListDialog'
export default {
  name: 'CatalogueManager',
  data() {
    return {
      catalogues: [],
      isLessonsListModalShow: false
    }
  },
  computed: {
    selectedLessonIds() {
      let lessonIds = []
      _.forEach(this.catalogues, lesson => {
        lessonIds.push(lesson.id)
      })
      return lessonIds
    }
  },
  methods: {
    showLessonsListModal() {
      this.isLessonsListModalShow = true
    },
    handleClose() {
      this.isLessonsListModalShow = false
    },
    setPackageLessonsList(addedLessons) {
      this.catalogues = addedLessons
      this.handleClose()
    },
    deleteLessonFromCatalogue(index) {
      this.catalogues.splice(index, 1)
    }
  },
  components: {
    VueDraggable,
    LessonsListDialog
  },
  filters: {
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    }
  }
}
</script>
<style lang="scss">
.catalogue-manager {
  font-size: 16px;
  color: #414141;
  background-color: #fff;
  padding: 30px 28px;
  &-title {
    color: #333;
    padding-bottom: 10px;
    border-bottom: 1px solid #b9bcc2;
    position: relative;
    .el-button--success {
      background-color: #17da98;
      position: absolute;
      right: 0;
      border-color: #17da98;
      bottom: 12px;
      font-size: 16px;
      height: 32px;
      line-height: 32px;
      padding: 0;
      width: 128px;
    }
  }
  &-empty {
    text-align: center;
    margin: 100px 0;
    &-info {
      margin-bottom: 15px;
      color: #414141;
    }
  }
  &-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #414141;
    padding: 15px 0;
    border-bottom: 1px solid #f4f4f4;
    &-index {
      width: 32px;
    }
    &-cover {
      font-size: 0;
      img {
        width: 120px;
        height: 70px;
        object-fit: cover;
      }
    }
    &-name {
      flex: 1;
      padding: 0 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      word-wrap: break-word;
    }
    &-operations {
      width: 100px;
      color: #b3b3b3;
      margin-left: 100px;
      display: flex;
      justify-content: flex-end;
      .iconfont {
        font-size: 18px;
        cursor: pointer;
      }
      .iconfont + .iconfont {
        margin-left: 22px;
      }
    }
  }
  &-item:last-child {
    border-bottom: none;
  }
}
</style>

