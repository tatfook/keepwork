<template>
  <div class="org-cell" @click="handleOpenLink">
    <img class="org-cell-img" :src="orgLogo" alt="机构logo">
    <div class="org-cell-info">
      <div class="org-cell-info-name">{{name}}</div>
      <div class="org-cell-info-row">
        <i class="iconfont icon-phone-fill"></i>
        <span>{{phone}}</span>
      </div>
      <div class="org-cell-info-row">
        <i class="iconfont icon-location-fill"></i>
        <span class="address-fix">{{address}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'OrgCell',
  props: {
    orgData: {},
  },
  methods: {
    ...mapActions({
      openLink: 'paracraft/openLink',
    }),
    handleOpenLink() {
      const link = `https://keepwork.com/org/${this.loginUrl}`
      this.openLink({
        link,
        isProtocolType: this.isProtocolType,
      })
    },
  },
  computed: {
    isProtocolType() {
      return _.get(this.$route, 'query.type') == 'protocol'
    },
    orgLogo() {
      return this.orgData.logo || require('@/assets/paracraft/default-logo.png')
    },
    phone() {
      return this.orgData.cellphone || '暂无'
    },
    address() {
      return this.orgData.location || '未知'
    },
    name() {
      return this.orgData.name
    },
    loginUrl() {
      return this.orgData.loginUrl
    },
  },
}
</script>

<style lang="scss" scoped>
.org-cell {
  width: 378px;
  height: 124px;
  display: inline-flex;
  background: #4d4d4d;
  border-radius: 10px;
  align-items: center;
  padding-left: 12px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    box-shadow: 0px 0px 16px #fff;
  }
  &-img {
    width: 170px;
    height: 100px;
    object-fit: contain;
    border-radius: 10px;
  }
  &-info {
    text-align: left;
    height: 100px;
    padding: 0 10px;
    box-sizing: border-box;
    &-name {
      color: #fff;
      font-size: 16px;
    }

    &-row {
      color: #999999;
      font-size: 12px;
      margin-top: 6px;
      position: relative;
      padding-left: 20px;
      .iconfont {
        margin-right: 6px;
        position: absolute;
        left: 0;
      }
      .address-fix {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-height: 18px;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style>
