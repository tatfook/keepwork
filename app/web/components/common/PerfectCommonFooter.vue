<template>
  <div class="perfect-common-footer">
    <div class="perfect-common-footer-detail-list hidden-sm-and-down">
      <div class="list-box-wrap">
        <div class="list-box">
          <h4 class="list-box-title">{{$t('footer.lettersTo')}}</h4>
          <ul class="list">
            <li><a href="https://keepwork.com/official/paracraft/to-educators" target="_blank">- {{$t("footer.educators")}}</a></li>
            <li><a href="https://keepwork.com/official/paracraft/to-parents" target="_blank">- {{$t("footer.parents")}}</a></li>
            <li><a href="https://keepwork.com/official/paracraft/to-developers" target="_blank">- {{$t("footer.developers")}}</a></li>
            <li><a href="https://github.com/LiXizhi/NPLRuntime/wiki" target="_blank">- {{$t("footer.programmingFans")}}</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="list-box-title">{{$t("footer.whatCanYouDo")}}</h4>
          <ul class="list">
            <li><a>- {{$t("footer.createPersonalProject")}}</a></li>
            <li><a>- {{$t("footer.createProjectWithTeachers")}}</a></li>
            <li><a>- {{$t("footer.haveYourOwnSite")}}</a></li>
            <li><a>- {{$t("footer.buildUpPersonalKnowledge")}}</a></li>
            <li><a>- {{$t("footer.learnOnlineLessons")}}</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="list-box-title">{{$t("footer.learningMethod")}}</h4>
          <ul class="list">
            <li><a>- {{$t("footer.learningBasedOnProject")}}</a></li>
            <li><a>- {{$t("footer.learningFromMentors")}}</a></li>
            <li><a>- {{$t("footer.feynmanTechnique")}}</a></li>
            <li><a>- {{$t("footer.fragmentedLearning")}}</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="list-box-title">{{$t("footer.keepworkFamily")}}</h4>
          <ul class="list">
            <li><a href="https://keepwork.com" target="_blank">- keepwork</a></li>
            <li><a href="https://iicc.keepwork.com/#/" target="_blank">- {{$t("footer.iicc")}}</a></li>
            <li><a href="http://paracraft.keepwork.com/?lang=zh" target="_blank">- Paracraft</a></li>
            <li><a href="https://github.com/LiXizhi/NPLRuntime/wiki" target="_blank">- {{$t("footer.NPLLangue")}}</a></li>
            <li><a href="https://keepwork.com/intro/keepwork/NPLCAD" target="_blank">- NPL CAD</a></li>
            <li><a href="https://keepwork.com/official/open/index" target="_blank">- {{$t("footer.openPlatform")}}</a></li>
            <li><a href="https://keepwork.com/official/haqi/index" target="_blank">- {{$t("footer.haqi")}}</a></li>
            <li><a href="http://cc.paraengine.com/twiki/bin/view/HaqiTeen/WebHome" target="_blank">- {{$t("footer.haqi")}} 2</a></li>
            <li><a href="https://keepwork.com/official/paracraft/index" target="_blank">- {{$t("footer.paracraftOnlineLessons")}}</a></li>
            <li><a href="https://keepwork.com/official/paracraft/offline-courses" target="_blank">- {{$t("footer.paracraftOfflineTraining")}}</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="list-box-title">{{$t("footer.support")}}</h4>
          <ul class="list">
            <li><a href="http://keepwork.com/official/company/index" target="_blank">- {{$t("footer.contactUs")}}</a></li>
            <li><a href="https://keepwork.com/official/company/joinus" target="_blank">- {{$t("footer.joinUs")}}</a></li>
            <li><a href="https://keepwork.com/wiki/statics" target="_blank">- {{$t("footer.siteStatics")}}</a></li>
            <li><a href="https://keepwork.com/intro/keepwork/changelog" target="_blank">- {{$t("footer.update")}}</a></li>
            <li><a href="https://github.com/tatfook/keepwork/issues" target="_blank">- {{$t("footer.feedback")}}</a></li>
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
          <a href="https://github.com/tatfook/keepwork/issues" target="_blank">{{$t('common.feedback')}}</a>
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
import 'element-ui/lib/theme-chalk/display.css'

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
        padding-left: 40px;
        &-title {
          color: #ffffff;
        }
        .list {
          margin: 0;
          padding: 0;
          font-size: 13px;
          list-style: none;
          color: #666;
          line-height: 28px;
          li {
            a {
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
          .el-dropdown-link {
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
              left: 0;
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
@media screen and (max-width: 768px) {
  .perfect-common-footer {
    &-simple-list {
      .footer-container {
        text-align: center;
        &-list{
          li{
            display: block;
            text-align: center;
            height: 30px;
            line-height: 30px;
            .logo{
              img{
                position: relative;
                top:2px;
              }
            }
            .line{
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
