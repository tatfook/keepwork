<template>
  <div class="perfect-common-footer">
    <div v-show="isNavListShow" class="perfect-common-footer-detail-list hidden-sm-and-down">
      <div class="list-box-wrap">
        <div class="list-box">
          <h4 class="list-box-title">{{$t('footer.lettersTo')}}</h4>
          <ul class="list">
            <li><a href="https://keepwork.com/official/paracraft/index" target="_blank">{{$t("footer.solution")}}</a></li>
            <li><a href="https://keepwork.com/official/paracraft/to-parents" target="_blank">{{$t("footer.parents")}}</a></li>
            <li><a href="https://keepwork.com/official/paracraft/to-educators" target="_blank">{{$t("footer.educators")}}</a></li>
            <li><a href="https://keepwork.com/official/paracraft/to-developers" target="_blank">{{$t("footer.developers")}}</a></li>
            <li><a href="/s/autobiography" target="_blank">{{$t("footer.programmingFans")}}</a></li>
            <li><a href="https://keepwork.com/official/paracraft/selflearning" target="_blank">{{$t("footer.independentLearn")}}</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="list-box-title">{{$t("footer.community")}}</h4>
          <ul class="list">
            <li><a href="https://keepwork.com/">{{$t("footer.createPersonalProject")}}</a></li>
            <!-- <li><a>{{$t("footer.eventAnnouncements")}}</a></li> -->
            <li><a href="https://keepwork.com/official/paracraft/feedback" target="_blank">{{$t("footer.studentFeedback")}}</a></li>
            <li><a href="https://keepwork.com/official/paracraft/blog" target="_blank">{{$t("footer.employeeBlogging")}}</a></li>
            <li><a href="https://keepwork.com/official/paracraft/parents-blog" target="_blank">{{$t("footer.parentsBlog")}}</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="list-box-title">{{$t("footer.learningMethod")}}</h4>
          <ul class="list">
            <li><a href="https://keepwork.com/s/lesson" target="_blank">{{$t("footer.networkCourse")}}</a></li>
            <li><a href="https://keepwork.com/official/paracraft/offline-courses" target="_blank">{{$t("footer.offlineGuideClass")}}</a></li>
            <li><a href="https://keepwork.com/official/docs/index" target="_blank">{{$t("footer.document")}}</a></li>
            <li><a href="https://keepwork.com/official/paracraft/faq" target="_blank">{{$t("footer.commonProblems")}}</a></li>
            <li><a href="http://paracraft.keepwork.com/download?lang=zh" target="_blank">{{$t("footer.downloadParacraft")}}</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="list-box-title">{{$t("footer.paracraftFamily")}}</h4>
          <ul class="list">
            <li><a href="https://github.com/LiXizhi/NPLRuntime/wiki" target="_blank">{{$t("footer.NPLLangue")}}</a></li>
            <li><a href="https://keepwork.com/intro/keepwork/NPLCAD" target="_blank">NPL CAD</a></li>
            <li><a href="https://keepwork.com/official/haqi/index" target="_blank">{{$t("footer.haqi")}}</a></li>
            <li><a href="http://cc.paraengine.com/twiki/bin/view/HaqiTeen/WebHome" target="_blank">{{$t("footer.haqi")}} 2</a></li>
            <li><a href="https://keepwork.com/official/bluetooth/apps" target="_blank">{{$t("footer.buildingBlocks")}}</a></li>
          </ul>
        </div>
        <div class="list-box">
          <h4 class="list-box-title">{{$t("footer.cooperation")}}</h4>
          <ul class="list">
            <li><a href="https://biz.keepwork.com/" target="_blank">{{$t("footer.business")}}</a></li>
            <li><a href="/s/solution/organization" target="_blank">{{$t("footer.partner")}}</a></li>
            <!-- <li><a href="https://qiniu.keepwork.com/39392320-5519-11e9-a375-9ba583510c11.pdf?e=1557805380&token=LYZsjH0681n9sWZqCM4E2KmU6DsJOE7CAM4O3eJq:r5gjjcesrKgFTOrDCJilLIdq-is=#paracraft_biz_brochure.pdf" target="_blank">{{$t("footer.leaflet")}}</a></li> -->
          </ul>
        </div>
        <div class="list-box">
          <h4 class="list-box-title">{{$t("footer.about")}}</h4>
          <ul class="list">
            <li><a href="https://biz.keepwork.com/companyProfile" target="_blank">{{$t("footer.corporation")}}</a></li>
            <li><a href="https://keepwork.com/official/company/joinus" target="_blank">{{$t("footer.joinUs")}}</a></li>
            <li><a href="https://github.com/tatfook/keepwork/issues" target="_blank">{{$t("footer.feedback")}}</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="perfect-common-footer-simple-list">
      <ul class="footer-container-list">
        <li class="footer-container-list-item">
          <span class="footer-container-list-item-keepwork">Keepwork</span>
        </li>
        <li class="footer-container-list-item">
          <a class="footer-container-list-item-icp" href="http://beian.miit.gov.cn/publish/query/indexFirst.action" target="_blank">粤ICP备14002196号-2 © Tatfook</a>
        </li>
        <li class="footer-container-list-item">
          <a class="footer-container-list-item-icp" href="https://github.com/LiXizhi/NPLRuntime/wiki" target="_blank">Powered by NPL</a>
        </li>
        <li class="footer-container-list-item">
          <span class="footer-container-list-item-inform" @click="showComplainDialog">{{$t('common.complaintReporting')}}</span>
        </li>
        <li class="footer-container-list-item">
          <span>
            <el-dropdown @command='switchLanguage' trigger="click" placement="top">
              <span class="el-dropdown-link">
                {{$t('common.simplifiedChinese')}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot='dropdown' class="footer-container-list-item-select">
                <el-dropdown-item command='zh-cn'>简体中文</el-dropdown-item>
                <el-dropdown-item command='en'>English</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </li>
      </ul>
    </div>
    <complain-dialog :isComplainDialogVisible='isComplainDialogVisible' @close="hideComplainDialog"></complain-dialog>
  </div>
</template>
<script>
import 'element-ui/lib/theme-chalk/display.css'
import ComplainDialog from './ComplainDialog'

export default {
  name: 'PerfectCommonFooter',
  props: {
    isNavListShow: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      isComplainDialogVisible: false,
      currentOrigin: window.location.origin
    }
  },
  methods: {
    switchLanguage(language) {
      window.localStorage.setItem('keepwork-language-locale', language)
      window.location.reload()
    },
    showComplainDialog() {
      this.isComplainDialogVisible = true
    },
    hideComplainDialog() {
      this.isComplainDialogVisible = false
    }
  },
  components: {
    ComplainDialog
  }
}
</script>

