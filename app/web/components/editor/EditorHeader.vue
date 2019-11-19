<template>
  <div class='editor-header'>
    <el-menu mode='horizontal'>
      <el-menu-item index="2">
        <el-dropdown placement="bottom-end" class="kp-dropdown-menu">
          <span class="el-dropdown-link">
            <img class='kp-logo' src='@/assets/img/logo.svg' alt='Menu'>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="kp-dropdown-menu-content">
            <el-dropdown-item>
              <div class="kp-menu-top">
                <div class="kp-icon">
                  <i class="iconfont icon-add1"></i>
                </div>
                <div class="kp-submenu-top-content">
                  <button @click.stop="openNewWebsiteDialog">{{$t('editor.newWebsite')}}</button>
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div :class="['kp-menu-top',currentDisabled ? 'isDisabled disabled-bgc':'']">
                <div class="kp-icon">
                  <i class="iconfont icon-setting"></i>
                </div>
                <div class="kp-submenu-top-content">
                  <button :disabled='currentDisabled' @click.stop="openWebsiteSettingDialog">{{$t('editor.setUpTheWebsite')}}</button>
                  <button :disabled='currentDisabled' @click.stop="goSettingPage">{{$t('editor.setUpThePage')}}</button>
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div :class="['kp-menu-top',currentDisabled ? 'isDisabled disabled-bgc':'']">
                <div class="kp-icon">
                  <i class="iconfont icon-delete1"></i>
                </div>
                <div class="kp-submenu-top-content">
                  <button :disabled='currentDisabled' @click="removeCurrentPage(currentPagePath)">{{$t('editor.deleteTheCurrentPage')}}</button>
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div :class="['kp-menu-top',isSaveAll ? 'isDisabled disabled-bgc':'']">
                <div class="kp-icon">
                  <i class="iconfont icon-save1"></i>
                </div>
                <div class="kp-submenu-top-content">
                  <button :disabled='isActivePageSaved' @click.stop="save">{{$t('editor.save')}}</button>
                  <button :disabled='isSaveAll' @click.stop="saveAllOpenedFiles">{{$t('editor.saveAll')}}</button>
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div :class="['kp-menu-top',currentDisabled ? 'isDisabled disabled-bgc':'']">
                <div class="kp-icon">
                  <i class="iconfont icon-close1"></i>
                </div>
                <div class="kp-submenu-top-content">
                  <button :disabled='currentDisabled' @click.stop="handleCloseConfirm">{{$t('editor.close')}}</button>
                  <button :disabled='currentDisabled' @click.stop="closeAllOpenedFilesConfirm">{{$t('editor.closeAll')}}</button>
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div class="kp-menu">
                <button @click.stop="refreshOpenedFile(activeFilePath)" :disabled='currentDisabled'>
                  <i class="iconfont icon-refresh1"></i>{{$t('editor.refresh')}}</button>
                <button @click.stop='undo' :disabled='!canUndo'>
                  <i class="iconfont icon-pre-step"></i>{{$t('editor.revoke')}}</button>
                <button @click.stop='redo' :disabled='!canRedo'>
                  <i class="iconfont icon-redo"></i>{{$t('editor.redo')}}</button>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div class="kp-menu">
                <button :disabled='currentDisabled' @click="changeView('ModsList')">
                  <i class="iconfont icon-mod"></i>{{$t('editor.modules')}}</button>
                <button :disabled='currentDisabled' @click="openSkyDriveManagerDialog">
                  <i class="iconfont icon-lfile"></i>{{$t('modList.bigFile')}}</button>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div class="kp-menu">
                <button :disabled='currentDisabled' @click='togglePreviewWin'>
                  <i class="iconfont icon-preview1"></i>{{$t('tips.ShowPreviewOnly')}}
                </button>
                <button :disabled='currentDisabled' @click='toggleBoth'>
                  <i class="iconfont icon-both"></i>{{$t('tips.ShowBoth')}}
                </button>
                <button :disabled='currentDisabled' @click='toggleCodeWin'>
                  <i class="iconfont icon-code1"></i>{{$t('tips.ShowCodeOnly')}}
                </button>
                <button :disabled='currentDisabled' @click='openZenMode'>
                  {{$t('tips.ShowZenMode')}}
                </button>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div class="kp-menu">
                <button>
                  <i class="iconfont icon-help"></i>
                  <a class="kp-menu-help" href="https://keepwork.com/official/help/index" target="_blank">{{$t('editor.help')}}</a>
                </button>
                <button :class=" isEnglish ? 'btn-language' : '' " @click="toggleLanguage">
                  <i :class="['iconfont', 'icon-Chinese-english', isEnglish ? 'icon-language' : '']"></i>
                  {{$t('common.chinese-englishSwitch')}}
                </button>
                <button :class=" isEnglish ? 'btn-angles' : '' " @click="toggleLeftAndRightAngles" :disabled="isWelcomeShow || !(isPreviewShow && isCodeShow)">
                  <i class="iconfont icon-qiehuan"></i>
                  {{$t('common.left-rightAngles')}}
                </button>
                <button :disabled='currentDisabled' :class=" isEnglish ? 'btn-angles' : '' " @click="showFileHistory">
                  <i class="iconfont icon-historyrecord"></i>
                  {{$t('common.oldVersions')}}
                </button>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div class="kp-menu">
                <button @click="backHome">
                  <i class="iconfont icon-home"></i>{{$t('editor.backHomePage')}}</button>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>
      <!-- TODO: 文件有新版本的时候，提示 -->
      <el-menu-item v-if="isConflict" index='3' class='li-btn conflict-btn'>
        <el-tooltip content="版本冲突，请先合并再保存">
          <span v-loading='savePending' class='iconfont icon-banbenchongtu' @click='onOpenMergePreview'></span>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item v-else index='3' class='li-btn save-btn' :disabled='isActivePageSaved'>
        <el-tooltip :content="$t('editor.save')">
          <span v-loading='savePending' class='iconfont icon-save' @click='save'></span>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index='4' class='li-btn' @click='undo' :disabled='!canUndo'>
        <el-tooltip :content="$t('editor.revoke')">
          <span class='iconfont icon-return'></span>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index='5' class='li-btn' @click='redo' :disabled='!canRedo'>
        <el-tooltip :content="$t('editor.redo')">
          <span class='iconfont icon-revocation'></span>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index='6' class="link-box" v-if="activePage && hasOpenedFiles">
        <el-tooltip :content="$t('tips.copyUrl')">
          <i class="iconfont icon-copy" @click='doCopyLink'></i>
        </el-tooltip>
        <el-tooltip :content="$t('tips.openInNewWindow')">
          <a :href='activePageFullUrl' target='_blank'>{{ activePageFullUrl }}</a>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index='7' class='unsaved-tip'>
        <!-- <span>{{ isActivePageSaved ? '' : $t('editor.unsavedTip') }}</span> -->
      </el-menu-item>
      <el-menu-item index='8' class='pull-right user-profile-box'>
        <user-portrait :width="40" :user="userProfile" size="small"></user-portrait>
      </el-menu-item>
      <el-menu-item v-if="!isWelcomeShow" index='9' class='switch-box'>
        <el-tooltip :content="$t('tips.ShowPreviewOnly')">
          <span class="iconfont icon-preview1" :class='{"switch-box-active": isPreviewShow && !isCodeShow}' @click="togglePreviewWin()"></span>
        </el-tooltip>
        <el-tooltip :content="$t('tips.ShowBoth')">
          <span class="iconfont icon-both" :class='{"switch-box-active": isPreviewShow && isCodeShow}' @click="toggleBoth()"></span>
        </el-tooltip>
        <el-tooltip :content="$t('tips.ShowCodeOnly')">
          <span class="iconfont icon-code1" :class='{"switch-box-active": !isPreviewShow && isCodeShow}' @click="toggleCodeWin()"></span>
        </el-tooltip>
      </el-menu-item>
    </el-menu>
    <new-website-dialog :show='isNewWebsiteDialogShow' @close='closeNewWebsiteDialog'></new-website-dialog>
    <div @click.stop v-if='isWebsiteSettingShow'>
      <website-setting-dialog :show='isWebsiteSettingShow' :sitePath='currentPath' @close='closeWebsiteSettingDialog'></website-setting-dialog>
    </div>
    <el-dialog center :visible.sync="dialogVisible" width="300px" closed="handleCloseDialog">
      <center v-if="closeOneFile">{{`"${fileName}" ${this.$t("editor.fileUnSaved")}`}}</center>
      <center v-else>{{`"${toBeCloseFileName}" ${this.$t("editor.fileUnSaved")}`}}</center>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click.stop="handleClose" :disabled="savePending">{{this.$t("editor.unSaveClose")}}</el-button>
        <el-button type="primary" @click.stop="saveHandleClose" :disabled="savePending">{{this.$t("editor.saveClose")}}</el-button>
      </span>
    </el-dialog>
    <editor-merge-preview v-if="isShowMergePreview" @close="onCloseMergePreivew"></editor-merge-preview>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Mousetrap from 'mousetrap'
