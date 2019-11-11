<template>
  <div class="catalogue-manager">
    <div class="catalogue-manager-title">{{$t('lesson.catalogue')}}
      <el-button v-if="isEditable" type="success" round size="small" v-show="catalogues.length > 0" @click="showLessonsListModal">{{$t('lesson.packageManage.addLesson')}}</el-button>
    </div>
    <div class="catalogue-manager-empty" v-show="catalogues.length <= 0">
      <div class="catalogue-manager-empty-info">{{$t('lesson.addLessonFirst')}}</div>
      <el-button v-if="isEditable" type="primary" @click="showLessonsListModal">{{$t('lesson.packageManage.addLesson')}}</el-button>
    </div>
    <div class="catalogue-manager-list" v-show="catalogues.length > 0">
      <vue-draggable v-model="catalogues" :options="{handle:'.icon-drag'}">
        <div class="catalogue-manager-item" v-for="(lesson, index) in catalogues" :key='index'>
          <div class="catalogue-manager-item-index">{{index + 1}}</div>
          <div class="catalogue-manager-item-cover">
            <div class="catalogue-manager-item-cover-wrap">
              <img class="catalogue-manager-item-cover-inner" :src="lesson.coverUrl" alt="">
            </div>
          </div>
          <div class="catalogue-manager-item-name">{{lesson.lessonName}}</div>
          <div class="catalogue-manager-item-date">{{lesson.updatedAt | formatDate(formatType)}}</div>
          <div class="catalogue-manager-item-operations">
            <el-tooltip v-if="isEditable" effect="dark" :content="$t('lesson.packageManage.adjustOrder')" placement="top">
              <span class="iconfont icon-drag"></span>
            </el-tooltip>
            <el-tooltip v-if="isEditable" effect="dark" :content="$t('common.remove')" placement="top">
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
import moment from 'moment'
import VueDraggable from 'vuedraggable'
import LessonsListDialog from './LessonsListDialog'
export default {
  name: 'CatalogueManager',
  props: {
    editingPackageDetail: Object,
    isEditable: {
      type: Boolean,
      default: true
    },
    isEditing: Boolean
  },
  async mounted() {
    if (this.isEditing) {
      let editingPackageDetail = this.editingPackageDetail
      let lessons = _.get(editingPackageDetail, 'lessons', [])
      this.catalogues = _.clone(lessons)
    }
  },
  data() {
    return {
      editingPackageId: _.get(this.$route.params, 'id'),
      catalogues: [],
      formatType: this.$t('lesson.packageManage.formatType'),
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
    formatDate(date, formatType) {
      return moment(date).format(formatType)
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
      width: 112px;
      &-wrap {
        padding-bottom: 56.25%;
        position: relative;
      }
      &-inner {
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
        width: 100%;
        height: 100%;
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

