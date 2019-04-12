<template>
  <div class="my-organization-cabinet-box">
    <div class="my-organization-cabinet-box-left">
      <img class="my-organization-cabinet-box-left-img" :src="organization.logo" alt="">
    </div>
    <div class="my-organization-cabinet-box-right">
      <h3 class="my-organization-cabinet-box-right-name">{{organization.name}}</h3>
      <p class="my-organization-cabinet-box-right-contact"><i class="iconfont icon-phone-fill"></i>{{organization.cellphone}}</p>
      <p class="my-organization-cabinet-box-right-address"><i class="iconfont icon-location-fill"></i>{{organization.extra.city && organization.extra.city.join('') || '未知'}}</p>
    </div>
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
    &-left {
      width: 170px;
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
      }
      &-contact,
      &-address {
        font-size: 12px;
        color: #909399;
        margin: 8px 0;
        padding-left: 20px;
        position: relative;
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


