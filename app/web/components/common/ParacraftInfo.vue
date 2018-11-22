<template>
  <el-dialog class="paracraft-info" :visible.sync="isDialogVisible" width="508px" :before-close="handleDialogClose">
    <div class="paracraft-info-content">
      <h1 class="paracraft-info-title">paracraft创意空间</h1>
      <div class="paracraft-info-intro">
        <p>一款免费的3D创作软件</p>
        <p>你可以用它创建3D场景和人物，制作动画和游戏，学习和编写计算机程序</p>
      </div>
      <div class="paracraft-info-operations">
        <a href='http://paracraft.keepwork.com/download?lang=zh' target="_blank" class="el-button el-button--warning">
          <span>下载Paracraft</span>
        </a>
        <a href='http://paracraft.keepwork.com/?lang=zh' target="_blank" class="el-button">
          <span>了解更多</span>
        </a>
      </div>
      <p class="paracraft-info-operate-info"><span class="paracraft-info-text-danger">*</span>安装过程中系统会提示您安装url protocols，请同意。</p>
      <div class="paracraft-info-operations">
        <el-button type="primary" @click="toParacraftWorld">启动3D世界</el-button>
      </div>
      <p class="paracraft-info-operate-info"><span class="paracraft-info-text-danger">*</span>如果要编辑您的3D世界，请在Paracraft中登录后操作。</p>
    </div>
    <img class="paracraft-info-background-img paracraft-info-background-img-left-top" src="@/assets/img/paracraft_box.png" alt="">
    <img class="paracraft-info-background-img paracraft-info-background-img-right-bottom" src="@/assets/img/littepurple_box.png" alt="">
  </el-dialog>
</template>
<script>
export default {
  name: 'ParacraftInfo',
  props: {
    isDialogVisible: {
      type: Boolean,
      required: true
    },
    paracraftUrl: String
  },
  methods: {
    toParacraftWorld() {
      if (this.paracraftUrl) {
        let tempWin = window.open('_blank')
        tempWin.location = this.paracraftUrl
      }
    },
    handleDialogClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.paracraft-info {
  &-content {
    z-index: 1;
    position: relative;
  }
  &-title {
    font-size: 24px;
    color: #2397f3;
    margin: 0;
  }
  &-intro {
    margin: 16px 0 40px;
    p {
      margin: 8px 0;
      font-size: 14px;
      color: #303133;
      line-height: 20px;
    }
  }
  &-operations {
    .el-button {
      font-size: 13px;
      text-decoration: none;
    }
    .el-button + .el-button {
      margin-left: 13px;
    }
  }
  &-operate-info {
    font-size: 12px;
    color: #909399;
    margin: 16px 0 40px;
    span {
      color: #f32323;
    }
  }
  &-background-img {
    position: absolute;
    &-left-top {
      top: 0;
      left: 0;
    }
    &-right-bottom {
      bottom: 0;
      right: 0;
    }
  }
  .el-dialog {
    position: relative;
  }
  .el-dialog__body {
    padding: 32px 16px 8px 184px;
  }
}

@media (max-width: 768px) {
  .paracraft-info {
    .el-dialog {
      width: 95% !important;
    }
    .el-dialog__body {
      padding: 10px;
    }
    &-background-img {
      display: none;
    }
  }
}
</style>
