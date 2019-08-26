<template>
  <div class="org-cell">
    <img class="org-cell-img" :src="orgLogo" alt="机构logo">
    <div class="org-cell-info">
      <div class="org-cell-info-name">Paracraft试学体验馆</div>
      <div class="org-cell-info-row">
        <i class="iconfont icon-phone-fill"></i>
        <span>0755-56895231</span>
      </div>
      <div class="org-cell-info-row">
        <i class="iconfont icon-location-fill"></i>
        <span class="address-fix">广东省深圳市宝安区福永镇广东省深圳市宝安区福永镇广东省深圳市宝安区福永镇广东省深圳市宝安区福永镇
          凤凰村</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrgCell',
  computed: {
    orgLogo() {
      return 'http://git.keepwork.com/gitlab_rls_kevinxft/keepworkdatasource/raw/master/kevinxft_images/profile_1539254819668.jpeg'
    }
  }
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
    box-shadow: 0px 0px 24px #fff;
  }
  &-img {
    width: 170px;
    height: 100px;
    object-fit: cover;
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