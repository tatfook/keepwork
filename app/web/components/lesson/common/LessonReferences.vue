<template>
  <div>
    <div @click="showReferences" class="lesson-references-wrap">
      <span class="references-icon"></span>
      <span class="references-title">{{$t('lesson.references')}}</span>
    </div>
    <el-dialog :append-to-body="true" class="references-dialog" center :visible.sync="isShowReferences" :title="$t('lesson.references')" @close="closeReferences" width="600px">
      <el-row v-if="false" style="z-index:999" :gutter="20">
        <el-scrollbar class="referencs-files-wrap" :native="false">
          <el-col :span="8" v-for="(file, index) in files" :key="index" class="references-file">
            <span class="file-type" :class="checkFileType(file.type)"></span>
            <span class="references-file-name">{{file.name}}</span>
          </el-col>
        </el-scrollbar>
      </el-row>
      <div v-else class="references-no-files">
        <img class="references-no-files-icon" src="@/assets/lessonImg/no_packages.png">
        <div class="references-no-files-title">{{$t('lesson.noReference')}}</div>
      </div>
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
          type: 'gif',
          name: 'file6'
        },
        {
          type: 'rar',
          name: 'file6'
        },
        {
          type: 'mp4',
          name: 'file6'
        },
        {
          type: 'movie',
          name: 'file6'
        },
        {
          type: 'mp411',
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
    },
    checkFileType(type) {
      switch (type) {
        case 'excel':
          return 'excel'
        case 'mp3':
          return 'mp3'
        case 'mp4':
          return 'mp4'
        case 'pdf':
          return 'pdf'
        case 'gif':
          return 'gif'
        case 'rar':
          return 'rar'
        case 'txt':
          return 'txt'
        case 'word':
          return 'word'
        case 'movie':
          return 'movie'
        default:
          return 'unknown'
      }
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
  .references-no-files {
    text-align: center;
    padding-top: 60px;
    &-icon {
      width: 220px;
    }
    &-title {
      font-size: 20px;
      margin-top: 20px;
    }
  }
  .el-dialog__body {
    padding: 0 10px 0;
  }
  .referencs-files-wrap {
    height: 500px;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .references-file {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    &-name {
      margin-top: 15px;
      cursor: pointer;
    }
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

.file-type {
  display: block;
  height: 129px;
  width: 111px;
  cursor: pointer;
  &.excel {
    background: url('../../../assets/lessonImg/fileType/excel.png') no-repeat
      center #fff;
  }
  &.gif {
    background: url('../../../assets/lessonImg/fileType/gif.png') no-repeat
      center #fff;
  }
  &.movie {
    background: url('../../../assets/lessonImg/fileType/movie.png') no-repeat
      center #fff;
  }
  &.mp3 {
    background: url('../../../assets/lessonImg/fileType/mp3.png') no-repeat
      center #fff;
  }
  &.mp4 {
    background: url('../../../assets/lessonImg/fileType/mp4.png') no-repeat
      center #fff;
  }
  &.pdf {
    background: url('../../../assets/lessonImg/fileType/mp4.png') no-repeat
      center #fff;
  }
  &.rar {
    background: url('../../../assets/lessonImg/fileType/rar.png') no-repeat
      center #fff;
  }
  &.txt {
    background: url('../../../assets/lessonImg/fileType/txt.png') no-repeat
      center #fff;
  }
  &.unknown {
    background: url('../../../assets/lessonImg/fileType/unknown.png') no-repeat
      center #fff;
  }
  &.word {
    background: url('../../../assets/lessonImg/fileType/word.png') no-repeat
      center #fff;
  }
}
</style>


