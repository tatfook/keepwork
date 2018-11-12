<template>
  <div class="perfect-common-footer">
    <div class="perfect-common-footer-detail-list">
      <div class="list-box-wrap">
        <div class="list-box">
          <h4 class="title">致社区</h4>
          <ul class="list">
            <li><a href="https://keepwork.com/official/paracraft/to-educators" target="_blank">- 致教育者</a></li>
            <li><a href="https://keepwork.com/official/paracraft/to-parents" target="_blank">- 给父母的话</a></li>
            <li><a href="https://keepwork.com/official/paracraft/to-developers" target="_blank">- 致开发者</a></li>
            <li><a href="https://github.com/LiXizhi/NPLRuntime/wiki" target="_blank">- 对爱好编程的你说</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="title">用来做什么？</h4>
          <ul class="list">
            <li><a>- 创建自己的项目</a></li>
            <li><a>- 与老师一起完成项目</a></li>
            <li><a>- 制作个人网站</a></li>
            <li><a>- 拥有个人知识体系</a></li>
            <li><a>- 学习在线课程</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="title">学习法</h4>
          <ul class="list">
            <li><a>- 在项目中学习</a></li>
            <li><a>- 在传授中学习</a></li>
            <li><a>- 费曼学习法</a></li>
            <li><a>- 碎片化学习法</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="title">keepwork家族</h4>
          <ul class="list">
            <li><a href="https://keepwork.com" target="_blank">- keepwork</a></li>
            <li><a href="https://iicc.keepwork.com/#/" target="_blank">- IICC国际智能大赛</a></li>
            <li><a href="http://paracraft.keepwork.com/?lang=zh" target="_blank">- Paracraft</a></li>
            <li><a href="https://github.com/LiXizhi/NPLRuntime/wiki" target="_blank">- NPL语言</a></li>
            <li><a href="https://keepwork.com/intro/keepwork/NPLCAD" target="_blank">- NPL CAD</a></li>
            <li><a href="https://keepwork.com/official/open/index" target="_blank">- 开放平台</a></li>
            <li><a href="https://keepwork.com/official/haqi/index" target="_blank">- 魔法哈奇</a></li>
            <li><a href="http://cc.paraengine.com/twiki/bin/view/HaqiTeen/WebHome" target="_blank">- 魔法哈奇2</a></li>
            <li><a href="https://keepwork.com/official/paracraft/index" target="_blank">- Paracraft网络课程</a></li>
            <li><a href="https://keepwork.com/official/paracraft/offline-courses" target="_blank">- Paracraft线下培训班</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="title">支持</h4>
          <ul class="list">
            <li><a href="http://keepwork.com/official/company/index" target="_blank">- 联系我们</a></li>
            <li><a href="https://keepwork.com/official/company/joinus" target="_blank">- 加入我们</a></li>
            <li><a href="https://keepwork.com/wiki/statics" target="_blank">- 网站统计</a></li>
            <li><a href="https://keepwork.com/intro/keepwork/changelog" target="_blank">- 更新信息</a></li>
            <li><a href="https://github.com/tatfook/wikicraft/issues" target="_blank">- 问题反馈</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="perfect-common-footer-simple-list">
      <ul class="footer-container-list">
        <li>
          <span class="logo"><img src="@/assets/img/logo.svg" alt=""></span>
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
            <el-dropdown @command='switchLanguage' trigger="click" placement="top">
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
    switchLanguage(language) {
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
    padding-bottom: 20px;
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
          li{
            a{
              color: #666;
              text-decoration: none;
            }
          }
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
          .el-dropdown-link{
            cursor: pointer;
          }
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
