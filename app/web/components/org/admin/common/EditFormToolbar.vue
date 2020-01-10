<template>
  <div class="edit-form-toolbar">
    <div class="item">
      <div class="header">外观</div>
      <div class="aspect-content">
        <div class="aspect-item" v-for="item in aspectSettings" :key="item.key">
          <label>{{item.label}}</label>
          <div class="upload-button">上传图片</div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="header">组件</div>
      <div class="comp-content">
        <div class="comp-item" v-for="item in componentsSettings" :key="item.key" @click="addNewComp(item.type)">{{item.label}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { getDefaultDataByType } from '../../common/FormComps/compDefaultData'
export default {
  name: 'EditFormToolbar',
  data() {
    return {
      aspectSettings: [{ label: '表头背景图', key: 'header' }, { label: '页面背景图', key: 'page' }],
      componentsSettings: [
        { label: '文本', type: 3 },
        { label: '问答题', type: 2 },
        { label: '选择题', type: 0 },
        // { label: '文件展示', type: 4 },
      ],
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
    addNewComp(type) {
      let quizzes = this.editingFormQuizzes
      let newQuiz = getDefaultDataByType({ type })
      quizzes.push(newQuiz)
      this.setEditingQuizzes(quizzes)
      // this.$emit('newComp', { type })
    },
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
