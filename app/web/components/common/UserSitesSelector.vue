<template>
  <div class="user-sites-selector">
    <p class="user-sites-selector-info">{{$t('project.pleaseSelect')}}</p>
    <el-select v-model="selectSiteId" filterable>
      <el-option v-for="siteDetail in personalSiteList" :key="siteDetail.id" :label="siteDetail.displayName || siteDetail.sitename" :value="siteDetail.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'UserSitesSelector',
  async mounted() {
    await this.userGetAllPersonalWebsite()
    this.selectSiteId = _.get(this.personalSiteList, '0.id')
  },
  data() {
    return {
      selectSiteId: undefined
    }
  },
  computed: {
    ...mapGetters({
      personalSiteList: 'user/personalSiteList'
    }),
    selectSiteDetail() {
      return _.find(this.personalSiteList, { id: this.selectSiteId })
    }
  },
  methods: {
    ...mapActions({
      userGetAllPersonalWebsite: 'user/getAllPersonalWebsite'
    })
  }
}
</script>
