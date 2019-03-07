<template>
  <el-dialog class="lessons-list-dialog" :visible.sync="isDialogShow" width="455px" :before-close="handleClose" :title="$t('lesson.packageManage.addLesson')">
    <div class="lessons-list-dialog-search">
      <el-input :placeholder="$t('lesson.packageManage.searchByName')" prefix-icon="iconfont icon-Amplification__" v-model="searchName">
      </el-input>
    </div>
    <div class="lessons-list-dialog-box" v-show="nameFilteredLessonList.length > 0">
      <div class="lessons-list-dialog-item" v-for="(lesson, index) in nameFilteredLessonList" :key="index">
        <span class="lessons-list-dialog-item-name">{{lesson.lessonName}}</span>
        <span class="lessons-list-dialog-item-date">{{lesson.updatedAt | formatDate(formatType)}}</span>
        <span class="lessons-list-dialog-item-checkbox">
          <el-checkbox v-model="lesson.isSelect"></el-checkbox>
        </span>
      </div>
    </div>
    <div class="lessons-list-dialog-empty" v-show="nameFilteredLessonList.length <= 0">
      <img src="@/assets/lessonImg/no_packages.png" alt="">
      <p class="lessons-list-dialog-empty-info" v-show="searchName.length > 0">{{$t('lesson.packageManage.searchResultIsEmpty')}}</p>
      <p class="lessons-list-dialog-empty-info" v-show="searchName.length <= 0" v-html="$t('lesson.packageManage.createLesson', {here: `<a href='/l/teacher/lesson/new'>${$t('lesson.packageManage.clickHere')}</a>`})"></p>
    </div>
    <div class="lessons-list-dialog-operations">
      <el-button type="info" @click="handleClose">{{$t('common.Cancel')}}</el-button>
      <el-button type="primary" @click="toAdd" :disabled="searchName.length <= 0">{{$t('common.add')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LessonsListDialog',
  props: {
    selectedLessonIds: Array,
    isDialogShow: Boolean
  },
  async mounted() {
    await this.getUserLessons({})
    this.initLessonIsSelect()
  },
  data() {
    return {
      searchName: '',
      formatType: this.$t('lesson.packageManage.formatType'),
      lessonList: []
    }
  },
  computed: {
    ...mapGetters({
      userLessons: 'lesson/teacher/userLessons'
    }),
    selectedLessons() {
      return _.filter(this.lessonList, { isSelect: true })
    },
    nameFilteredLessonList() {
      let originList = this.lessonList
      if (this.searchName.length <= 0) {
        return originList
      }
      let reg = new RegExp(this.searchName)
      return _.filter(originList, lesson => {
        return reg.test(lesson.lessonName)
      })
    }
  },
  methods: {
    ...mapActions({
      getUserLessons: 'lesson/teacher/getUserLessons'
    }),
    initLessonIsSelect() {
      let clonedLessonList = _.cloneDeep(this.userLessons)
      this.lessonList = _.map(clonedLessonList, lesson => {
        let { id } = lesson
        if (_.indexOf(this.selectedLessonIds, id) !== -1) lesson.isSelect = true
        else lesson.isSelect = false
        return lesson
      })
    },
    handleClose() {
      this.initLessonIsSelect()
      this.$emit('close')
    },
    toAdd() {
      this.$emit('save', this.selectedLessons)
    }
  },
  watch: {
    selectedLessonIds(newVal, oldVal) {
      this.initLessonIsSelect()
    }
  },
  filters: {
    formatDate(date, formatType) {
      return dayjs(date).format(formatType)
    }
  }
}
</script>
<style lang="scss">
.lessons-list-dialog {
  .el-dialog__header {
    background-color: #409efe;
    padding: 10px 30px 6px;
  }
  .el-dialog__title {
    color: #fff;
    font-size: 14px;
  }
  .el-dialog__headerbtn {
    top: 13px;
    right: 13px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .el-dialog__body {
    padding: 20px 10px 48px;
  }
  .el-input--prefix .el-input__inner {
    border-radius: 38px;
    height: 38px;
    padding-left: 50px;
  }
  &-search {
    padding-right: 20px;
    .el-input__prefix {
      left: 22px;
    }
    .el-input__icon {
      font-size: 26px;
    }
  }
  &-box {
    height: 295px;
    overflow: auto;
    padding: 0 20px 25px;
    margin: 15px 0 58px;
  }
  &-item {
    padding: 15px 0;
    font-size: 14px;
    color: #414141;
    display: flex;
    align-items: center;
    &-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-date {
      width: 150px;
      text-align: left;
    }
    &-checkbox {
      width: 30px;
    }
    .el-checkbox__inner {
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }
    .el-checkbox__inner::after {
      width: 7px;
      height: 13px;
      left: 9px;
      top: 4px;
      border-width: 2px;
    }
  }
  &-empty {
    text-align: center;
    padding: 125px 0;
    img {
      width: 120px;
    }
    &-info {
      font-size: 20px;
      color: #111;
      margin: 20px 0 0;
    }
  }
  &-operations {
    text-align: center;
    .el-button {
      width: 170px;
      height: 42px;
      padding: 0;
      font-size: 17px;
    }
    .el-button + .el-button {
      margin-left: 28px;
    }
  }
}
</style>
