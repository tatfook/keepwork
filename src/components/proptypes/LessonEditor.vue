<template>
  <div class="lesson-menu">
    <!-- <el-button plain type='primary' @click.stop="getLessonDetailByUrl">编辑课程</el-button> -->
    <div width="460px" center="">
      <div class="select-title">Link the page to</div>
      <div class="select-desc">Select one lesson from the drop-down box, or creat a new one.</div>
      <el-select v-model="selectValue" class="select-options" :disabled="isLinked" filterable placeholder="请选择">
        <el-option v-for="item in userLessonsFilter" :key="item.id" :label="item.lessonName" :value="item.id">
        </el-option>
      </el-select>
      <div class="button-wrap">
        <el-button type="primary" @click="() => dialogVisible = true">Edit</el-button>
        <el-button v-show="isLinked">Release</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="1080px" :append-to-body="true" top="0">
      <new-lesson></new-lesson>
    </el-dialog>
  </div>
</template>


<script>
import NewLesson from '@/components/lesson/teacher/NewLesson'
import { lesson } from '@/api'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    NewLesson
  },
  async mounted() {
    const stageUrl = 'https://stage.keepwork.com/wiki/wikieditor/#'
    const pageUrl = this.$route.path
    await this.getUserLessons({ useCache: false }).catch(e => console.error(e))
    await lesson.lessons
      .lessonDetailByUrl({ url: encodeURIComponent(`${stageUrl}${pageUrl}`) })
      .then(res => {
        console.log(res)
        console.log('好像成功了')
        this.lessonId = res.id
        this.selectValue = res.id
      })
      .catch(e => {
        this.selectDialogVisible = true
        console.error(e)
      })
  },
  destroyed() {
    console.warn('destroyed------>')
  },
  data() {
    return {
      dialogVisible: false,
      lessonId: '',
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      selectValue: ''
    }
  },
  computed: {
    ...mapGetters({
      userLessons: 'lesson/teacher/userLessons'
    }),
    userLessonsFilter() {
      return this.userLessons.map(({ id, lessonName }) => ({ lessonName, id }))
    },
    isShowRelease() {
      return this.selectValue === '选项5'
    },
    isLinked() {
      return this.userLessonsFilter.find(({ id }) => id === this.lessonId)
    }
  },
  methods: {
    ...mapActions({
      getUserLessons: 'lesson/teacher/getUserLessons'
    }),
    async getLessonDetailByUrl() {
      console.log(`${stageUrl}${pageUrl}`)
      await lesson.lessons
        .lessonDetailByUrl({ url: encodeURIComponent(`${stageUrl}${pageUrl}`) })
        .then(res => {
          console.log('好像成功了')
        })
        .catch(e => {
          this.selectDialogVisible = true
          console.error(e)
        })
      console.log(window.location)
    },
    showDialog() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss">
.lesson-menu {
  margin-top: 20px;
  .select-title {
    text-align: center;
    color: #303133;
    font-size: 20px;
    font-weight: bold;
  }
  .select-desc {
    color: #909399;
    margin-top: 10px;
  }
  .select-options {
    margin-top: 10px;
    width: 100%;
  }
  .button-wrap {
    margin-top: 10px;
    text-align: center;
  }
}
</style>


