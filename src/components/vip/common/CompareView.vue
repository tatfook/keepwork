<template>
  <div class="compare-view">
    <h1 class="compare-view-title">
      <span>VIP账号特权</span>
    </h1>
    <div class="compare-view-box">
      <div class="compare-view-feature">
        <h2>免费账户</h2>
        <ul>
          <li>
            <span class="el-icon-success compare-view-success"></span>免费教学视频
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>网课
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>线下导引课
          </li>
          <li class="compare-view-muted">
            <span class="el-icon-success "></span>一小时的一对一线上或线下指导时间
          </li>
          <li class="compare-view-muted">
            会员群集体讨论
          </li>
          <li class="compare-view-muted">
            答疑和指导
          </li>
          <li class="compare-view-muted">
            请浏览
            <a href="//keepwork.com/official/paracraft/vip">会员服务</a>
          </li>
        </ul>
      </div>
      <div class="compare-view-feature compare-view-feature-vip">
        <h2>VIP账号</h2>
        <p class="info" translate="30RMB/月"></p>
        <ul>
          <li>
            <span class="el-icon-success compare-view-success"></span>免费教学视频
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>网课
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>线下导引课，并优先排位
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>一小时的一对一线上或线下指导时间
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>会员群集体讨论
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>答疑和指导
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>请浏览
            <a href="//keepwork.com/official/paracraft/vip">会员服务</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CompareView'
}
</script>
<style lang="scss" scoped>
.compare-view {
  text-align: center;
  color: #ff7200;
  &-title {
    color: #303133;
    margin: 0 0 60px;
    font-size: 24px;
    span {
      border-bottom: 4px solid #3977ad;
      padding-bottom: 6px;
    }
  }
  &-box {
    display: flex;
    justify-content: center;
  }
  &-feature {
    width: 280px;
    margin: 0 10px;
    padding: 16px 22px 36px 36px;
    text-align: center;
    border: 1px solid #dcdcdc;
    color: #808080;
    &-vip {
      color: #ff7200;
    }
    ul {
      margin: 0;
      padding: 0;
      text-align: left;
    }
    ul > li {
      list-style: none;
      font-size: 16px;
      position: relative;
      color: #666;
      padding-left: 30px;
      line-height: 40px;
      white-space: nowrap;
    }
    .el-icon-success {
      position: absolute;
      top: 12px;
      left: 0;
      font-size: 20px;
      color: #6bbc7d;
    }
  }
  &-muted {
    color: #ddd;
  }
}
</style>