<style lang="scss">
.perfect-common-footer {
  &-detail-list {
    background: rgb(40, 40, 40);
    .list-box-wrap {
      margin: 0 auto;
      max-width: 1200px;
      display: flex;
      border-bottom: 1px solid #333;
      padding-bottom: 40px;
      .list-box {
        flex: 1;
        padding-left: 28px;
        &-title {
          color: #ffffff;
          margin: 38px 0 31px;
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
    background: rgb(40, 40, 40);
    .footer-container {
      &-list {
        max-width: 1020px;
        list-style: none;
        margin: 0 auto;
        padding: 0;
        color: #fff;
        font-size: 14px;
        padding: 24px;
        display: flex;
        justify-content: center;
        &-item {
          font-size: 13px;
          padding: 0 20px;
          line-height: 15px;
          &-inform {
            cursor: pointer;
          }
          &-keepwork {
            color: #218fe9;
          }
          &-icp {
            color: #fff;
            text-decoration: none;
          }
          & + .footer-container-list-item {
            border-left: 1px solid #666;
          }
          .el-dropdown-link {
            cursor: pointer;
            color: #fff;
          }
        }
      }
    }
  }
  &-fake-button {
    cursor: pointer;
    padding: 0 5px 5px;
    margin: 0 25px;
    &:hover {
      border-bottom: 2px solid #3977ad;
    }
  }
}
.footer-container-list-item-select {
  overflow: unset;
}
@media screen and (max-width: 768px) {
  .perfect-common-footer {
    &-simple-list {
      .footer-container {
        &-list {
          text-align: center;
          display: block;
          &-item {
            padding: 3px 0;
            & + .footer-container-list-item {
              border-left: none;
            }
          }
        }
      }
    }
  }
}
@media print {
  .perfect-common-footer {
    display: none;
  }
}
</style>
