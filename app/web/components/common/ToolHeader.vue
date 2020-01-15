<template>
  <div class="tool-header">
    <div class="breadcrumb" v-loading='breadcrumbsLoading'>
      <a class="breadcrumb-item iconfont icon-home-keepwork" href="/"></a>
      <span class="breadcrumb-separator el-icon-arrow-right" role="presentation"></span>
      <a class="breadcrumb-item" :href="`/u/${activePageInfo.username}`">{{activePageInfo.username}}</a>
      <span class="breadcrumb-separator el-icon-arrow-right" role="presentation"></span>
      <el-dropdown trigger="click" class="breadcrumb-item" placement="bottom-start" @command="pushNewUrl" @visible-change="getSiteList">
        <span class="page-item-content">
          {{siteDisplayName}}<i class="el-icon-arrow-down el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu v-loading="isGettingSite" class="breadcrumb-item-dropdown" slot="dropdown">
          <el-dropdown-item v-for='(site,index) in siteList' :key='index' :command="site">
            <span class="list-content">{{index === 0 ? site.name : (site.displayName || site.name)}}</span>
            <i class="iconfont icon-private" v-if="site.visibility===1"></i>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="breadcrumb-item" v-for='(pathItem, index) in activePageInfo.paths' :key='index'>
        <span class="breadcrumb-separator el-icon-arrow-right" role="presentation"></span>
        <el-dropdown trigger="click" placement="bottom-start" @command="handleBreadcrumbClick" @visible-change="getSiteFileTree">
          <span class="page-item-content">
            {{pathItem | hideMarkdownExt}}<i class="el-icon-arrow-down el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu v-loading="isFileDropdownLoading" class="breadcrumb-item-dropdown" slot="dropdown">
            <el-dropdown-item class="file-list-item" v-for='(file,childIndex) in siteFileTree[index]' :key='childIndex' :command="file">
              {{file.isTree ? `${file.name}/` : file.name | hideMarkdownExt}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="icons">
      <a :href="editorPageUrl" class="icon-item">
        <el-tooltip v-if="!isEditable()" :content="$t('editor.checkCode')">
          <i class="iconfont el-icon-view"></i>
        </el-tooltip>
        <el-tooltip v-if="isEditable()" :content="$t('editor.toEdit')">
          <i class="iconfont icon-edit"></i>
        </el-tooltip>
      </a>
      <span v-if="!IS_GLOBAL_VERSION" class="icon-item" v-popover:share>
        <el-tooltip :content="$t('editor.share')">
          <i class="iconfont icon-Share"></i>
        </el-tooltip>
      </span>
      <el-popover ref='share' trigger='click' @show='showSocialShare' width='130'>
        <div class="kp-social-share"></div>
      </el-popover>
    </div>
    <div @click.stop v-if="isLoginDialogShow">
      <login-dialog :show="isLoginDialogShow" @close="closeLoginDialog"></login-dialog>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import 'social-share.js/dist/js/social-share.min.js'
import 'social-share.js/dist/css/share.min.css'
import LoginDialog from '@/components/common/LoginDialog'
import { mapGetters, mapActions } from 'vuex'
const IS_GLOBAL_VERSION = !!process.env.IS_GLOBAL_VERSION

export default {
  name: 'ToolHeader',
  mounted() {
    if (!this.userIsLogined) {
      this.getProfile({ forceLogin: false })
        .then(() => {
          this.isLogin = true
        })
        .catch(() => {
          this.isLogin = false
        })
    }
  },
  data() {
    return {
      IS_GLOBAL_VERSION,
      starPending: false,
      breadcrumbsLoading: false,
      isLoginDialogShow: false,
      isFileDropdownLoading: false,
      isGettingSite: false
    }
  },
  computed: {
    ...mapGetters({
      activePageUrl: 'activePageUrl',
      activePageInfo: 'activePageInfo',
      displayUsername: 'user/displayUsername',
      activePageStarInfo: 'user/activePageStarInfo',
      getSiteDetailInfoByPath: 'user/getSiteDetailInfoByPath',
      gitlabChildrenByPath: 'gitlab/childrenByPath',
      userGetDetailByUsername: 'user/getDetailByUsername',
      personalAndContributedSiteNameList:
        'user/personalAndContributedSiteNameList',
      userIsLogined: 'user/isLogined'
    }),
    isLogin: {
      get() {
        return this.userIsLogined
      },
      set() {}
    },
    siteDisplayName() {
      let { sitepath } = this.activePageInfo
      if (!sitepath) {
        return
      }
      let siteDetailInfo = this.getSiteDetailInfoByPath(sitepath)
      if (!siteDetailInfo) return
      let siteDisplayName = _.get(siteDetailInfo, 'siteinfo.displayName')
      let name = _.get(siteDetailInfo, 'siteinfo.sitename')
      if (
        siteDetailInfo.siteinfo &&
        siteDetailInfo.siteinfo.domain === 'paracraft'
      ) {
        siteDisplayName = 'paracraft'
      }
      return siteDisplayName || name
    },
    sitePath() {
      let { sitepath } = this.activePageInfo
      return sitepath
    },
    breadcrumbs() {
      let { username, sitename, paths = [] } = this.activePageInfo
      if (paths.length <= 0) return []
      let breadcrumbs = paths.map((path, index) => {
        let currentPath = [username, sitename, ...paths.slice(0, index)].join(
          '/'
        )
        return this.gitlabChildrenByPath(currentPath)
      })
      return breadcrumbs
    },
    siteFileTree() {
      let { username, sitename, paths = [] } = this.activePageInfo
      if (paths.length <= 0) return []
      const siteFileTree = paths.map((path, index) => {
        if (index === 0) {
          return this.gitlabChildrenByPath()
        }
        let currentPath = [username, sitename, ...paths.slice(0, index)].join(
          '/'
        )
        const data =  this.gitlabChildrenByPath(currentPath)
        return data
      })
      return siteFileTree
    },
    locationOrigin() {
      return location.origin
    },
    editorPageUrl() {
      return `/ed${this.activePageUrl}`
    },
    siteList() {
      let { username } = this.activePageInfo
      return _.get(this.userGetDetailByUsername(username), 'allSiteList', [])
    }
  },
  methods: {
    ...mapActions({
      starPages: 'user/starPages',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree',
      getUserDetailByUsername: 'user/getUserDetailByUsername',
      getProfile: 'user/getProfile'
    }),
    isEditable() {
      if (
        !this.userIsLogined &&
        !this.personalAndContributedSiteNameList &&
        !this.activePageInfo
      ) {
        return false
      }

      let editable
      _.forEach(this.personalAndContributedSiteNameList, (value, key) => {
        if (this.activePageInfo.sitename === value) {
          editable = value
        }
      })

      if (editable) {
        return true
      } else {
        return false
      }
    },
    pushNewUrl(site) {
      window.location.href = `/${site.username}/${site.name}`
    },
    showSocialShare() {
      let { username: siteUsername, sitename } = this.activePageInfo
      window.socialShare('.kp-social-share', {
        mode: 'prepend',
        description:
          this.$t('common.iShare') +
          `${siteUsername}` +
          this.$t('common.shareToYouA'),
        title:
          `${this.displayUsername}` +
          this.$t('common.shareToYouB') +
          `${siteUsername}` +
          this.$t('common.maded') +
          `${siteUsername}` +
          this.$t('common.websiteB'),
        sites: ['qq', 'qzone', 'weibo', 'wechat'],
        wechatQrcodeTitle: '', // 微信二维码提示文字
        wechatQrcodeHelper: this.$t('common.QR')
      })
    },
    async togglePageStar() {
      this.starPending = true
      if (!this.isLogin) {
        this.isLoginDialogShow = true
        this.starPending = false
        return
      }
      await this.starPages({
        url: this.activePageUrl
      }).catch(e => {
        console.log(e)
        this.$message({
          showClose: true,
          message: this.$t('common.error'),
          type: 'error'
        })
      })
      this.starPending = false
    },
    handleBreadcrumbClick(file) {
      let targetFile = file
      if (file.isTree) {
        let children = file.children
        let indexChild = children.filter(file => file.name === 'index.md')[0]
        let firstFileTypeChild = children.filter(
          file => file.isBlob
        )[0]
        targetFile =
          indexChild || firstFileTypeChild || children[0] || targetFile
      }

      let url =
        targetFile && targetFile.path && targetFile.path.replace(/\.md$/, '')
      if (!url) return
      this.$router.push('/' + url)
    },
    closeLoginDialog() {
      this.isLoginDialogShow = false
    },
    async getSiteList(visible) {
      if (!visible) return
      this.isGettingSite = true
      try {
        let { username } = this.activePageInfo
        await this.getUserDetailByUsername({ username })
      } catch (error) {}
      this.isGettingSite = false
    },
    async getSiteFileTree(visible) {
      let { sitepath } = this.activePageInfo
      if (!sitepath || !visible) return
      this.isFileDropdownLoading = true
      try {
        await this.gitlabGetRepositoryTree({
          path: sitepath,
          editorMode: false
        })
      } catch (error) {}
      this.isFileDropdownLoading = false
    }
  },
  filters: {
    hideMarkdownExt: (str = '') => str.replace(/\.md$/, '')
  },
  components: {
    LoginDialog
  }
}
</script>
<style lang="scss">
.breadcrumb-item-dropdown {
  padding: 16px 0;
  min-width: 40px;
  border-color: #e4e7ed;
  max-height: 380px;
  overflow: auto;
  .list-content {
    display: initial;
    padding: 0;
  }
  .file-list-item {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
  .icon-private {
    float: right;
    margin-left: 15px;
    font-size: 18px;
  }
}
.tool-header {
  position: relative;
  height: 50px;
  .breadcrumb {
    display: inline-block;
    padding: 0 200px 0 20px;
    height: 52px;
    line-height: 52px;
    .el-loading-spinner {
      top: 35%;
      transform: scale(0.4);
    }
  }
  .breadcrumb-item {
    display: inline-block;
  }
  .el-dropdown {
    color: #909399;
    display: inline-block;
  }
  .page-item-content {
    padding: 0 10px 0 16px;
    border: 1px solid #dcdfe6;
    display: inline-block;
    height: 28px;
    line-height: 26px;
    border-radius: 30px;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 14px;
  }
  .page-item-content:hover {
    color: #0081ba;
    border-color: #cce6f1;
  }
  .icon-home-keepwork {
    font-size: 22px;
    vertical-align: middle;
    top: -2px;
    position: relative;
  }
  .breadcrumb-separator {
    color: #dbdbdb;
    padding: 0 6px;
  }
  .icons {
    position: absolute;
    right: 0;
    top: 0;
  }
  .icon-item {
    line-height: 1;
    padding: 10px 8px;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    color: #2c3e50;
  }
  .icon-item .iconfont {
    font-size: 30px;
    vertical-align: middle;
  }
  .icon-item .iconfont.active {
    color: #fe7532;
  }
  a {
    color: #606266;
    text-decoration: none;
    font-size: 14px;
  }
  .el-dropdown-link:hover,
  a:hover {
    color: #0081ba;
    cursor: pointer;
  }
}

.kp-social-share.social-share {
  text-align: center;

  .icon-wechat {
    visibility: hidden;
    height: 150px;

    .wechat-qrcode {
      top: 0;
      left: -40px;
      width: 110px;
      background-color: transparent;
      box-shadow: none;
      border: none;
      visibility: visible;
      display: block;
      height: 165px;
    }
    .wechat-qrcode::after {
      content: none;
    }
    h4 {
      display: none;
    }
  }
}
</style>
<style lang="scss" scoped>
@media (max-width: 768px) {
  .tool-header {
    height: auto;
    .breadcrumb {
      height: 40px;
      line-height: 40px;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      max-width: 100%;
      box-sizing: border-box;
      padding: 0 15px;
    }
    .icons {
      position: relative;
      text-align: right;
      padding-right: 15px;
    }
    .icon-item {
      padding: 0 8px;
      .iconfont {
        font-size: 20px;
      }
    }
    img {
      width: 20px;
    }
  }
}
@media print {
  .tool-header {
    display: none;
  }
}
</style>
