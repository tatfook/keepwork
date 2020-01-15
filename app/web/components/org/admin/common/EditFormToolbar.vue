<template>
  <div class="edit-form-toolbar">
    <div class="item">
      <div class="header">外观</div>
      <div class="aspect-content">
        <form-bg class="aspect-item" v-for="item in aspectSettings" :key="item.key" :itemLabel="item.label" :itemKey="item.key" />
      </div>
    </div>
    <div class="item">
      <div class="header">组件</div>
      <div class="comp-content">
        <div class="comp-item" v-for="item in componentsSettings" :key="item.key" @click="addNewComp(item.type)">{{item.label}}</div>
      </div>
    </div>
    <sky-drive-manager-dialog :isApplicable='true' :isVideoShow="false" :isNoMediaFileShow="true" :show='isMediaSkyDriveDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { getDefaultDataByType } from '../../common/FormComps/compDefaultData'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import FormBg from '../../common/FormComps/FormBg'
export default {
  name: 'EditFormToolbar',
  data() {
    return {
      aspectSettings: [
        { label: '表头背景图', key: 'header' },
        { label: '页面背景图', key: 'page' },
      ],
      componentsSettings: [
        { label: '文本', type: 3 },
        { label: '问答题', type: 2 },
        { label: '选择题', type: 0 },
        { label: '文件展示', type: 4 },
      ],
      isMediaSkyDriveDialogShow: false,
    }
  },
  computed: {
    ...mapGetters({
      editingFormQuizzes: 'org/editingFormQuizzes',
    }),
  },
  methods: {
    ...mapActions({
      setEditingQuizzes: 'org/setEditingQuizzes',
    }),
    showSkydrive() {
      this.isMediaSkyDriveDialogShow = true
    },
    closeSkyDriveManagerDialog({ file, url }) {
      this.isMediaSkyDriveDialogShow = false
      if (!url) return
      let { type: fileType, filename } = file
      this.pushNewQuiz({ type: 4, fileType, url, filename })
    },
    addNewComp(type) {
      if (type === 4) {
        return this.showSkydrive()
      }
      this.pushNewQuiz({ type })
    },
    pushNewQuiz({ type, fileType, url, filename }) {
      let quizzes = this.editingFormQuizzes
      let newQuiz = getDefaultDataByType({ type, fileType, url, filename })
      quizzes.push(newQuiz)
      this.setEditingQuizzes(quizzes)
    },
  },
  components: {
    SkyDriveManagerDialog,
    FormBg,
  },
}
</script>
<style lang="scss" scoped>
.edit-form-toolbar {
  font-size: 14px;
  .item {
    margin-bottom: 16px;
    border-radius: 4px 4px 0 0;
    border: 1px solid #e8e8e8;
    overflow: hidden;
  }
  .header {
    background-color: #2397f3;
    font-size: 16px;
    color: #fff;
    border-bottom: 1px solid #e8e8e8;
    height: 32px;
    line-height: 32px;
    padding-left: 20px;
  }
  .aspect-content {
    padding: 20px;
  }
  .comp-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 12px 20px;
  }
  .comp-item {
    width: 80px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #303133;
    border: 1px solid;
    border-radius: 4px;
    margin: 8px 0;
    cursor: pointer;
  }
}
</style>
