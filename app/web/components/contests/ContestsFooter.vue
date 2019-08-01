<template>
  <div class="contests-footer">
    <p class="contests-footer-hint">本次比赛的解释权归国际智能创意大赛组委会所有</p>
    <div class="contests-footer-simple-list">
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
import ComplainDialog from '@/components/common/ComplainDialog'

export default {
  name: 'ContestsFooter',
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

<style lang="scss" scoped>
.contests-footer {
  font-family: 'STKaiti';
  font-weight: bold;
  &-hint {
    text-align: center;
    font-size: 19px;
    color: #5c666c;
    margin: 0;
  }
  &-simple-list {
    .footer-container {
      &-list {
        max-width: 1020px;
        list-style: none;
        margin: 0 auto;
        padding: 0;
        color: #212121;
        font-size: 14px;
        padding: 24px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        &-item {
          font-size: 13px;
          padding: 0 20px;
          line-height: 15px;
          &-inform {
            cursor: pointer;
          }
          &-keepwork {
            color: #212121;
          }
          &-icp {
            color: #212121;
            text-decoration: none;
          }
          & + .footer-container-list-item {
            border-left: 1px solid #666;
          }
          .el-dropdown-link {
            cursor: pointer;
            color: #212121;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .contests-footer {
    &-hint {
      font-size: 12px;
    }
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
</style>

