<template>
  <el-dialog :append-to-body=true v-if='show' class="website-setting-dialog" :title="title" :visible.sync="show" :before-close="handleClose">
    <div class="website-setting-sidebar">
      <ul>
        <li @click='doActiveNavItem(index)' v-for="(navItem, index) in websiteSettingNavs" :key="index">
          <span :class="{'active': index === activeSettingIndex}" class="sidebar-nav-item">{{navItem.text}}</span>
        </li>
      </ul>
    </div>
    <div class="website-setting-content">
      <component :is='activeSettingComp'></component>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import WebsiteSettingLayout from './WebsiteSettingLayout'
import WebsiteSettingBasicMessage from './WebsiteSettingBasicMessage'

export default {
  name: 'WebsiteSettingDialog',
  props: {
    show: Boolean,
    sitePath: String
  },
  data() {
    return {
      title: `//${location.host}/${this.sitePath}`,
      websiteSettingNavs: [
        {
          text: '网站信息',
          comp: WebsiteSettingBasicMessage
        },
        {
          text: '网站布局',
          comp: WebsiteSettingLayout
        }
      ],
      activeSettingIndex: 0
    }
  },
  computed: {
    activeSettingComp() {
      return this.websiteSettingNavs[this.activeSettingIndex].comp
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
    WebsiteSettingBasicMessage
  }
}
</script>

<style lang='scss'>
.website-setting {
  &-dialog {
    .el-dialog {
      width: 96%;
      min-width: 1180px;
      max-width: 1920px;
    }
    .el-dialog__header {
      box-shadow: 0 2px 2px #b5b5b5;
      z-index: 10;
      position: relative;
    }
    .el-dialog__body {
      padding: 0;
      border-top: 15px solid #cdd4dc;
      display: flex;
      min-height: 652px;
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
