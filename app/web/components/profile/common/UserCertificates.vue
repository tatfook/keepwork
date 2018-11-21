<template>
  <div class="user-certificate">
    <el-card class="user-certificate-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>我的证书</span>
        <el-button v-show="!isCertificateEmpty" class="user-certificate-card-header-button" type="text">编辑</el-button>
        <el-button v-show="!isCertificateEmpty" class="user-certificate-card-header-button" type="text">添加</el-button>
      </div>
      <div class="user-certificate-list" v-if="!isCertificateEmpty">
        <div class="user-certificate-item">
          <span class="user-certificate-item-title">普通话二级一等</span>
          <span class="user-certificate-item-date">2014 / 5</span>
        </div>
        <div class="user-certificate-item">
          <span class="user-certificate-item-title">驾驶证</span>
          <span class="user-certificate-item-date">2014 / 5</span>
        </div>
        <div class="user-certificate-item">
          <span class="user-certificate-item-title">全国摄影大赛一等奖全国摄影大赛一等奖</span>
          <span class="user-certificate-item-date">2014 / 5</span>
        </div>
        <div class="user-certificate-item">
          <span class="user-certificate-item-title">英语六级</span>
          <span class="user-certificate-item-date">2014 / 5</span>
        </div>
      </div>
      <div class="user-certificate-empty" v-if="isCertificateEmpty">
        <img src="@/assets/img/default_certificate.png" alt="">
        <p><span class="user-certificate-empty-anchor">添加</span>个人证书，展现更好的自己</p>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'UserCertificates',
  data() {
    return {
      isCertificateEmpty: false
    }
  },
  props: {},
  filters: {}
}
</script>
<style lang="scss">
.user-certificate {
  &-card {
    .el-card__header {
      font-weight: bold;
      padding: 18px 16px;
    }
    .el-card__body {
      padding: 24px 16px;
    }
    &-header {
      &-button {
        float: right;
        padding: 3px 0;
        font-size: 12px;
        color: #909399;
      }
      &-button + &-button {
        margin-right: 6px;
      }
    }
  }
  &-list {
    font-size: 14px;
    color: #555;
  }
  &-item {
    margin-bottom: 8px;
    display: flex;
    &:last-child {
      margin-bottom: 0;
    }
    &-title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-date {
      font-size: 12px;
      color: #909399;
      margin-left: 8px;
    }
  }
  &-empty {
    color: #909399;
    font-size: 14px;
    text-align: center;
    &-anchor {
      color: #2397f3;
      cursor: pointer;
    }
  }
}
</style>
