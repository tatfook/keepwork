<template>
  <div class="website-delete">
    <p class="website-delete-alert">{{$t('common.deleteWebsiteHint')}}</p>
    <p class="website-delete-hint" @click="agreeDelete"><span :class="['website-delete-hint-check',{'website-delete-hint-agree':checked}]"></span>{{$t('common.deleteWebsiteNotice')}}</p>
    <p class="website-delete-btn">
      <el-button type="primary" :disabled="!checked" @click="confirmDeleteWebsite" :loading="deleteSuccessLoading">{{$t('common.deleteWebsite')}}</el-button>
    </p>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'WebsiteDelete',
  props: {
    sitePath: String
  },
  async mounted() {
    await this.userGetWebsiteDetailInfoByPath({
      path: this.sitePath
    })
    this.siteDetail = _.cloneDeep(
      this.getSiteDetailInfoByPath(this.sitePath).siteinfo
    )
  },
  data() {
    return {
      checked: false,
      deleteSuccessLoading: false
    }
  },
  computed: {
    ...mapGetters({
      getSiteDetailInfoByPath: 'user/getSiteDetailInfoByPath'
    }),
    siteId() {
      _.get(this.siteDetail, 'id', '')
    }
  },
  methods: {
    ...mapActions({
      userGetWebsiteDetailInfoByPath: 'user/getWebsiteDetailInfoByPath',
      deleteWebsite: 'user/deleteWebsite',
      getWebsiteDetailBySiteId: 'user/getWebsiteDetailBySiteId'
    }),
    agreeDelete() {
      this.checked = !this.checked
    },
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
  }
  &-hint {
    color: #333;
    max-width: 480px;
    word-break: break-all;
    line-height: 30px;
    padding-left: 26px;
    position: relative;
    cursor: pointer;
    &-agree {
      background: #409eff;
    }
    &-check {
      position: absolute;
      display: inline-block;
      width: 15px;
      height: 15px;
      top: 5px;
      left: 4px;
      border: 1px solid #409eff;
      border-radius: 1px;
      &::after {
        content: '';
        width: 10px;
        height: 5px;
        display: inline-block;
        border: 1px solid #fff;
        transform: rotate(-45deg);
        border-top-color: transparent;
        border-right-color: transparent;
        position: absolute;
        top: 1px;
        left: 1px;
      }
    }
  }
  &-btn {
    margin-top: 80px;
  }
}
</style>

