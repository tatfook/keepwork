<template>
  <div class="project-tags">
    <el-card class="project-tags-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="project-tags-card-label">项目标签</span>
        <el-button class="project-tags-card-button" type="text"><i class="el-icon-edit-outline"></i></el-button>
      </div>
      <el-tag size="small" :key="tag" v-for="tag in dynamicTags" :disable-transitions="false" @close="handleClose(tag)">
        {{tag}}
      </el-tag>
      <el-input class="project-tags-new-input" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>
      <!-- <el-button v-else class="project-tags-new-button" size="small" @click="showInput">+ 新标签</el-button> -->
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'ProjectTags',
  data() {
    return {
      dynamicTags: ['需求', '你好，黑客节', '项目'],
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style lang="scss">
.project-tags {
  &-card {
    &-label {
      font-weight: bold;
    }
    &-button {
      float: right;
      padding: 3px 0;
      color: #909399;
    }
    .el-tag {
      background-color: #eee;
      color: #909399;
      border: none;
      margin-bottom: 16px;
    }
    .el-tag--small .el-icon-close {
      width: 10px;
      right: -3px;
      color: #f56c6c;
    }
    .el-input--small .el-input__inner {
      height: 24px;
      line-height: 24px;
      padding: 0 8px;
    }
  }
  &-new-input {
    width: 54px;
    margin-left: 10px;
    vertical-align: bottom;
    height: 24px;
    line-height: 24px;
  }
  &-new-button {
    margin-left: 10px;
    height: 24px;
    line-height: 22px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
}
</style>

