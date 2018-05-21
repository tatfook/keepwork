<template>
  <div class="tool-header">
    <!-- <el-breadcrumb separator='/'>
      <el-breadcrumb-item>http://keepwork.com</el-breadcrumb-item>
      <el-breadcrumb-item>{{activePageInfo.username}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{activePageInfo.sitename}}</el-breadcrumb-item>
      <el-breadcrumb-item v-for="path in activePageInfo.paths" :key="path">{{path}}</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- <div class="breadcrumb">
      <a class="breadcrumb-item" href="/">http://keepwork.com</a>
      <span class="breadcrumb-separator" role="presentation">/</span>
      <a class="breadcrumb-item" :href="'/' + activePageInfo.username">{{activePageInfo.username}}</a>
      <el-dropdown class="breadcrumb-item">
        <span class="el-dropdown-link">
          <span class="breadcrumb-separator" role="presentation">/</span> {{activePageInfo.sitename}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="breadcrumb-item" v-for="path in activePageInfo.paths" :key="path">
        <span class="el-dropdown-link">
          <span class="breadcrumb-separator" role="presentation">/</span> {{path}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
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
      username: 'user/username',
      displayUsername: 'user/displayUsername',
      activePageStarInfo: 'user/activePageStarInfo'
    })
  },
  mounted() {},
  data() {
    return {
      starPending: false
    }
  },
  methods: {
    ...mapActions({
      starPages: 'user/starPages'
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
    }
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
