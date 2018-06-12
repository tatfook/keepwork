<template>
  <div class="tool-header">
    <div class="breadcrumb" v-loading='breadcrumbsLoading'>
      <a class="breadcrumb-item iconfont icon-home-keepwork" href="/"></a>
      <span class="breadcrumb-separator el-icon-arrow-right" role="presentation"></span>
      <a class="breadcrumb-item" :href="'/' + activePageInfo.username">{{activePageInfo.username}}</a>
      <span class="breadcrumb-separator el-icon-arrow-right" role="presentation"></span>
      <!-- <a class="breadcrumb-item" :href="'/' + activePageInfo.username + '/' + activePageInfo.sitename">{{activePageInfo.sitename}}</a> -->
      <div class="breadcrumb-item">
        <el-popover placement="bottom-start" popper-class="breadcrumb-item-dropdown">
          <ul class="file-list-content">
            <li class="file-list-item" v-for='site in siteList' :key='site.name'>
              <a :href="`/${site.username}/${site.name}`">
                <i class="iconfont icon-private" v-if="site.visibility==='private'"></i> {{site.displayName || site.name}}
              </a>
            </li>
          </ul>
          <span class="page-item-content" slot="reference">
            {{activePageInfo.sitename}}
            <i class="el-icon-arrow-down el-icon-caret-bottom"></i>
          </span>
        </el-popover>
      </div>

      <div class="breadcrumb-item" v-for='(fileList, index) in breadcrumbs' :key='index'>
        <span class="breadcrumb-separator el-icon-arrow-right" role="presentation"></span>
        <el-popover placement="bottom-start" popper-class="breadcrumb-item-dropdown">
          <ul class="file-list-content">
            <li class="file-list-item" v-for='file in fileList' :key='file.name' @click="handleBreadcrumbClick(file)">{{file.type == 'tree' ? `${file.name}/` : file.name | hideMarkdownExt}}</li>
          </ul>
          <span class="page-item-content" slot="reference">
            {{activePageInfo.paths[index] | hideMarkdownExt}}
            <i class="el-icon-arrow-down el-icon-caret-bottom"></i>
          </span>
        </el-popover>
      </div>
    </div>

    <div class="icons">
      <a :href="'/wiki/wikieditor/#' + activePageUrl" class="icon-item">
        <img src="http://keepwork.com/wiki/assets/imgs/icon/wiki_edit.png" alt="">
      </a>
      <img v-popover:share class="icon-item" src="http://keepwork.com/wiki/assets/imgs/icon/wiki_share.png" alt="">
      <el-popover ref='share' trigger='click' @show='showSocialShare' width='130'>
        <div class="kp-social-share"></div>
      </el-popover>
      <span class="icon-item" v-loading='starPending'>
        <i class="iconfont icon-like-" :class="{'active': (activePageStarInfo && activePageStarInfo.starred)}" @click='togglePageStar'></i>
        <span class="info">{{(activePageStarInfo && activePageStarInfo.starredCount) || 0 }}</span>
      </span>
    </div>
  </div>
</template>
<script>
import 'social-share.js/dist/js/social-share.min.js'
import 'social-share.js/dist/css/share.min.css'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ToolHeader',
  computed: {
    ...mapGetters({
      activePageUrl: 'activePageUrl',
      activePageInfo: 'activePageInfo',
      displayUsername: 'user/displayUsername',
      activePageStarInfo: 'user/activePageStarInfo',
      gitlabChildrenByPath: 'gitlab/childrenByPath',
      userGetDetailByUsername: 'user/getDetailByUsername'
    }),
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
    locationOrigin() {
      return location.origin
    }
  },
  data() {
    return {
      starPending: false,
      breadcrumbsLoading: true,
      siteList: []
    }
  },
  watch: {
    async sitePath(sitePath) {
      if (!sitePath) return
      this.breadcrumbsLoading = true
      await this.gitlabGetRepositoryTree({
        path: sitePath,
        editorMode: false
      }).catch(e => console.error(e))
      this.breadcrumbsLoading = false
    },
    activePageInfo: {
      deep: true,
      async handler(newActivePageInfo) {
        let { username } = newActivePageInfo
        if (!username) {
          return
        }
        await this.getUserDetailByUsername({ username: username })
        let result = this.userGetDetailByUsername(username)
        this.siteList = result.allSiteList
      }
    }
  },
  methods: {
    ...mapActions({
      starPages: 'user/starPages',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree',
      getUserDetailByUsername: 'user/getUserDetailByUsername'
    }),
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

      if (file.type === 'tree') {
        let children = this.gitlabChildrenByPath(file.path)
        let indexChild = children.filter(file => file.name === 'index.md')[0]
        let firstFileTypeChild = children.filter(
          file => file.type === 'blob'
        )[0]
        targetFile =
          indexChild || firstFileTypeChild || children[0] || targetFile
      }

      let url =
        targetFile && targetFile.path && targetFile.path.replace(/\.md$/, '')
      if (!url) return
      location.pathname = url
    }
  },
  filters: {
    hideMarkdownExt: (str = '') => str.replace(/\.md$/, '')
  }
}
</script>
<style lang="scss">
.breadcrumb-item-dropdown {
  padding: 15px 0;
  min-width: auto;
  border-color: #e4e7ed;
  .file-list-content {
    max-height: 380px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
    height: 36px;
    line-height: 36px;
    padding: 0 16px;
    color: #909399;
    cursor: pointer;
    a {
      color: inherit;
      text-decoration: none;
    }
  }
  li:hover {
    background-color: #e5f2f8;
    color: #0081ba;
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
    color: #909399;
    display: inline-block;
  }
  .page-item-content {
    padding: 0 16px;
    border: 1px solid #dcdfe6;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border-radius: 30px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .page-item-content:hover {
    color: #0081ba;
    border-color: #cce6f1;
  }
  .icon-home-keepwork {
    font-size: 24px;
    vertical-align: middle;
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
    padding: 10px 15px;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
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
    }
    img {
      width: 20px;
    }
    .icon-like- {
      font-size: 20px;
    }
  }
}
</style>
