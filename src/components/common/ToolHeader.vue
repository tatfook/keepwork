<template>
  <div class="tool-header">
    <div class="breadcrumb">
      <a class="breadcrumb-item" href="/">{{ locationOrigin }}</a>
      <span class="breadcrumb-separator" role="presentation">/</span>
      <a class="breadcrumb-item" :href="'/' + activePageInfo.username">{{activePageInfo.username}}</a>
      <span class="breadcrumb-separator" role="presentation">/</span>
      <a class="breadcrumb-item" :href="'/' + activePageInfo.username + '/' + activePageInfo.sitename">{{activePageInfo.sitename}}</a>

      <el-dropdown v-for='(fileList, index) in breadcrumbs' :key='index' class="breadcrumb-item" @command='handleBreadcrumbClick'>
        <span class="el-dropdown-link">
          <span class="breadcrumb-separator" role="presentation">/</span> {{activePageInfo.paths[index] | hideMarkdownExt}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for='file in fileList' :key='file.name' :command='file'>
            {{file.type == 'tree' ? `${file.name}/` : file.name | hideMarkdownExt}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
      gitlabChildrenByPath: 'gitlab/childrenByPath'
    }),
    sitePath() {
      let { sitepath } = this.activePageInfo
      return sitepath
    },
    breadcrumbs() {
      let { username, sitename, paths = [] } = this.activePageInfo
      if (paths.length <= 0) return []
      let breadcrumbs = paths.map((path, index) => {
        let currentPath = [username, sitename, ...paths.slice(0, index)].join('/')
        return this.gitlabChildrenByPath(currentPath)
      })
      return breadcrumbs
    },
    locationOrigin() {
      return location.origin
    }
  },
  mounted() {
  },
  data() {
    return {
      starPending: false
    }
  },
  watch: {
    sitePath(sitePath) {
      sitePath && this.gitlabGetRepositoryTree({ path: sitePath, editorMode: false })
    }
  },
  methods: {
    ...mapActions({
      starPages: 'user/starPages',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree'
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
        let targetFile = indexChild || children[0] || targetFile
        console.log('handleBreadcrumbClick targetFile: ', targetFile)
      }

      let url = targetFile && targetFile.path && targetFile.path.replace(/\.md$/, '')
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
.tool-header {
  position: relative;
  height: 50px;
  .breadcrumb {
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
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
    color: #3ba4ff;
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
