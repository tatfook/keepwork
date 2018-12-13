<template>
  <el-dialog class="paracraft-info" :visible.sync="isDialogVisible" width="508px" :before-close="handleDialogClose">
    <div class="paracraft-info-content">
      <h1 class="paracraft-info-title">{{$t('common.paracraft')}}</h1>
      <div class="paracraft-info-intro">
        <p>{{$t('project.aFree3DCreationSoftware')}}</p>
        <p>{{$t('project.whatYouCanUseByParacraft')}}</p>
      </div>
      <div class="paracraft-info-operations">
        <a href='http://paracraft.keepwork.com/download?lang=zh' target="_blank" class="el-button el-button--warning">
          <span>{{$t('project.downloadParacraft')}}</span>
        </a>
        <a href='http://paracraft.keepwork.com/?lang=zh' target="_blank" class="el-button">
          <span>{{$t('project.knowMore')}}</span>
        </a>
      </div>
      <p class="paracraft-info-operate-info"><span class="paracraft-info-text-danger">*</span>{{$t('project.pleaseAgreeProtocol')}}</p>
      <div class="paracraft-info-operations">
        <el-button type="primary" @click="toParacraftWorld()">{{$t('project.open3DWorld')}}</el-button>
        <el-button v-if="isDownload" @click="toParacraftWorldZip()">{{$t('project.downloadedArchive')}}</el-button>
      </div>
      <p class="paracraft-info-operate-msg"><span class="paracraft-info-text-danger">*</span>{{$t('project.pleaseSignInToParacraft')}}</p>
      <p class="paracraft-info-operate-info"><span class="paracraft-info-text-danger">*</span>{{$t('project.pleasePutItUnderTheCatalogueToUse')}}</p>
    </div>
    <img class="paracraft-info-background-img paracraft-info-background-img-left-top" src="@/assets/img/paracraft_box.png" alt="">
    <img class="paracraft-info-background-img paracraft-info-background-img-right-bottom" src="@/assets/img/littepurple_box.png" alt="">
  </el-dialog>
</template>
<script>
import launchUri from '@/lib/utils/launchUri'

export default {
  name: 'ParacraftInfo',
  props: {
    isDialogVisible: {
      type: Boolean,
      required: true
    },
    paracraftUrl: String
  },
  computed: {
    isDownload() {
      let url = decodeURIComponent(this.paracraftUrl)
      if(url.indexOf('cmd/loadworld') === -1) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    toParacraftWorld() {
      if (this.paracraftUrl) {
        launchUri(this.paracraftUrl)
      }
    },
    toParacraftWorldZip() {
      let url = decodeURIComponent(this.paracraftUrl)
      let downloadWorldZip = url.substring(url.indexOf('https://'), url.lastIndexOf('.zip') + 4)
      launchUri(downloadWorldZip)
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
