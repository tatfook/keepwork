<template>
  <div class="lesson-menu" v-if="canEdit">
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
import Parser from '@/lib/mod/parser'
import BlockHelper from '@/lib/mod/parser/blockHelper'
import uuid from 'uuid/v1'
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
    await this.getUserLessons()
    await this.checkMarkdownIsLinked()
  },
  data() {
    return {
      dialogVisible: false,
      isLoading: false,
      lessonId: '',
      selectValue: '',
      selectLesson: {},
      userLessons: []
    }
  },
  computed: {
    ...mapGetters({
      activePage: 'activePage',
      activePageUrl: 'activePageUrl'
    }),
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
    }
  },
  methods: {
    async getUserLessons() {
      let lessons = await lesson.lessons.getUserLessons()
      this.userLessons = _.get(lessons, 'rows')
    },
    async checkMarkdownIsLinked() {
      let origin = window.location.origin
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
      const {
        file: { content }
      } = this.activePage

      // let modList = Parser.buildBlockList(content)
      // let newModList = [...modList]
      // newModList.forEach(item => {
      //   if (item.cmd === 'Quiz') {
      //     item.data.quiz.data[0].id = uuid()
      //     BlockHelper.buildMarkdown(item)
      //   }
      // })
      // let md = Parser.buildMarkdown(newModList)
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
      this.updateMarkdown({ updated: moment().format('YYYY/MM/DD HH:mm:ss')})
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


