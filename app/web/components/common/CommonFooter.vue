<template>
  <div class="footer-container">
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
        <a href="https://github.com/tatfook/keepwork/issues" target="_blank">{{$t('common.feedback')}}</a>
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
    <!-- <ul>
      <li>
        <a href="/official/open" target="_blank">{{$t('common.openPlatform')}}</a>
      </li>
      <li>
        <a href="/official/company/joinus" target="_blank">{{$t('common.joinUs')}}</a>
      </li>
      <li>
        <a href="/wiki/statics" target="_blank">{{$t('common.websiteStatistics')}}</a>
      </li>
      <li>
        <a href="/intro/keepwork/changelog" target="_blank">{{$t('common.updateInformation')}}</a>
      </li>
      <li>
        {{$t('common.feedback')}}</a>
      </li>
      <li>
        <a href="https://github.com/LiXizhi/NPLRuntime/wiki" target="_blank">Powered By NPL</a>
      </li>
      <li>
        <el-dropdown @command='swichLanguage' trigger="click" placement="top">
          <span class="el-dropdown-link">
            <i class='iconfont icon-language'></i>{{$t('common.simplifiedChinese')}}
          </span>
          <el-dropdown-menu slot='dropdown'>
            <el-dropdown-item command='zh-cn'>简体中文</el-dropdown-item>
            <el-dropdown-item command='en'>English</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
    <p>
      <span>{{$t('common.caseNumberA')}}</span>
      <span>{{$t('common.caseNumberB')}}</span>
    </p> -->
  </div>
</template>

<script>
export default {
  name: 'CommonFooter',
  methods: {
    swichLanguage(language) {
      window.localStorage.setItem('keepwork-language-locale', language)
      window.location.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
.footer-container {
  &-list {
    list-style: none;
    margin: 0;
    padding: 0;
    color: #909399;
    font-size: 14px;
    text-align: center;
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
  //   padding: 25px 15px;
  //   ul {
  //     margin: 0;
  //     padding: 0;
  //   }
  //   ul > li {
  //     list-style: none;
  //     display: inline-block;
  //     padding-bottom: 6px;
  //   }
  //   a {
  //     color: #3977ad;
  //     padding: 0 5px 5px;
  //     margin: 0 25px;
  //     text-decoration: none;
  //     font-size: 14px;
  //   }
  //   a:hover {
  //     border-bottom: 2px solid #3977ad;
  //   }
  //   p {
  //     margin: 6px 0 0;
  //     text-align: center;
  //     font-size: 14px;
  //   }
  //   span {
  //     font-size: 14px;
  //   }
  //   .icon-language {
  //     color: #ec1e1e;
  //     vertical-align: middle;
  //     margin-right: 5px;
  //   }
  //   .el-dropdown-link {
  //     cursor: pointer;
  //   }
  // }
  @media (max-width: 768px) {
    .footer-container {
      &-list {
        margin: 0;
        li {
          height: 30px;
        }
      }
      a {
        margin: 0;
      }
    }
  }
}
</style>