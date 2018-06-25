<template>
  <div class='editor-header'>
    <el-menu mode='horizontal'>
      <el-menu-item index="2">
        <el-dropdown placement="bottom-end" class="kp-dropdown-menu">
          <span class="el-dropdown-link">
            <img class='kp-logo' src='@/assets/img/logo.svg' alt='Menu'>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div class="kp-menu-top">
                <div class="kp-icon"><i class="iconfont icon-add1"></i></div>
                <div class="kp-submenu-top-content">
                  <span><button @click.stop="openNewWebsiteDialog">{{$t('editor.newWebsite')}}</button></span>
                  <!-- <span><button disabled>新建文件夹</button></span> -->
                  <!-- <span><button disabled>新建页面</button></span> -->
                </div>
              </div>
            </el-dropdown-item>
            <!-- <el-dropdown-item divided>
              <div class="kp-menu-top">
                <div class="kp-icon"><i class="iconfont icon-setting"></i></div>                
                <div class="kp-submenu-top-content">
                  <span><button>设置网站</button></span>
                  <span><button>设置页面</button></span>
                </div>
              </div>
            </el-dropdown-item> -->
            <!-- <el-dropdown-item divided>
              <div class="kp-menu-top">
                <div class="kp-icon"><i class="iconfont icon-delete1"></i></div>
                <div class="kp-submenu-top-content">
                  <span><button>删除网站</button></span>
                  <span><button>删除文件夹</button></span>
                  <span><button>删除页面</button></span>
                </div>
              </div>
            </el-dropdown-item> -->
            <el-dropdown-item divided>
              <div :class="['kp-menu-top',isActivePageSaved ? 'isDisabled':'']">
                <div class="kp-icon"><i class="iconfont icon-save1" ></i></div>
                <div class="kp-submenu-top-content">
                  <span><button :disabled='isActivePageSaved' @click.stop="save">{{$t('editor.save')}}</button></span>
                  <!-- <span><button>全部保存</button></span> -->
                </div>
              </div>
              </el-dropdown-item>
            <!-- <el-dropdown-item divided>
              <div class="kp-menu-top">
                <div class="kp-icon"><i class="iconfont icon-close1"></i></div>
                <div class="kp-submenu-top-content">
                  <span><button>关闭</button></span>
                  <span><button>全部关闭</button></span>
                </div>
              </div>
            </el-dropdown-item> -->
            <el-dropdown-item divided>
              <div class="kp-menu">
                <div class="kp-submenu">
                  <span><span class="icon-span"><i class="iconfont icon-refresh1"></i></span><button @click.stop="refresh">{{$t('editor.refresh')}}</button></span>
                  <span><span :class="['icon-span',!canUndo ? 'isDisabled':'']"><i class="iconfont icon-pre-step"></i></span><button @click.stop='undo' :disabled='!canUndo'>{{$t('editor.revoke')}}</button></span>
                  <span><span :class="['icon-span',!canRedo ? 'isDisabled':'']"><i class="iconfont icon-redo"></i></span><button @click='redo' :disabled='!canRedo'>{{$t('editor.redo')}}</button></span>
                </div>
              </div>
            </el-dropdown-item>
            <!-- <el-dropdown-item divided>
              <div class="kp-menu">
                <div class="kp-submenu">
                  <span><span class="icon-span"><i class="iconfont icon-mod"></i></span><button>模块</button></span>
                  <span><span class="icon-span"><i class="iconfont icon-lfile"></i></span><button>大文件</button></span>
                </div>
              </div>
            </el-dropdown-item> -->
            <el-dropdown-item divided>
              <div class="kp-menu">
                <div class="kp-submenu">
                  <!-- <span><span class="icon-span"><i class="iconfont icon-code1"></i></span><button>显示代码</button></span> -->
                  <span><span class="icon-span"><i class="iconfont icon-help"></i></span><a href="https://keepwork.com/official/help/index">{{$t('editor.help')}}</a></span>
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div class="kp-menu">
              <div class="kp-submenu">
                  <span><span class="icon-span"><i class="iconfont icon-home"></i></span><button @click.stop="backHome">{{$t('editor.backHomePage')}}</button></span>
              </div>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>
      <el-menu-item index='3' class='li-btn save-btn' :disabled='isActivePageSaved'>
        <span v-loading='savePending' class='iconfont icon-save' :title='$t("editor.save")' @click='save'></span>
      </el-menu-item>
      <el-menu-item index='4' class='li-btn' @click='undo' :disabled='!canUndo'>
        <span class='iconfont icon-return' :title='$t("editor.revoke")'></span>
      </el-menu-item>
      <el-menu-item index='5' class='li-btn' @click='redo' :disabled='!canRedo'>
        <span class='iconfont icon-revocation' :title='$t("editor.redo")'></span>
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
      <el-menu-item index='6' class="link-box">
        <i class="iconfont icon-copy" @click='doCopyLink' :title='$t("common.copy")'></i>
        <a :href='activePageFullUrl' target='_blank'>{{ activePageFullUrl }}</a>
      </el-menu-item>
      <el-menu-item index='7' class='unsaved-tip'>
        <span>{{ isActivePageSaved ? '' : $t('editor.unsavedTip') }}</span>
      </el-menu-item>
      <el-menu-item index='8' class='pull-right user-profile-box'>
        <img class='user-profile' :src='userProfile.portrait' alt=''>
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
      isNewWebsiteDialogShow: false,
      nowOrigin: document.location.origin
    }
  },
  mounted() {
    Mousetrap.unbind('mod+s')
    Mousetrap.bind('mod+s', () => {
      this.save()
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
      showingCol: 'showingCol',
      activePageInfo: 'activePageInfo',
      canUndo: 'canUndo',
      canRedo: 'canRedo',
      openedFiles: 'openedFiles',
      activeAreaData: 'activeAreaData',
      openedFiles: 'openedFiles',
      userProfile: 'user/profile'
    }),
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
      return (url || '').replace(/\.md$/,'')
    },
    isActivePageSaved() {
      let { saved } = this.activeAreaData || {}
      return saved === false ? false : true
    }
  },
  methods: {
    ...mapActions(['saveActivePage', 'undo', 'redo', 'setActiveManagePaneComponent']),
    async save() {
      let self = this

      if (this.isActivePageSaved) {
        return
      }
      if(!this.savePending) {
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
    changeView(type) {
      this.setActiveManagePaneComponent(type)
    },
    refresh(){
      window.location.reload();
    },
    backHome(){
      window.location.href=this.nowOrigin
    }
  },
  components: {
    NewWebsiteDialog
  }
}
</script>

<style scoped>
.kp-dropdown-menu{
  padding: 0 10px;
}
.kp-dropdown-menu:hover{
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
  top: .3em;
  border-bottom: 2px solid #F7BC2A !important;
}
.save-btn:not(.is-disabled) .icon-save {
  background: #F7BC2A;
  border-color: #F7BC2A;
  color: white;
}

.kp-logo {
  width: 127px;
}
.el-dropdown-menu__item{
  line-height: 24px;
  padding: 0;
}
.el-dropdown-menu__item:hover{
  color: inherit;
  background-color: inherit
}
.kp-menu .kp-submenu span{
  display: block;
  height: 24px;
}
.kp-menu .kp-submenu span a{
  text-decoration: none;
  color: #909399;
}
.kp-menu .kp-submenu span:hover{
  background-color: rgba(40, 140, 233, 0.1);
}
.kp-menu .kp-submenu span:hover a{
  color: #409EFF;        
}
.kp-menu .kp-submenu .icon-span{
  display: inline-block  ;
  width: 20px;
  margin-right: 15px;
  padding-left: 20px;
}
.kp-menu .kp-submenu .icon-span .iconfont{
      border: none;
      line-height: 10px;
      width: 0;
      font-size: inherit
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
.kp-menu-top{
  display: flex;
  &:hover{
    .kp-icon{
      background-color:rgba(40, 140, 233, 0.1);          
      .iconfont{
      color: #409EFF;        
      }
    }
  }
  .kp-icon{
    width: 20px;
    padding:0 4px 0 20px;
    height: 24px;
    .iconfont{
      border: none;
      line-height: 10px;
      width: 0;
      font-size: inherit
    }
  }
  .kp-submenu-top-content{
    flex: 1;
    span{
      display: block;
      border-left: 1px solid #eee;
      &:hover{
        background-color:rgba(40, 140, 233, 0.1);        
        button{
          color: #409EFF; 
          background-color: transparent;
          cursor: pointer;    
        }
      }
      button{
        padding-left: 10px;
        border: none;
        background-color: #fff;
        color: #909399;
      }
      button[disabled]{
        color: #ccc;
      }
    }
  }
}
.isDisabled{
      .iconfont{
      color: #CcC !important;        
    }    
  &:hover{
    .kp-icon{
      .iconfont{
      color: #CcC !important;        
      }
    }
  }
}
.kp-menu .kp-submenu span:hover{
  .iconfont{
      color: #409EFF;        
  }    
}
.kp-menu .kp-submenu span {
  &:hover{
    button{
      background-color: transparent;
      color:#409eff;
      cursor: pointer;
    }
  }
  button{
    border: none;
    background-color: #fff;
    margin: 0;
    color: #909399;    
    padding-left: 1px;
  }
  button[disabled]{
    color: #ccc;
  }
}
.el-popper[x-placement^=bottom] {
  width: 164px;
  left: 45px !important;
}
.el-dropdown-menu__item--divided:before {
  margin: 0;
}
</style>
