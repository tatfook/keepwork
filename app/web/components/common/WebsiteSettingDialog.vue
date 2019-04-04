<template>
  <el-dialog :append-to-body=true v-if='show' class="website-setting-dialog" :visible.sync="show" :before-close="handleClose">
    <div class="website-setting-sidebar-header">
      <span class="webSetting">{{$t('editor.siteSettings')}}&nbsp;&nbsp;&nbsp;</span><span class="url">//{{title}}/{{sitePath || ''}}&nbsp;{{$t('editor.settings')}}</span>
    </div>
    <div class="website-setting-sidebar">
      <ul>
        <li @click='doActiveNavItem(index)' v-for="(navItem, index) in filteredWebsiteSettingNavs" :key="index">
          <span :class="['sidebar-nav-item', {'active': index === activeSettingIndex}]">{{navItem.text}}</span>
        </li>
      </ul>
    </div>
    <div class="website-setting-content">
      <component :is='activeSettingComp' @close='handleClose' :siteDetail='siteDetail' :sitePath='sitePath'></component>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import WebsiteSettingLayout from './WebsiteSettingLayout'
import WebsiteSettingPermission from './WebsiteSettingPermission'
import WebsiteDelete from './WebsiteDelete'
import WebsiteSettingBasicMessage from './WebsiteSettingBasicMessage'
import WebsiteSettingStyle from './WebsiteSettingStyle'
import { mapGetters } from 'vuex'

export default {
  name: 'WebsiteSettingDialog',
  props: {
    siteDetail: {
      type: Object,
      required: true
    },
    show: Boolean,
    sitePath: String
  },
  data() {
    return {
      activeSettingIndex: 0
    }
  },
  computed: {
    ...mapGetters({
      loginUsername: 'user/username'
    }),
    activeSettingComp() {
      let activeSettingIndex = this.activeSettingIndex
      return _.get(
        this.filteredWebsiteSettingNavs,
        `${activeSettingIndex}.comp`
      )
    },
    siteOwnsUsername() {
      return this.sitePath.split('/')[0]
    },
    title() {
      return location.host
    },
    isBasicSettingShow() {
      return this.siteOwnsUsername === this.loginUsername
    },
    websiteSettingNavs() {
      return [
        {
          text: this.$t('setting.general'),
          comp: WebsiteSettingBasicMessage,
          isShow: this.isBasicSettingShow
        },
        {
          text: this.$t('setting.siteLayouts'),
          comp: WebsiteSettingLayout,
          isShow: true
        },
        {
          text: this.$t('setting.siteStyle'),
          comp: WebsiteSettingStyle,
          isShow: true
        },
        {
          text: this.$t('setting.sitePermission'),
          comp: WebsiteSettingPermission,
          isShow: this.isBasicSettingShow
        },
        {
          text: '删除网站',
          comp: WebsiteDelete,
          isShow: this.isBasicSettingShow
        }
      ]
    },
    filteredWebsiteSettingNavs() {
      return _.filter(this.websiteSettingNavs, navItem => {
        return navItem.isShow
      })
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    doActiveNavItem(index) {
      this.activeSettingIndex = index
    }
  },
  components: {
    WebsiteSettingLayout,
    WebsiteSettingPermission,
    WebsiteSettingBasicMessage,
    WebsiteSettingStyle,
    WebsiteDelete
  }
}
</script>

<style lang='scss'>
.website-setting {
  &-dialog {
    .el-dialog {
      width: 96%;
      min-width: 1180px;
      max-width: 1200px;
    }
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__headerbtn {
      top: 16px;
      z-index: 1;
    }
    .el-dialog__body {
      padding: 50px 0 0 0;
      display: flex;
      height: 652px;
      .website-setting-sidebar-header {
        position: absolute;
        bottom: 637px;
        width: 100%;
        height: 50px;
        border-bottom: 15px solid #cdd4dc;
        .webSetting {
          display: inline-block;
          padding-top: 13px;
          margin-left: 30px;
          font-size: 18px;
          color: #333;
        }
        .url {
          display: inline-block;
          font-size: 14px;
          color: #9f9f9f;
        }
      }
    }
  }
  &-sidebar {
    width: 165px;
    box-sizing: border-box;
    flex-shrink: 0;
    border-right: 15px solid #cdd4db;
    ul {
      margin: 0;
      padding: 0;
      padding-top: 33px;
    }
    li {
      list-style: none;
      text-align: center;
      margin-bottom: 10px;
    }
    .sidebar-nav-item {
      display: inline-block;
      width: 120px;
      height: 40px;
      line-height: 40px;
      color: #333;
      font-size: 14px;
      border: 1px solid #f0efed;
      border-radius: 4px;
      cursor: pointer;
    }
    .sidebar-nav-item.active {
      background-color: #1989fa;
      color: #fff;
      border-color: #1989fa;
    }
  }
  &-content {
    flex: 1;
  }
}
</style>
