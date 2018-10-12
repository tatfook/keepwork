<template>
  <el-dialog v-if="show" :visible.sync="show" :before-close="handleClose" class="new-issue-dialog">
    <div class="new-issue">
      <div class="title">新建问题</div>
      <div class="sketch">
        <div class="sketch-box">
          <div class="sketch-box-tag">标题</div>
          <div class="sketch-box-content">
            <el-input size="medium"></el-input>
          </div>
        </div>
        <div class="sketch-box">
          <div class="sketch-box-tag">标签</div>
          <div class="sketch-box-content">
            <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleCloseTag(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
        </div>
        <div class="sketch-box">
          <div class="sketch-box-tag">指派</div>
          <div class="sketch-box-content">
            <!-- 指派头像显示 -->
          </div>
        </div>
        <div class="sketch-box">
          <div class="sketch-box-tag">描述</div>
          <div class="sketch-box-content">
            <el-input type="textarea" :rows="4" placeholder="互联网改变世界" v-model="descriptionText"></el-input>
          </div>
        </div>
      </div>
      <div class="finish">
        <el-button size="medium" type="primary">完成创建</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'NewIssue',
  props: {
    show: Boolean
  },
  data() {
    return {
      dynamicTags: ['需求', '设计', '标签三'],
      inputVisible: false,
      inputValue: '',
      descriptionText: ''
    }
  },
  methods: {
    handleCloseTag(tag) {
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
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.new-issue-dialog {
  .el-dialog {
    max-width: 600px;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body {
      padding: 6px 20px;
    }
  }

  .new-issue {
    margin: 0 auto;
    background: #fff;
    .title {
      line-height: 60px;
      font-size: 16px;
      color: #303133;
      padding-left: 4px;
      font-weight: bold;
      border-bottom: 1px solid #e8e8e8;
      max-width: 600px;
      margin-bottom: 12px;
    }
    .sketch {
      padding-left: 6px;
      &-box {
        display: flex;
        line-height: 60px;
        max-width: 600px;
        &-tag {
          width: 52px;
          font-size: 14px;
          color: #909399;
        }
        &-content {
          flex: 1;
          .el-tag + .el-tag {
            margin-left: 10px;
          }
        }
      }
    }
    .finish {
      padding: 24px 68px;
    }
  }
}
</style>