import { gConst } from '@/lib/global'
import { toggleLanguage, locale } from '@/lib/utils/i18n'
import NewWebsiteDialog from '@/components/common/NewWebsiteDialog'
import WebsiteSettingDialog from '@/components/common/WebsiteSettingDialog'
import EditorMergePreview from './EditorMergePreview'
import UserPortrait from '@/components/common/UserPortrait'

export default {
  name: 'EditorHeader',
  data: function() {
    return {
      savePending: false,
      refreshPending: false,
      isNewWebsiteDialogShow: false,
      isWebsiteSettingShow: false,
      dialogVisible: false,
      closeOneFile: false,
      toBeCloseFileName: '',
      toBeCloseFilePath: '',
      gConst,
      nowOrigin: document.location.origin
    }
  },
  mounted() {
    Mousetrap.unbind('mod+s')
    Mousetrap.bind('mod+s', () => {
      this.isConflict ? this.onOpenMergePreview(true) : this.save()
      // this.save()
      return false
    })
    Mousetrap.unbind('mod+z')
    Mousetrap.bind('mod+z', () => {
      this.undo()
      return false
    })
    Mousetrap.unbind('mod+y')
    Mousetrap.bind('mod+y', () => {
      this.redo()
      return false
    })
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      showingCol: 'showingCol',
      activePageInfo: 'activePageInfo',
      isConflict: 'isActivePageHasConflict',
      canUndo: 'canUndo',
      canRedo: 'canRedo',
      openedFiles: 'openedFiles',
      activeAreaData: 'activeAreaData',
      activeAreaFile: 'activeAreaFile',
      activePage: 'activePage',
      hasOpenedFiles: 'hasOpenedFiles',
      isCodeShow: 'isCodeShow',
      isPreviewShow: 'isPreviewShow',
      getSiteLayoutConfigBySitePath: 'user/siteLayoutConfigBySitePath',
      showAngle: 'showAngle',
      updateRecentUrlList: 'updateRecentUrlList',
      isShowMergePreview: 'isShowMergePreview'
    }),
    isWelcomeShow() {
      return !this.activePageInfo.sitename
    },
    isEnglish() {
      return locale === 'en-US' ? true : false
    },
    activeFilePath() {
      return { path: this.currentPagePath }
    },
    currentDisabled() {
      return !(this.activePage && this.hasOpenedFiles)
    },
    fileName() {
      return this.activePageInfo.sitename + '/' + this.activePageInfo.pagename
    },
    currentPath() {
      return this.activePageInfo.sitepath
    },
    currentPagePath() {
      return this.activePageInfo.barePath
    },
    hasUnSaveOpenedFiles() {
      return this.unSavedOpenedFiles.length > 0
    },
    isSaveAll() {
      return this.unSavedOpenedFiles.length === 0
    },
    unSavedOpenedFiles() {
      return _.filter(_.values(this.openedFiles), ({ saved }) => !saved)
    },
    unSavedOpenedFilesPaths() {
      return _.map(this.unSavedOpenedFiles, ({ path }) => `${path}.md`.slice(1))
    },
    showingType() {
      if (
        this.showingCol.isCodeShow === false &&
        this.showingCol.isPreviewShow === true
      ) {
        return this.$t('editor.preview')
      }
      if (
        this.showingCol.isCodeShow === true &&
        this.showingCol.isPreviewShow === false
      ) {
        return this.$t('editor.code')
      }
      if (
        this.showingCol.isCodeShow === true &&
        this.showingCol.isPreviewShow === true
      ) {
        return this.$t('editor.splitScreen')
      }
    },
    activePageFullUrl() {
      let { fullPath = '' } = this.activePageInfo
      let url = `${this.nowOrigin}/${fullPath}`
      return (url || '').replace(/\.md$/, '')
    },
    isActivePageSaved() {
      let { saved } = this.activeAreaFile || {}
      return saved === false ? false : true
    }
  },
  methods: {
    ...mapActions({
      saveActivePage: 'saveActivePage',
      undo: 'undo',
      redo: 'redo',
      setActiveManagePaneComponent: 'setActiveManagePaneComponent',
      savePageByPath: 'savePageByPath',
      closeOpenedFile: 'closeOpenedFile',
      closeAllOpenedFile: 'closeAllOpenedFile',
      toggleSkyDrive: 'toggleSkyDrive',
      resetShowingCol: 'resetShowingCol',
      refreshOpenedFile: 'refreshOpenedFile',
      gitlabRemoveFile: 'gitlab/removeFile',
      userGetSiteLayoutConfig: 'user/getSiteLayoutConfig',
      userDeletePagesConfig: 'user/deletePagesConfig',
      toggleFileHistoryVisibility: 'toggleFileHistoryVisibility',
      toggleAngles: 'toggleAngles',
      addRecentOpenedSiteUrl: 'addRecentOpenedSiteUrl',
      toggleMergePreview: 'toggleMergePreview'
    }),
    onOpenMergePreview() {
      this.toggleMergePreview(true)
    },
    onCloseMergePreivew() {
      this.toggleMergePreview(false)
    },
    openZenMode() {
      const dom = document.querySelector('#codeWin')

      if (!dom) {
        return false
      }

      this.resetShowingCol({
        isZenMode: true
      })

      this.$fullscreen.toggle(dom, {
        wrap: false,
        fullscreenClass: 'zenmode',
        callback: state => {
          if (!state) {
            this.resetShowingCol({
              isZenMode: false
            })
            const vscroolbar = dom.querySelector('.CodeMirror-vscrollbar')
            // Is very strange. when I set display none, scroolbar is normally
            vscroolbar.style.display = 'none'
          }
        }
      })
    },
    toggleBoth() {
      this.resetShowingCol({
        isPreviewShow: true,
        isCodeShow: true,
        isManagerShow: true
      })
    },
    toggleCodeWin() {
      this.resetShowingCol({
        isPreviewShow: false,
        isCodeShow: true,
        isManagerShow: true
      })
    },
    togglePreviewWin() {
      this.resetShowingCol({
        isPreviewShow: true,
        isCodeShow: false,
        isManagerShow: true
      })

      // we should improve performance
      // this.isCodeShow &&
      //   this.$store.dispatch('setAddingArea', {
      //     area: this.gConst.ADDING_AREA_ADI
      //   })
    },
    toggleLeftAndRightAngles() {
      if (!this.showAngle) {
        this.toggleAngles({ showAngle: true })
      } else {
        this.toggleAngles({ showAngle: false })
      }
    },
    showFileHistory() {
      this.toggleFileHistoryVisibility({ isVisible: true })
    },
    async save() {
      let self = this

      if (this.isActivePageSaved) {
        return
      }
      if (!this.savePending) {
        this.savePending = true
        await this.saveActivePage()
          .then(() => {
            this.$message({
              showClose: true,
              message: self.$t('editor.saveSuccess'),
              type: 'success'
            })
          })
          .catch(e => {
            console.log(e)
            this.$message({
              showClose: true,
              message: self.$t('editor.saveFail'),
              type: 'error'
            })
          })
        this.savePending = false
      }
    },
    openNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = true
    },
    closeNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = false
    },
    openWebsiteSettingDialog() {
      this.isWebsiteSettingShow = true
    },
    closeWebsiteSettingDialog() {
      this.isWebsiteSettingShow = false
    },
    goSettingPage() {
      this.setActiveManagePaneComponent({
        name: 'PageSetting',
        props: {
          pagePath: this.currentPagePath
        }
      })
    },
    removeCurrentPage(path) {
      let pathArr = path.split('/')
      let siteName = pathArr.slice(1, 2).join()
      let pageName = pathArr.slice(-1).join()
      const h = this.$createElement
      this.$msgbox({
        title: this.$t('editor.modDelMsgTitle'),
        message: h('p', null, [
          h('span', null, `${this.$t('editor.delConfirm')}`),
          h('span', { style: 'color: #FF4342' }, ` "${siteName}/${pageName}" `),
          h('span', null, `${this.$t('editor.page')}?`)
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t('el.messagebox.confirm'),
        cancelButtonText: this.$t('el.messagebox.cancel')
      })
        .then(async () => {
          this.deletePending = true
          await this.gitlabRemoveFile({ path: `${path}.md` }).catch(e => {
            this.$message.error(this.$t('editor.deleteFail'))
            this.deletePending = false
          })
          await this.deletePagesFromLayout({ paths: [path] })
          this.removeRecentOpenFile(path)
          this.resetPage(path)
          this.deletePending = false
        })
        .catch(e => console.error(e))
    },
    async deletePagesFromLayout({ paths = [] }) {
      const re = /^\w+\/\w+\//
      let sitePath = paths[0].match(re)
      if (sitePath) sitePath = sitePath[0].replace(/\/$/, '')
      let pages = _.map(paths, page => page.replace(re, ''))
      await this.userGetSiteLayoutConfig({ path: sitePath })
      let config = this.getSiteLayoutConfigBySitePath(sitePath)
      await this.userDeletePagesConfig({ sitePath, pages })
    },
    removeRecentOpenFile(path) {
      let delPath = `/${path.replace(/\.md$/, '')}`
      let updateRecentUrlList = this.updateRecentUrlList.filter(
        item => item.path !== delPath
      )
      this.addRecentOpenedSiteUrl({ updateRecentUrlList })
    },
    async saveAllOpenedFiles() {
      if (!this.hasUnSaveOpenedFiles) return
      let num = this.unSavedOpenedFilesPaths.length
      let paths = this.unSavedOpenedFilesPaths
      let isSuccess = true
      this.savePending = true
      while (num--) {
        await this.savePageByPath(paths[num]).catch(e => {
          this.$message.error(this.$t('editor.saveFail'))
          isSuccess = false
        })
      }
      isSuccess &&
        this.$message({
          message: this.$t('editor.saveSuccess'),
          type: 'success'
        })
      this.savePending = false
    },
    handleCloseOpenedFile() {
      let path = _.get(this.activePageInfo, 'fullPath', '')
      this.closeAndReset(path)
      this.handleCloseDialog()
      this.closeOneFile = false
    },
    async saveAndCloseOpenedFile() {
      let path = this.activePageInfo.fullPath
      this.savePending = true
      await this.savePageByPath(path)
        .then(() => {
          this.closeAndReset(path)
          this.handleCloseDialog()
          this.savePending = false
          this.closeOneFile = false
        })
        .catch(e => {
          this.$message.error(this.$t('editor.saveFail'))
          this.handleCloseDialog()
          this.savePending = false
        })
    },
    async closeAllOpenedFilesConfirm() {
      if (this.unSavedOpenedFilesPaths.length > 0) {
        this.dialogVisible = true
        let path = this.unSavedOpenedFilesPaths[0]
        let siteName = path
          .split('/')
          .slice(1, 2)
          .join()
        let fileName = path
          .split('/')
          .slice(-1)
          .join()
          .replace(/\.md$/, '')
        this.toBeCloseFileName = `${siteName}/${fileName}`
        this.toBeCloseFilePath = path
      } else {
        this.$router.push('/')
        this.closeAllOpenedFile()
      }
    },
    handleCloseOpenedFileAndNext() {
      let path = this.toBeCloseFilePath
      path && this.closeAndResetFile(path)
      this.checkHasNext()
    },
    async saveAndCloseOpenedFileAndNext() {
      this.savePending = true
      let path = this.toBeCloseFilePath
      await this.savePageByPath(path)
        .then(() => {
          this.closeAndResetFile(path)
          this.savePending = false
          this.checkHasNext()
        })
        .catch(e => {
          this.$message.error(this.$t('editor.saveFail'))
          this.handleCloseAllDialog()
          this.savePending = false
        })
    },
    handleClose() {
      return this.closeOneFile
        ? this.handleCloseOpenedFile()
        : this.handleCloseOpenedFileAndNext()
    },
    saveHandleClose() {
      return this.closeOneFile
        ? this.saveAndCloseOpenedFile()
        : this.saveAndCloseOpenedFileAndNext()
    },
    closeAndResetFile(path) {
      let _path = Object.keys(this.openedFiles).filter(name => name !== path)
      this.closeOpenedFile({ path })
      if (this.$route.path.slice(1) !== path.replace(/\.md$/, '')) return
      if (_path.length === 0) {
        this.$router.push('/')
      } else {
        this.$router.push('/' + _path[0].replace(/\.md$/, ''))
      }
    },
    checkHasNext() {
      if (this.unSavedOpenedFilesPaths.length > 0) {
        this.closeAllOpenedFilesConfirm()
      } else {
        this.closeAllOpenedFile()
        this.dialogVisible = false
        this.$router.push('/')
      }
    },
    doCopyLink() {
      let that = this
      let toCopyLink = this.activePageFullUrl
      this.$copyText(toCopyLink).then(
        function(e) {
          that.$message({
            showClose: true,
            message: that.$t('editor.copySuccess'),
            type: 'success'
          })
        },
        function(e) {
          console.log(e)
          that.$message({
            showClose: true,
            message: that.$t('editor.copyFail'),
            type: 'error'
          })
        }
      )
    },
    handleCloseDialog() {
      this.dialogVisible = false
    },
    async handleCloseConfirm() {
      this.closeOneFile = true
      let path = _.get(this.activePageInfo, 'fullPath', '')
      if (this.isActivePageSaved) {
        this.closeAndReset(path)
      } else {
        this.dialogVisible = true
      }
    },
    closeAndReset(path) {
      let _path = Object.keys(this.openedFiles).filter(name => name !== path)
      this.closeOpenedFile({ path })
      if (this.$route.path.slice(1) !== path.replace(/\.md$/, '')) return
      _path.length === 0
        ? this.$router.push('/')
        : this.$nextTick(() =>
            this.$router.push({ path: `/${_path[0].replace(/\.md$/, '')}` })
          )
    },
    changeView(type) {
      this.setActiveManagePaneComponent(type)
    },
    openSkyDriveManagerDialog() {
      this.toggleSkyDrive({ showSkyDrive: true })
    },
    toggleLanguage,
    backHome() {
      window.location.href = this.nowOrigin
    },
    resetPage(currentPath = null) {
      if (
        currentPath &&
        currentPath.replace(/\.md$/, '') === this.$route.path.substring(1)
      ) {
        return this.$router.push('/')
      }
    }
  },
  components: {
    NewWebsiteDialog,
    WebsiteSettingDialog,
    UserPortrait,
    EditorMergePreview
  }
}
</script>

