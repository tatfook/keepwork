<template>
  <div class="ppt-edit">
    <div class="ppt-edit-header">
      <el-button @click="handleAdd" class="ppt-edit-header-add" type="text" icon="el-icon-plus">添加</el-button>
      <span class="ppt-edit-header-type">
        图片/视频
      </span>
    </div>

    <div class="ppt-edit-list">
      <div class="ppt-edit-list-item">
        <img class="ppt-edit-list-item-img" src="http://api.dev.kp/storage/v0/siteFiles/364/raw#D0-0QdsU4AA29JD_.jpg" alt="">
        <div class="ppt-edit-list-item-operation hidden-operation">
          <el-button size="mini" round>{{$t('common.change')}}</el-button>
          <el-button size="mini" round icon="iconfont icon-delete"></el-button>
        </div>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PptEdit',
  methods: {
    handleAdd() {
      this.$message.info('haha')
    }
  },
  data() {
    return {
      pptList: [
        {
          type: '',
          url: ''
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.ppt-edit {
  &-header {
    &-add {
      font-size: 16px;
      /deep/ .el-icon-plus {
        background: rgb(186, 221, 255);
      }
      &:hover {
        /deep/ .el-icon-plus {
          color: #fff;
          background: rgb(83, 168, 255);
        }
      }
    }
    &-type {
      color: #909399;
    }
  }

  &-list {
    &-item {
      position: relative;
      cursor: pointer;
      &:hover {
        .hidden-operation {
          display: flex;
        }
      }
      &-img {
        object-fit: contain;
        width: 100%;
      }
      &-operation {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        background: rgba($color: #000000, $alpha: 0.2);
        &.hidden-operation {
          display: none;
        }
      }
    }
  }
}
</style>