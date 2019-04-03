<template>
  <div class="website-delete">
    <p class="website-delete-alert">您确定要删除网站吗？</p>
    <el-checkbox v-model="checked" class="website-delete-hint">我知道网站删除后将清除相关的全部数据，且连接到该网站的URL都将失效。</el-checkbox>
    <p class="website-delete-btn">
      <el-button type="primary" :disabled="!checked" @click="confirmDeleteWebsite" :loading="deleteSuccessLoading">删除网站</el-button>
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
      deleteWebsite: 'user/deleteWebsite'
    }),
    async confirmDeleteWebsite() {
      this.deleteSuccessLoading = true
      await this.deleteWebsite({ siteId: this.siteDetail.id })
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

