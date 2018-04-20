<template>
  <div class='editor-header'>
    <el-menu mode='horizontal'>
      <el-submenu index='1'>
        <template slot='title'>
          <img class='kp-logo' src='@/assets/img/logo.svg' alt='Menu'>
        </template>
        <el-submenu index='1-1'>
          <template slot='title'>系统</template>
          <el-menu-item index='1-1-1' @click="openNewWebsiteDialog">新建网站</el-menu-item>
          <el-menu-item index='1-1-2'>保存</el-menu-item>
          <el-menu-item index='1-1-3'>网站设置</el-menu-item>
          <el-menu-item index='1-1-4'>网站备份</el-menu-item>
          <el-menu-item index='1-1-5'>版本管理</el-menu-item>
        </el-submenu>
        <el-submenu index='1-2'>
          <template slot='title'>页面</template>
          <el-menu-item index='1-2-1'>数据源</el-menu-item>
        </el-submenu>
        <el-submenu index='1-3'>
          <template slot='title'>编辑</template>
          <el-menu-item index='1-3-1'>撤销</el-menu-item>
          <el-menu-item index='1-3-2'>重做</el-menu-item>
          <el-menu-item index='1-3-3'>搜索</el-menu-item>
          <el-menu-item index='1-3-4'>替换</el-menu-item>
        </el-submenu>
        <el-submenu index='1-4'>
          <template slot='title'>插入</template>
          <el-menu-item index='1-4-1'>模块</el-menu-item>
          <el-menu-item index='1-4-2'>网盘</el-menu-item>
        </el-submenu>
        <el-submenu index='1-5'>
          <template slot='title'>显示</template>
          <el-menu-item index='1-5-1'>预览</el-menu-item>
          <el-menu-item index='1-5-2'>代码</el-menu-item>
          <el-menu-item index='1-5-3'>分屏</el-menu-item>
          <el-menu-item index='1-5-4'>全屏</el-menu-item>
          <el-submenu index='1-5-5'>
            <template slot='title'>页面模式</template>
            <el-menu-item index='1-5-5-1'>电脑</el-menu-item>
            <el-menu-item index='1-5-5-2'>手机</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index='1-6'>帮助</el-menu-item>
        <el-menu-item index='1-7'>
          <a href='/'>返回首页</a>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index='3' class='li-btn' :disabled='isActivePageSaved'>
        <span v-loading='savePending' class='iconfont icon-baocun' :title='$t("editor.save")' @click='save'></span>
      </el-menu-item>
      <el-menu-item index='4' class='li-btn' @click='undo' :disabled='!canUndo'>
        <span class='iconfont icon-fanhui' title='撤销'></span>
      </el-menu-item>
      <el-menu-item index='5' class='li-btn' @click='redo' :disabled='!canRedo'>
        <span class='iconfont icon-chongzuo' title='重做'></span>
      </el-menu-item>
      <!-- <el-menu-item index=' 8 ' class='li-btn'>
        <el-dropdown @command='changeViewType '>
          <el-button class='dropdown-btn'>
            {{showingType}}
            <i class='el-icon-arrow-down el-icon--right dropdown-arrow'></i>
          </el-button>
          <el-dropdown-menu slot='dropdown'>
            <el-dropdown-item :command='{isCodeShow: false, isPreviewShow: true} '>{{ $t('editor.preview') }}</el-dropdown-item>
            <el-dropdown-item :command='{isCodeShow: true, isPreviewShow: false} '>{{ $t('editor.code') }}</el-dropdown-item>
            <el-dropdown-item :command='{isCodeShow: true, isPreviewShow: true} '>{{ $t('editor.splitScreen') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item> -->
      <el-menu-item index='2 '>
        <span class='input-link-copy-box'>
          <a :href='activePageUrl' target='_blank'>{{activePageUrl}}</a>
        </span>
      </el-menu-item>

      <el-menu-item index='7 ' class='pull-right user-profile-box'>
        <img class='user-profile' src='http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1518086126317.png' alt=''>
      </el-menu-item>
    </el-menu>
    <NewWebsiteDialog :show='isNewWebsiteDialogShow' @close='closeNewWebsiteDialog' />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Mousetrap from 'mousetrap'
import NewWebsiteDialog from '@/components/common/NewWebsiteDialog'

export default {
  name: 'EditorHeader',
  data: function() {
    return {
      savePending: false,
      isNewWebsiteDialogShow: false
    }
  },
  mounted() {
    Mousetrap.unbind('mod+s')
    Mousetrap.bind('mod+s', () => {
      this.save()
      return false
    })
  },
  computed: {
    ...mapGetters([
      'showingCol',
      'activePageUrl',
      'canUndo',
      'canRedo',
      'openedFiles',
      'activePageInfo'
    ]),
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
    isActivePageSaved() {
      let { saved } = this.activePageInfo
      return saved
    }
  },
  methods: {
    ...mapActions(['saveActivePage', 'undo', 'redo']),
    async save() {
      if (this.isActivePageSaved) {
        return
      }
      this.savePending = true
      await this.saveActivePage()
        .then(() => {
          this.$message({
            showClose: true,
            message: '文件保存成功',
            type: 'success'
          })
        })
        .catch(e => {
          console.log(e)
          this.$message({
            showClose: true,
            message: '文件保存失败',
            type: 'error'
          })
        })
      this.savePending = false
    },
    openNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = true
    },
    closeNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = false
    }
  },
  components: {
    NewWebsiteDialog
  }
}
</script>

<style scoped>
.el-menu-item.is-active {
  border-bottom: none;
}
.kp-logo {
  width: 127px;
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
.user-profile {
  width: 46px;
  height: 46px;
  border-radius: 50%;
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
</style>
