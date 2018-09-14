<template>
  <div class="lesson-menu">
    <div width="460px" center="">
      <div class="select-title">{{$t('lesson.linkThePage')}}</div>
      <el-select v-model="selectValue" class="select-options" :disabled="isLinked" filterable :placeholder="$t('lesson.pleaseSelect')">
        <el-option v-for="item in selectList" :key="item.id" :label="item.lessonName" :value="item.id">
        </el-option>
      </el-select>
      <div class="button-wrap">
        <el-button type="primary" @click="showEditorDialog" :loading="isLoading">{{$t('lesson.edit')}}</el-button>
        <transition name="el-zoom-in-top">
          <el-button v-show="isLinked" @click.stop="handleRelease">{{$t('lesson.release')}}</el-button>
        </transition>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="800px" :append-to-body="true" top="0">
      <edit-lesson v-if="dialogVisible" :isEditorMod="true" :lessonId="selectValue" @cancel="hideDialog" @refresh="this.checkMarkdownIsLinked"></edit-lesson>
    </el-dialog>
  </div>
</template>


<script>
import EditLesson from '@/components/lesson/teacher/EditLesson'

import { lesson } from '@/api'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    EditLesson
  },
  async mounted() {
    await this.getUserLessons({ useCache: false }).catch(e => console.error(e))
    await this.checkMarkdownIsLinked()
  },
  data() {
    return {
      dialogVisible: false,
      isLoading: false,
      lessonId: '',
      selectValue: '',
      selectLesson: {}
    }
  },
  computed: {
    ...mapGetters({
      userLessons: 'lesson/teacher/userLessons',
      activePage: 'activePage',
      activePageUrl: 'activePageUrl'
    }),
    userLessonsFilter() {
      return this.userLessons.filter(({ url }) => !url)
    },
    selectList() {
      return this.isLinked ? this.userLessons : this.userLessonsFilter
    },
    isLinked() {
      return !!this.userLessons.find(({ id }) => id === this.lessonId)
    }
  },
  methods: {
    ...mapActions({
      getUserLessons: 'lesson/teacher/getUserLessons'
    }),
    async checkMarkdownIsLinked() {
      let origin = window.location.origin
      if (origin === 'http://localhost:8080') {
        origin = 'https://stage.keepwork.com'
      }
      await lesson.lessons
        .lessonDetailByUrl({ url: `${origin}${this.activePageUrl}` })
        .then(res => {
          this.lessonId = res.id
          this.selectValue = res.id
          this.isShow = true
        })
        .catch(e => {
          console.error(e)
        })
    },
    async handleRelease() {
      const { file: { content } } = this.activePage
      await lesson.lessons
        .release({ id: this.selectValue, content })
        .then(res =>
          this.$message({
            type: 'success',
            message: this.$t('common.success')
          })
        )
        .catch(e => {
          console.error(e)
          this.$message.error(this.$t('common.success'))
        })
    },
    showDialog() {
      this.dialogVisible = true
    },
    hideDialog() {
      this.dialogVisible = false
    },
    async showEditorDialog() {
      if (!this.selectValue) {
        return this.$message.error(this.$t('lesson.pleaseSelect'))
      }
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
    font-size: 18px;
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


