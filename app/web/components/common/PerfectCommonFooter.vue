<template>
  <div class="perfect-common-footer">
    <div class="perfect-common-footer-detail-list">
      <div class="list-box-wrap">
        <div class="list-box">
          <h4 class="title">致社区</h4>
          <ul class="list">
            <li>- 致教育者</li>
            <li>- 给父母的话</li>
            <li>- 致开发者</li>
            <li>- 对爱好编程的你说</li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="title">用来做什么？</h4>
          <ul class="list">
            <li>- 创建自己的项目</li>
            <li>- 与老师一起完成项目</li>
            <li>- 制作个人网站</li>
            <li>- 拥有个人知识体系</li>
            <li>- 学习在线课程</li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="title">学习法</h4>
          <ul class="list">
            <li>- 在项目中学习</li>
            <li>- 在传授中学习</li>
            <li>- 费曼学习法</li>
            <li>- 碎片化学习法</li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="title">keepwork家族</h4>
          <ul class="list">
            <li>- keepwork</li>
            <li>- Paracraft</li>
            <li>- NPL语言</li>
            <li>- NPL CAD</li>
            <li>- 开放平台</li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="title">支持</h4>
          <ul class="list">
            <li>- 联系我们</li>
            <li>- 加入我们</li>
            <li>- 网站统计</li>
            <li>- 更新信息</li>
            <li>- 问题反馈</li>
            <li>- 投诉本页</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="perfect-common-footer-simple-list">
      <ul class="footer-container-list">
        <li>
          <span class="logo"><img src="@/assets/img/logo_old.svg" alt=""></span>
          <span class="line">|</span>
        </li>
        <li>
          <span>{{$t('common.caseNumberA')}}{{$t('common.caseNumberB')}}</span>
          <span class="line">|</span>
        </li>
        <li>
          <a href="https://github.com/LiXizhi/NPLRuntime/wiki" target="_blank">Powered By NPL</a>
          <span class="line">|</span>
        </li>
        <li>
          <a href="https://github.com/tatfook/wikicraft/issues" target="_blank">{{$t('common.feedback')}}</a>
          <span class="line">|</span>
        </li>
        <li>
          <span>
            <el-dropdown @command='swichLanguage' trigger="click" placement="top">
              <span class="el-dropdown-link">
                {{$t('common.simplifiedChinese')}}
              </span>
              <el-dropdown-menu slot='dropdown'>
                <el-dropdown-item command='zh-cn'>简体中文</el-dropdown-item>
                <el-dropdown-item command='en'>English</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PerfectCommonFooter',
  methods: {
    swichLanguage(language) {
      window.localStorage.setItem('keepwork-language-locale', language)
      window.location.reload()
    }
  }
}
</script>

<style lang="scss">
.perfect-common-footer {
  &-detail-list {
    background: #282828;
    .list-box-wrap {
      margin: 0 auto;
      max-width: 1200px;
      display: flex;
      .list-box {
        flex: 1;
        .title {
          color: #ffffff;
        }
        .list {
          margin: 0;
          padding: 0;
          font-size: 13px;
          list-style: none;
          color: #666;
          line-height: 28px;
        }
      }
    }
  }
  &-simple-list {
    background: #181818;
    .footer-container {
      &-list {
        max-width: 1020px;
        list-style: none;
        margin: 0 auto;
        padding: 0;
        color: #909399;
        font-size: 14px;
        li {
          display: inline-block;
          height: 60px;
          line-height: 60px;
          .logo {
            display: inline-block;
            position: relative;
            width: 100px;
            height: 33px;
            img {
              height: 15px;
              position: absolute;
              top: 23px;
            }
          }
          .line {
            padding: 0 25px;
          }
          a {
            color: #909399;
            padding: 0 5px 5px;
            margin: 0 25px;
            text-decoration: none;
            font-size: 14px;
          }
          a:hover {
            border-bottom: 2px solid #3977ad;
          }
        }
      }
    }
  }
}
</style>