<style lang="scss" scoped>
.kp-dropdown-menu {
  padding: 0 0 0 10px;
}
.kp-dropdown-menu:hover {
  background-color: rgba(40, 140, 233, 0.1);
}
.el-menu-item.is-active {
  border-bottom: none;
}
.unsaved-tip {
  display: inline-flex;
  align-items: center;
}
.unsaved-tip span {
  line-height: 1.7em;
  position: relative;
  top: 0.3em;
  border-bottom: 2px solid #f7bc2a !important;
}
.save-btn:not(.is-disabled) .icon-save {
  background: #f7bc2a;
  border-color: #f7bc2a;
  color: white;
}
.conflict-btn:not(.is-disabled) .icon-banbenchongtu {
  background: #f7bc2a;
  border-color: #f7bc2a;
  color: white;
}
.el-dropdown-link {
  display: inline-block;
  height: 60px;
}
.kp-logo {
  width: 127px;
}
.el-dropdown-menu__item {
  line-height: 24px;
  padding: 0;
}
.el-dropdown-menu__item:hover {
  color: inherit;
  background-color: inherit;
}

.li-btn {
  padding: 0 8px;
}
.btn {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
}
.pull-right {
  float: right !important;
}
.user-profile-box {
  padding-right: 0;
}
.input-link-copy-box {
  display: inline-block;
  width: 367px;
  border: 1px solid #dcdfe6;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  padding: 0 16px;
}
.input-link-copy-box a {
  color: #288ce9;
  text-decoration: none;
}
.dropdown-btn {
  font-size: 16px;
  padding: 10px;
}
.dropdown-arrow {
  font-size: 12px;
  margin: 0 6px 0 10px;
  width: auto;
  margin-left: 0px;
}
.iconfont {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 21px;
  color: #666;
}
.link-box .iconfont {
  border: none;
}
.link-box a {
  text-decoration: none;
}
.link-box .iconfont:hover,
.link-box a:hover {
  color: #429efd;
}
.switch-box {
  float: right;
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-right: 15px;
  padding-left: 6px;
  padding-right: 6px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  border-bottom: none;
  background-color: #efefef !important;
  .iconfont {
    width: 60px;
    height: 32px;
    line-height: 32px;
    border: none;
  }
  &-active {
    background-color: #1278e1;
    color: #fff;
    border-radius: 16px;
  }
}
</style>
<style lang="scss">
.logo-submenu {
  .el-menu .el-submenu__title,
  a {
    color: #909399;
  }
  a {
    text-decoration: none;
  }
  .el-menu .el-submenu__title:hover,
  a:hover {
    color: #303133;
  }
}
.kp-menu-top {
  display: flex;
  &:hover {
    .kp-icon {
      background-color: rgba(40, 140, 233, 0.1);
      .iconfont {
        color: #409eff;
      }
    }
  }
  &.disabled-bgc:hover {
    .kp-icon {
      background-color: #f5f5f5;
    }
  }
  .kp-icon {
    width: 20px;
    padding: 0 4px 0 20px;
    height: 24px;
    .iconfont {
      border: none;
      line-height: 24px;
      width: 0;
      font-size: inherit;
    }
  }
  .kp-submenu-top-content {
    flex: 1;
    button {
      width: 100%;
      height: 24px;
      border: none;
      background-color: transparent;
      text-align: left;
      color: #909399;
      border-left: 1px solid #ccc;
      margin-top: -1px;
      padding: 0 0 0 10px;
      cursor: pointer;
      &:focus {
        outline: none;
      }
      &:hover {
        background-color: rgba(40, 140, 233, 0.1);
        color: #409eff;
      }
      &[disabled] {
        color: #ccc;
        cursor: default;
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }
}
.isDisabled {
  .iconfont {
    color: #ccc !important;
  }
  &:hover {
    .kp-icon {
      .iconfont {
        color: #ccc !important;
      }
    }
  }
}
.kp-dropdown-menu-content {
  &.el-popper[x-placement^='bottom'] {
    min-width: 164px;
    max-width: 216px;
    left: 40px !important;
  }
  .el-dropdown-menu__item {
    cursor: default;
  }
  .el-dropdown-menu__item--divided:before {
    margin: 0;
  }
}
.kp-menu button {
  display: block;
  width: 100%;
  height: 24px;
  border: none;
  background-color: transparent;
  color: #909399;
  position: relative;
  cursor: pointer;
  text-align: left;
  padding-left: 56px;
  .kp-menu-help {
    display: inline-block;
    width: 100%;
    height: 24px;
    line-height: 24px;
  }
  .iconfont {
    border: none;
    font-size: 14px;
    width: 0;
    height: 0;
    line-height: 24px;
    position: absolute;
    left: 20px;
    top: 0;
  }
  &:hover {
    color: #409eff;
    background-color: rgba(40, 140, 233, 0.1);
    .iconfont {
      color: #409eff;
    }
  }
  &:focus {
    outline: none;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
}
.kp-menu button[disabled] {
  &:hover {
    background-color: #f5f5f5;
  }
  color: #ccc;
  cursor: default;
  .iconfont {
    color: #ccc;
  }
}
.kp-menu {
  .btn-language,
  .btn-angles {
    height: 48px;
    .iconfont {
      line-height: 48px;
    }
  }
}
</style>
