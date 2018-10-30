<template>
  <div class="website-binder">
    <h1 class="website-binder-title">请设定您项目对应的网站</h1>
    <p class="website-binder-info">
      <span class="website-binder-warning">!</span>注意：设定后不可更改
    </p>
    <div class="website-binder-cards">
      <div class="website-binder-cards-item" @click="openUserSitesDialog">
        <span class="website-binder-cards-item-badge badge">已有</span>将已有网站加入项目
      </div>
      <div class="website-binder-cards-item" @click='openNewSiteDialog'>
        <span class="website-binder-cards-item-badge badge">新建</span>创建新网站
      </div>
    </div>
    <el-dialog v-loading='isCreating' width="760px" title="选择已有网站" :visible.sync="isUserSitesDialogShow">
      <user-sites-selector ref='userSitesRef'></user-sites-selector>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUserSitesDialog">取消</el-button>
        <el-button type="primary" @click="createNewProjectByBind">确定</el-button>
      </div>
    </el-dialog>
    <new-website-dialog :isContinueAfterCreate='true' :show='isNewWebsiteDialogShow' @close='closeNewWebsiteDialog' @finish='createNewProjectByNewSite'></new-website-dialog>
  </div>
</template>
<script>
import NewWebsiteDialog from '@/components/common/NewWebsiteDialog'
import UserSitesSelector from '@/components/common/UserSitesSelector'
export default {
  name: 'WebsiteBinder',
  data() {
    return {
      isCreating: false,
      isNewWebsiteDialogShow: false,
      isUserSitesDialogShow: false
    }
  },
  methods: {
    openNewSiteDialog() {
      this.isNewWebsiteDialogShow = true
    },
    closeNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = false
    },
    openUserSitesDialog() {
      this.isUserSitesDialogShow = true
    },
    closeUserSitesDialog() {
      this.isUserSitesDialogShow = false
    },
    createNewProjectByBind() {
      let siteId = _.get(this.$refs.userSitesRef, 'selectSiteId')
      this.$emit('confirmSiteId', { siteId })
    },
    createNewProjectByNewSite() {
      let siteId = _.get(this.newSiteInfo, 'id')
      this.$emit('confirmSiteId', { siteId })
    }
  },
  components: {
    UserSitesSelector,
    NewWebsiteDialog
  }
}
</script>
<style lang="scss">
.website-binder {
  &-title {
    font-size: 24px;
    color: #303133;
    font-weight: normal;
    margin: 0;
  }
  &-info {
    font-size: 14px;
    color: #de992d;
  }
  &-warnging {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #de992d;
    margin: 8px 0 0;
  }
  &-cards {
    display: flex;
    margin: 38px 0 80px;
    &-item {
      cursor: pointer;
      width: 254px;
      height: 136px;
      line-height: 136px;
      text-align: center;
      border-radius: 4px;
      font-size: 14px;
      color: #f5f5f5;
      margin-right: 45px;
      &:nth-child(1) {
        background: linear-gradient(to bottom, #b141f7, #a02bea);
        .badge {
          color: #a02bea;
          background: linear-gradient(to bottom, #fefdfe, #ddbaf3);
        }
      }
      &:nth-child(2) {
        background: linear-gradient(to bottom, #23b6f3, #2397f3);
        .badge {
          color: #2397f3;
          background: linear-gradient(to bottom, #fefdfe, #d1e5fc);
        }
      }
      &-badge {
        display: inline-block;
        padding: 5px 6px;
        line-height: 1;
        font-size: 12px;
        border-radius: 8px;
        margin-right: 8px;
      }
    }
  }
}
</style>
