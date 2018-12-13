<template>
  <el-dialog class="paracraft-info" :visible.sync="isDialogVisible" :before-close="handleDialogClose">
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
    launchUri(uri, successCallback, noHandlerCallback, unknownCallback) {
      let res, parent, popup, iframe, timer, timeout, blurHandler, timeoutHandler, browser;

      const callback = (cb) => {
        if (typeof cb === 'function') cb();
      }

      const createHiddenIframe = (parent) => {
        if (!parent) parent = document.body;
        iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        parent.appendChild(iframe);
        return iframe;
      }

      const removeHiddenIframe = (parent) => {
        if (!iframe) return;
        if (!parent) parent = document.body;
        parent.removeChild(iframe);
        iframe = null;
      }

      browser = { isChrome: false, isFirefox: false, isIE: false };

      if (window.chrome && !navigator.userAgent.match(/Opera|OPR\//)) {
        browser.isChrome = true;
      } else if (typeof InstallTrigger !== 'undefined') {
        browser.isFirefox = true;
      } else if ('ActiveXObject' in window) {
        browser.isIE = true;
      }

      // Blur hack (Chrome)
      if (browser.isChrome) {
        blurHandler = function () {
          window.clearTimeout(timeout);
          window.removeEventListener('blur', blurHandler);
          callback(successCallback);
        };
        timeoutHandler = function () {
          window.removeEventListener('blur', blurHandler);
          callback(noHandlerCallback);
        };
        window.addEventListener('blur', blurHandler);
        timeout = window.setTimeout(timeoutHandler, 500);
        window.location.href = uri;
      }
      // Catch NS_ERROR_UNKNOWN_PROTOCOL exception (Firefox)
      else if (browser.isFirefox) {
        iframe = createHiddenIframe();
        try {
          // if we're still allowed to change the iframe's location, the protocol is registered
          iframe.contentWindow.location.href = uri;
          callback(successCallback);
        } catch (e) {
          if (e.name === 'NS_ERROR_UNKNOWN_PROTOCOL') {
            callback(noHandlerCallback);
          } else {
            callback(unknownCallback);
          }
        } finally {
          removeHiddenIframe();
        }
      }
      // Open popup, change location, check wether we can access the location after the change (IE on Windows < 8)
      else if (browser.isIE) {
        popup = window.open('', 'launcher', 'width=0,height=0');
        popup.location.href = uri;
        try {
          // Try to change the popup's location - if it fails, the protocol isn't registered
          // and we'll end up in the `catch` block.
          popup.location.href = 'about:blank';
          callback(successCallback);
          // The user will be shown a modal dialog to allow the external application. While
          // this dialog is open, we cannot close the popup, so we try again and again until
          // we succeed.
          timer = window.setInterval(function () {
            popup.close();
            if (popup.closed) window.clearInterval(timer);
          }, 500);
        } catch (e) {
          // Regain access to the popup in order to close it.
          popup = window.open('about:blank', 'launcher');
          popup.close();
          callback(noHandlerCallback);
        }
      }
      // No hack we can use, just open the URL in an hidden iframe and invoke `unknownCallback`
      else {
        iframe = createHiddenIframe();
        iframe.contentWindow.location.href = uri;
        window.setTimeout(function () {
          removeHiddenIframe(parent);
          callback(unknownCallback);
        }, 500);
      }
    },
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
    display: inline-block;
    margin-bottom: 4px;
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
    margin-bottom: 40px;
    word-break:break-all;
    span {
      color: #f32323;
    }
  }
  &-operate-msg {
    font-size: 12px;
    color: #909399;
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
    width: 508px;
    margin-top: 160px !important;
  }
  .el-dialog__body {
    padding: 32px 22px 8px 184px;
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
