<template>
  <div class="compare-view">
    <h1 class="compare-view-title">
      <span>Paracraft VIP</span>
    </h1>
    <div class="compare-view-box">
      <div class="compare-view-feature">
        <h2>免费账户</h2>
        <ul>
          <li>
            <span class="el-icon-success compare-view-success"></span>教学视频
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>网课
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>线下导引课
          </li>
          <li class="compare-view-muted">
            每周一小时一对一线上或线下指导
          </li>
          <li class="compare-view-muted">
            会员群集体讨论
          </li>
          <li class="compare-view-muted">
            答疑和指导
          </li>
        </ul>
      </div>
      <div class="compare-view-feature compare-view-feature-vip">
        <h2>VIP账号</h2>
        <p class="info" translate="30RMB/月"></p>
        <ul>
          <li>
            <span class="el-icon-success compare-view-success"></span>教学视频
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>网课
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>线下导引课，并优先排位
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>每周一小时一对一线上或线下指导
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>会员群集体讨论
          </li>
          <li>
            <span class="el-icon-success compare-view-success"></span>答疑和指导
          </li>
        </ul>
        <div class="compare-view-feature-info">
          请浏览
          <a href="//keepwork.com/official/paracraft/vip">会员服务</a>
        </div>
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
    position: relative;
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
    &-info {
      text-align: center;
      font-size: 14px;
      text-align: center;
      position: absolute;
      bottom: 5px;
      width: 100%;
      left: 0;
      color: #808080;
      a {
        color: #409eff;
      }
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
