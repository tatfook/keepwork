<template>
  <div class="website-binder">
    <h1 class="website-binder-title">{{$t("project.websiteSettingForProject")}}</h1>
    <p class="website-binder-info">
      <span class="website-binder-warning">!</span>{{$t("project.canNotChangedAfterSettings")}}
    </p>
    <div class="website-binder-cards">
      <div class="website-binder-cards-item" @click="openUserSitesDialog">{{$t("project.selectExistingWebsite")}}</div>
      <div class="website-binder-cards-item" @click='openNewSiteDialog'>{{$t("project.createNewWebsite")}}</div>
    </div>
    <el-dialog v-loading='isCreating' width="760px" :title="$t('project.selectExistingSite')" :visible.sync="isUserSitesDialogShow" :append-to-body='true'>
      <user-sites-selector ref='userSitesRef'></user-sites-selector>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUserSitesDialog">{{$t("common.Cancel")}}</el-button>
        <el-button type="primary" @click="createNewProjectByBind">{{$t("common.Sure")}}</el-button>
      </div>
    </el-dialog>
    <new-website-dialog :isContinueAfterCreate='true' :show='isNewWebsiteDialogShow' @close='closeNewWebsiteDialog' @finish='createNewProjectByNewSite'></new-website-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters({
      newSiteInfo: 'user/newSiteInfo'
    })
  },
  methods: {
    ...mapActions({
      getWebsiteDetailBySiteId: 'user/getWebsiteDetailBySiteId'
    }),
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
    async createNewProjectByBind() {
      let siteId = _.get(this.$refs.userSitesRef, 'selectSiteId')
      await this.getWebsiteDetailBySiteId({
        siteId: siteId
      }).catch(e => console.error(e))
      this.$emit('confirmSiteId', { siteId })
      this.closeUserSitesDialog()
    },
    async createNewProjectByNewSite() {
      let siteId = _.get(this.newSiteInfo, 'id')
      await this.getWebsiteDetailBySiteId({
        siteId: siteId
      }).catch(e => console.error(e))
      this.$emit('confirmSiteId', { siteId })
      this.closeNewWebsiteDialog()
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
  &-warning {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #de992d;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    line-height: 16px;
    margin-right: 4px;
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
      }
      &:nth-child(2) {
        background: linear-gradient(to bottom, #23b6f3, #2397f3);
      }
    }
  }
}
</style>
