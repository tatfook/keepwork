<template>
  <div>
    <div @click="showReferences" class="lesson-references-wrap">
      <span class="references-icon"></span>
      <span class="references-title">References</span>
    </div>
    <el-dialog class="references-dialog" center :visible.sync="isShowReferences" title="References" @close="closeReferences" width="60%">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(file, index) in files" :key="index" class="references-file">
          <span>{{file.type}}</span>
          <span>{{file.name}}</span>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Referencs',
  props: {
    data: Object
  },
  data() {
    return {
      isShowReferences: false,
      files: [
        {
          type: 'txt',
          name: 'file1'
        },
        {
          type: 'pdf',
          name: 'file2'
        },
        {
          type: 'word',
          name: 'file3'
        },
        {
          type: 'excel',
          name: 'file4'
        },
        {
          type: 'mp3',
          name: 'file5'
        },
        {
          type: 'mp4',
          name: 'file6'
        }
      ]
    }
  },
  methods: {
    showReferences() {
      this.isShowReferences = true
    },
    closeReferences() {
      this.isShowReferences = false
    }
  }
}
</script>

<style lang="scss">
.lesson-references-wrap {
  display: flex;
  align-items: center;
  cursor: pointer;
  .references {
    &-icon {
      display: inline-block;
      height: 16px;
      width: 23px;
      background: url('../../../assets/lessonImg/references.png') no-repeat
        center #fff;
    }
    &-title {
      color: #818181;
      font-weight: bold;
      margin-left: 10px;
    }
  }
}

.references-dialog {
  .references-file {
    display: flex;
    justify-content: center;
    border: 1px solid green;
    align-items: center;
    height: 50px;
  }
  .el-dialog__header {
    padding: 0;
    background: #409efe;
    .el-dialog__title {
      display: block;
      color: white;
      padding: 10px;
    }
    .el-dialog__headerbtn {
      top: 16px;
      .el-dialog__close {
        color: white;
      }
    }
  }
  .el-dialog__body {
    min-height: 350px;
  }
}
</style>


