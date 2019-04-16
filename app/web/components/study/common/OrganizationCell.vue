<template>
  <div class="my-organization-cabinet-box" @click="goOrg(organization.loginUrl)">
    <div class="my-organization-cabinet-box-left">
      <img class="my-organization-cabinet-box-left-img" :src="organization.logo" alt="">
    </div>
    <div class="my-organization-cabinet-box-right">
      <h3 class="my-organization-cabinet-box-right-name">{{organization.name}}</h3>
      <p class="my-organization-cabinet-box-right-contact"><i class="iconfont icon-phone-fill"></i>{{organization.cellphone}}</p>
      <p class="my-organization-cabinet-box-right-address"><i class="iconfont icon-location-fill"></i>{{organization.location || '未知'}}</p>
    </div>
    <div class="my-organization-cabinet-box-enter">进入机构</div>
  </div>
</template>
<script>
export default {
  name: 'OrganizationCell',
  props: {
    organization: {
      type: Object,
      required: true
    }
  },
  methods: {
    goOrg(link) {
      window.open(`${window.location.origin}/org/${link}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.my-organization-cabinet {
  &-box {
    box-sizing: border-box;
    width: 378px;
    height: 128px;
    border-radius: 10px;
    background: #fff;
    padding: 12px;
    display: flex;
    margin: 0 0 24px 0;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    &:hover {
      .my-organization-cabinet-box-enter {
        opacity: 1;
      }
    }
    &-enter {
      position: absolute;
      text-align: center;
      position: absolute;
      height: 40px;
      line-height: 40px;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      background: #2397f3;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }
    &-left {
      width: 170px;
      cursor: pointer;
      &-img {
        width: 100%;
        height: 99px;
        object-fit: cover;
        border-radius: 10px;
      }
    }
    &-right {
      flex: 1;
      padding-left: 16px;
      &-name {
        margin: 0 0 14px 0;
        font-family: 'PingFangSC-Medium';
        font-size: 16px;
        cursor: pointer;
        min-height: 21px;
      }
      &-contact,
      &-address {
        font-size: 12px;
        color: #909399;
        margin: 8px 0;
        padding-left: 20px;
        position: relative;
        min-height: 16px;
        .icon-phone-fill,
        .icon-location-fill {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }
}
</style>


