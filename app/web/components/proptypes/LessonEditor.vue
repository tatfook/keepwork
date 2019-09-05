<template>
  <div class="lesson-menu" v-if="canEdit">
    <div width="460px">
      <div class="lesson-menu-item">
        <span>{{$t('lesson.theme')}}</span>
        <el-select v-model="selectTheme" class="select-options" :disabled="isLinked" :placeholder="$t('lesson.pleaseSelect')">
          <el-option v-for="item in themeList" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
      </div>
      <div class="lesson-menu-item">
        <span>{{$t('lesson.linkThePage')}}</span>
        <el-select v-model="selectValue" class="select-options" :disabled="isLinked" filterable :placeholder="$t('lesson.pleaseSelect')">
          <el-option v-for="item in selectList" :key="item.id" :label="item.lessonName" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="button-wrap">
        <el-button type="primary" @click="showEditorDialog" :loading="isLoading">{{$t('lesson.edit')}}</el-button>
        <transition name="el-fade-in-linear">
          <el-button v-show="isLinked" @click.stop="handleRelease">{{$t('lesson.release')}}</el-button>
        </transition>
        <transition name="el-fade-in-linear">
          <el-button v-show="isLinked" @click.stop="handleUnbind">解绑</el-button>
        </transition>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="800px" :append-to-body="true" top="0">
      <edit-lesson v-if="dialogVisible" :isEditorMod="true" :lessonId="selectValue" :bindType="selectTheme" @cancel="hideDialog" @refresh="this.checkMarkdownIsLinked"></edit-lesson>
    </el-dialog>
  </div>
  <div class="lesson-menu" v-else>
    <div width="460px" center="">
      <div class="select-title">{{$t('lesson.notAllowed')}}</div>
    </div>
  </div>
</template>


<script>
import EditLesson from '@/components/study/EditLesson'
import moment from 'moment'
import protypesBaseMixin from './protypes.base.mixin'
import { lesson } from '@/api'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
export default {
  mixins: [protypesBaseMixin],
  props: {
    originValue: String
  },
  components: {
    EditLesson
  },
  async mounted() {
    await this.initUserData()
  },
  data() {
    return {
      dialogVisible: false,
      isLoading: false,
      lessonId: '',
      selectValue: '',
      selectTheme: 'url',
      selectLesson: {},
      userLessons: []
    }
  },
  computed: {
    ...mapGetters({
      activePage: 'activePage',
      activePageUrl: 'activePageUrl'
    }),
    themeList() {
      return [
        {
          name: '教案',
          key: 'url'
        },
        {
          name: '课件',
          key: 'coursewareUrl'
        }
      ]
    },
    userLessonsFilter() {
      return _.filter(this.userLessons, ({ url }) => !url)
    },
    selectList() {
      return this.isLinked ? this.userLessons : this.userLessonsFilter
    },
    isLinked() {
      return !!_.find(this.userLessons, ({ id }) => id === this.lessonId)
    },
    canEdit() {
      return !this.lessonId || this.isLinked
    },
    linkedLesson() {
      return _.find(this.userLessons, item => item.id === this.lessonId) || {}
    },
    linkedLessonName() {
      return _.get(this.linkedLesson, 'lessonName', '')
    },
    linkedTheme() {
      if (!this.isLinked) {
        return ''
      }
      const { url, coursewareUrl } = this.linkedLesson
      if (url && url === this.currentURL) {
        return 'url'
      }
      if (coursewareUrl && coursewareUrl === this.currentURL) {
        return 'coursewareUrl'
      }
    },
    currentURL() {
      const origin = window.location.origin
      const currentURL = `${origin}${this.activePageUrl}`
      return currentURL
    }
  },
  methods: {
    async getUserLessons() {
      let lessons = await lesson.lessons.getUserLessons()
      this.userLessons = _.get(lessons, 'rows')
    },
    async checkMarkdownIsLinked() {
      try {
        const { id } = await lesson.lessons.lessonDetailByUrl({
          url: this.currentURL
        })
        this.lessonId = id
        this.selectValue = id
      } catch (error) {
        console.error(error)
        this.lessonId = ''
        this.selectValue = ''
      }
    },
    async initUserData() {
      await this.getUserLessons()
      await this.checkMarkdownIsLinked()
      if (this.linkedTheme) {
        this.selectTheme = this.linkedTheme
      } else {
        this.selectTheme = 'url'
      }
    },
    async handleUnbind() {
      if (!this.isLinked) {
        return
      }
      console.log(this.linkedLesson)
      console.log(this.linkedTheme)
      this.$confirm(`确定取消关联到课程: ${this.linkedLessonName} ?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await lesson.lessons.update({
            updatingData: { id: this.linkedLesson.id, [this.linkedTheme]: null }
          })
          await this.initUserData()
        })
        .catch(e => console.error(e))
    },
    async handleRelease() {
      const {
        file: { content }
      } = this.activePage
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
          this.$message.error(this.$t('common.failure'))
        })
    },
    showDialog() {
      this.dialogVisible = true
    },
    hideDialog() {
      this.dialogVisible = false
      this.updateMarkdown({ updated: moment().format('YYYY/MM/DD HH:mm:ss') })
    },
    async showEditorDialog() {
      if (!this.selectValue) {
        return this.$message.error(this.$t('lesson.pleaseSelect'))
      }
      this.dialogVisible = true
    },
    updateMarkdown(payload) {
      this.$emit('onPropertyChange', payload)
      this.$emit('onChangeValue')
    }
  }
}
</script>

<style lang="scss">
.lesson-menu {
  margin-top: 20px;
  &-item {
    margin-bottom: 20px;
  }
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
    text-align: right;
  }
}
</style>


