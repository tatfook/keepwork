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
                <div class="kp-icon"><i class="iconfont icon-add1"></i></div>
                <div class="kp-submenu-top-content">
                  <button @click.stop="openNewWebsiteDialog">{{$t('editor.newWebsite')}}</button>
                  <!--<button disabled>新建文件夹</button> -->
                  <!--<button disabled>新建页面</button> -->
                </div>
              </div>
            </el-dropdown-item>
            <!-- <el-dropdown-item divided>
              <div class="kp-menu-top">
                <div class="kp-icon"><i class="iconfont icon-setting"></i></div>                
                <div class="kp-submenu-top-content">
                  <button>设置网站</button>
                  <button>设置页面</button>
                </div>
              </div>
            </el-dropdown-item> -->
            <!-- <el-dropdown-item divided>
              <div class="kp-menu-top">
                <div class="kp-icon"><i class="iconfont icon-delete1"></i></div>
                <div class="kp-submenu-top-content">
                  <button>删除网站</button>
                  <button>删除文件夹</button>
                  <button>删除页面</button>
                </div>
              </div>
            </el-dropdown-item> -->
            <el-dropdown-item divided>
              <div :class="['kp-menu-top',isActivePageSaved ? 'isDisabled disabled-bgc':'']">
                <div class="kp-icon"><i class="iconfont icon-save1" ></i></div>
                <div class="kp-submenu-top-content">
                  <button :disabled='isActivePageSaved' @click.stop="save">{{$t('editor.save')}}</button>
                  <!-- <button>全部保存</button> -->
                </div>
              </div>
              </el-dropdown-item>
            <!-- <el-dropdown-item divided>
              <div class="kp-menu-top">
                <div class="kp-icon"><i class="iconfont icon-close1"></i></div>
                <div class="kp-submenu-top-content">
                  <button>关闭</button>
                  <button>全部关闭</button>
                </div>
              </div>
            </el-dropdown-item> -->
            <el-dropdown-item divided>
              <div class="kp-menu">
                <button @click.stop="refresh"><i class="iconfont icon-refresh1"></i>{{$t('editor.refresh')}}</button>
                <button @click.stop='undo' :disabled='!canUndo'><i class="iconfont icon-pre-step"></i>{{$t('editor.revoke')}}</button>
                <button @click='redo' :disabled='!canRedo'><i class="iconfont icon-redo"></i>{{$t('editor.redo')}}</button>
              </div>
            </el-dropdown-item>
            <!-- <el-dropdown-item divided>
              <div class="kp-menu">
                <button><i class="iconfont icon-mod"></i>模块</button>                  
                <button><i class="iconfont icon-lfile"></i>大文件</button>                  
              </div>
            </el-dropdown-item> -->
            <el-dropdown-item divided>
              <div class="kp-menu">
                <!-- <button><i class="iconfont icon-code1"></i>显示代码</button>-->
                <button><i class="iconfont icon-help"></i><a href="https://keepwork.com/official/help/index" target="_blank">{{$t('editor.help')}}</a></button>                  
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div class="kp-menu">
                <button @click="backHome"><i class="iconfont icon-home"></i>{{$t('editor.backHomePage')}}</button>                  
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
  padding: 0 0 0 10px;
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
.el-dropdown-link{
  padding: 20px 0;
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
  &.disabled-bgc:hover{
    .kp-icon{
        background-color:#f5f5f5;
    }
  }
  .kp-icon{
    width: 20px;
    padding:0 4px 0 20px;
    height: 24px;
    .iconfont{
      border: none;
      line-height: 24px;
      width: 0;
      font-size: inherit
    }
  }
  .kp-submenu-top-content{
    flex: 1;
    button{
      width: 100%;
      height: 24px;
      border: none;
      background-color: transparent;
      text-align: left;
      padding-left: 10px;
      color: #909399;
      border-left: 1px solid #ccc;
      &:focus{
        outline: none;
      }
      &:hover{
        background-color: rgba(40, 140, 233, 0.1);
        color: #409EFF;
      }
      &[disabled]{
        color: #ccc;
        &:hover{
          background-color: #f5f5f5;
        }
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
.kp-dropdown-menu-content{
  &.el-popper[x-placement^=bottom] {
    width: 164px;
    left: 45px !important;
  }
  .el-dropdown-menu__item--divided:before {
    margin: 0;
  }
}
.kp-menu button{
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
  .iconfont{
    border: none;
    font-size: 14px;
    width: 0;
    height: 0;
    line-height: 24px;
    position: absolute;
    left: 20px;
    top:0;
  }
  &:hover{
    color: #409EFF;
    background-color: rgba(40, 140, 233, 0.1);
    .iconfont{
      color: #409EFF;
    }
  }
  &:focus{
    outline: none;
  }
  a{
    text-decoration: none;
    color: inherit;
  }
}
.kp-menu button[disabled]{
  &:hover{
    background-color: #f5f5f5;
  }
  color: #ccc;
  cursor: default;
  .iconfont{
    color: #ccc;
  }
}
</style>
