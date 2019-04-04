<template>
  <div class="website-delete">
    <p class="website-delete-alert">{{$t('common.deleteWebsiteHint')}}</p>
    <el-checkbox v-model="checked" class="website-delete-hint">{{$t('common.deleteWebsiteNotice')}}</el-checkbox>
    <p class="website-delete-btn">
      <el-button type="primary" :disabled="!checked" @click="confirmDeleteWebsite" :loading="deleteSuccessLoading">{{$t('common.deleteWebsite')}}</el-button>
    </p>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import _ from 'lodash'

export default {
  name: 'WebsiteDelete',
  props: {
    siteDetail: {
      type: Object,
      required: true
    },
    sitePath: String
  },
  data() {
    return {
      checked: false,
      deleteSuccessLoading: false
    }
  },
  computed: {
    siteId() {
      _.get(this.siteDetail, 'id', '')
    }
  },
  methods: {
    ...mapActions({
      deleteWebsite: 'user/deleteWebsite',
      getWebsiteDetailBySiteId: 'user/getWebsiteDetailBySiteId'
    }),
    async confirmDeleteWebsite() {
      this.deleteSuccessLoading = true
      await this.deleteWebsite({ siteId: this.siteDetail.id })
      await this.getWebsiteDetailBySiteId({
        siteId: this.siteDetail.id,
        useCache: false
      }).catch(e => console.error(e))
      this.deleteSuccessLoading = false
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.website-delete {
  padding: 70px;
  &-alert {
    font-size: 20px;
    // color: #409eff;
  }
  &-hint {
    color: red;
  }
  &-btn {
    margin-top: 80px;
  }
}
</style>

