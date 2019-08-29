<template>
  <div class="print-invitation-code">
    <div class="print-invitation-code-top clearfix">
      <div class="print-invitation-code-top-total">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'InvitationCode' }">{{$t('org.studentInvitationCodeManagement')}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t('org.generateInvitationCode')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="print-invitation-code-top-operation">
        <el-button type="primary" class="print-invitation-code-top-operation-button" @click="toPrintCode()">{{$t('org.print')}}</el-button>
      </div>
    </div>
    <div class="print-invitation-code-table">
      <el-table ref="codeTable" border :data="printCodeListData" tooltip-effect="dark" style="width: 90%">
        <el-table-column :label="$t('org.InvitationCode')" width="135"><template slot-scope="scope">{{scope.row.key | idPretty}}</template></el-table-column>
        <el-table-column :label="$t('org.name')" width="135"><template slot-scope="scope">{{scope.row.extra.name}}</template></el-table-column>
        <el-table-column :label="$t('org.stateLabel')" width="135"><template slot-scope="scope">{{stateFilter(scope.row.state)}}</template></el-table-column>
        <el-table-column :label="$t('org.createdTime')" width="135"><template slot-scope="scope">{{formatTime(scope.row.createdAt)}}</template></el-table-column>
        <el-table-column :label="$t('org.classLabel')" width="" prop="className"></el-table-column>
      </el-table>
    </div>
    <div ref="printContent" :class="['print-invitation-code-print', {'print-invitation-code-print-hidden': currentRouteName === 'PrintInvitationCode'}]">
      <div class="print-invitation-code-print-header">
        <div class="print-invitation-code-print-header-left">
          <img v-if="orgLogo" class="print-invitation-code-print-header-left-brand" :src="orgLogo" alt="KeepWork">
          <span class="print-invitation-code-print-header-left-name">{{currentOrg.name}}</span>
        </div>
        <div class="print-invitation-code-print-header-right">
          <p class="print-invitation-code-print-header-right-classname">{{className}}</p>
          <p class="print-invitation-code-print-header-right-time">{{$t('org.beginClassTime')}}:{{formatTime(beginClassTime)}}-{{formatTime(endClassTime)}}</p>
        </div>
      </div>
      <div class="print-invitation-code-print-content">
        <div class="print-invitation-code-print-row" v-for="(item,index) in printCodeListDataRow" :key="index">
          <div class="print-invitation-code-print-content-box" v-for="(i) in item" :key="i.key">
            <div class="print-invitation-code-print-content-box-header">
              <div class="header-left">
                <div class="header-left-org">
                  {{currentOrg.name}}
                </div>
                <div class="header-left-class">
                  {{className}}
                </div>
              </div>
              <div class="header-right">
                {{i.extra.name || ''}}
              </div>
            </div>
            <div class="print-invitation-code-print-content-box-top">
              <p class="print-invitation-code-print-content-box-top-key">邀请码：{{i.key | idPretty}}</p>
              <img class="print-invitation-code-print-content-box-top-left" src="@/assets/org/invite_code.png" alt="">
              <img class="print-invitation-code-print-content-box-top-center" src="@/assets/org/stripe.png" alt="">
              <img class="print-invitation-code-print-content-box-top-right" src="@/assets/org/shining.png" alt="">
            </div>
            <div class="print-invitation-code-print-content-box-guide">
              <p class="print-invitation-code-print-content-box-guide-step"><span class="print-invitation-code-print-content-box-guide-step-num">1</span>用浏览器打开网址：keepwork.com/org/{{orgLoginUrl}}</p>
              <p class="print-invitation-code-print-content-box-guide-step"><span class="print-invitation-code-print-content-box-guide-step-num">2</span>注册keepwork账号，并登录</p>
              <p class="print-invitation-code-print-content-box-guide-step"><span class="print-invitation-code-print-content-box-guide-step-num">3</span>输入上方邀请码</p>
              <img class="print-invitation-code-print-content-box-guide-img" src="@/assets/org/para-icon.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'PrintInvitationCode',
  data() {
    return {
      beginClassTime: this.$route.query.begin,
      endClassTime: this.$route.query.end,
      currentRouteName: this.$route.name
    }
  },
  computed: {
    ...mapGetters({
      printCodeList: 'org/printCodeList',
      currentOrg: 'org/currentOrg'
    }),
    orgLogo() {
      return _.get(this.currentOrg, 'logo')
    },
    orgLoginUrl() {
      return _.get(this.currentOrg, 'loginUrl')
    },
    printCodeListData() {
      return _.map(this.printCodeList, i => {
        return {
          ...i,
          className: this.className
        }
      })
    },
    printCodeListDataRow() {
      return _.chunk(this.printCodeListData, 2)
    },
    className() {
      return _.get(this.$route.query.className, '')
    }
  },
  methods: {
    toPrintCode() {
      const newWindow = window.open('', '标题')
      const bodyHtml = this.$refs.printContent.innerHTML
      let headHtml = document.head.innerHTML
      headHtml = headHtml.replace('screen', 'screen,print')
      newWindow.document.write(
        `<html>${headHtml}<body>${bodyHtml}<script>setTimeout(function() {window.print(); window.close();}, 500)<\/script><\/body><\/html>`
      )
    },
    stateFilter(state) {
      return state === 0 ? this.$t('org.unused') : this.$t('org.used')
    },
    formatTime(time) {
      return time ? moment(time).format('YYYY/MM/DD') : ''
    }
  },
  filters: {
    idPretty(value) {
      return _.map(_.chunk(value.toString().split(''), 4), i =>
        i.join('')
      ).join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
.print-invitation-code {
  background: #fff;
  border: solid 1px #e8e8e8;
  &-top {
    min-height: 56px;
    border-bottom: solid 2px #e8e8e8;
    &-total {
      float: left;
      /deep/ .el-breadcrumb {
        font-size: 16px;
        line-height: 56px;
        font-weight: normal;
        padding-left: 26px;
        .el-breadcrumb__item {
          .el-breadcrumb__inner {
            color: #999;
          }
          &:last-child .el-breadcrumb__inner {
            color: #333;
          }
        }
      }
    }
    &-operation {
      float: right;
      min-height: 56px;
      line-height: 56px;
      &-button {
        margin-right: 20px;
        min-width: 112px;
        border-radius: 4px;
        border: solid 1px #2397f3;
        &-export {
          color: #2397f3;
        }
      }
    }
  }
  &-table {
    padding: 30px;
  }
  &-print {
    &-hidden {
      display: none;
    }
  }
}
.clearfix::after {
  content: '';
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.clearfix {
  zoom: 1;
}
.print-invitation-code {
  &-print {
    max-width: 660px;
    margin: 0 auto;
    &-header {
      max-width: 660px;
      margin: 0 auto;
      display: flex;
      &-left {
        flex: 1;
        display: flex;
        &-brand {
          width: 128px;
          height: 46px;
          border: solid 1px #c5c5c5;
          object-fit: cover;
        }
        &-name {
          display: inline-block;
          line-height: 46px;
          font-size: 14px;
          font-weight: bold;
          padding-left: 16px;
          color: #333;
        }
      }
      &-right {
        flex: 1;
        text-align: right;
        &-classname,
        &-time {
          margin: 2px 14px;
        }
        &-classname {
          font-weight: bold;
          color: #333;
          font-size: 13px;
        }
        &-time {
          color: #999;
          font-size: 11px;
        }
      }
    }
    &-content {
      max-width: 660px;
      margin: 12px auto 0;
      &-row {
        page-break-inside: avoid;
      }
      &-box {
        border: 1px dashed #999;
        box-sizing: border-box;
        display: inline-block;
        width: 50%;
        padding: 12px 12px 0;
        &-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0 5px 10px;
          .header-left {
            &-org {
              font-weight: bold;
              font-size: 14px;
            }
            &-class {
              font-size: 12px;
              margin-top: 5px;
            }
          }
          .header-right {
            font-size: 14px;
          }
        }
        &-top {
          min-height: 56px;
          position: relative;
          &-key {
            line-height: 52px;
            margin: 0;
            text-align: center;
            font-size: 13px;
            // color: #fff;
            padding-top: 6px;
            font-weight: bold;
            z-index: 999;
            position: relative;
          }
          &-left {
            position: absolute;
            left: 0;
            top: 2px;
            z-index: 10;
          }
          &-center {
            position: absolute;
            top: 15px;
            left: 30px;
            z-index: 0;
            height: 30px;
            widows: 90%;
          }
          &-right {
            position: absolute;
            right: 0;
            top: 2px;
            z-index: 10;
          }
        }
        &-guide {
          padding: 2px 0 18px 16px;
          position: relative;
          &-img {
            position: absolute;
            bottom: 1px;
            right: 0;
            z-index: 0;
          }
          &-step {
            z-index: 99;
            position: relative;
            border-left: solid 3px #54a9ff;
            padding: 0 0 12px 20px;
            font-size: 12px;
            color: #000;
            margin: 0;
            font-weight: bold;
            &:nth-last-of-type(1) {
              padding-bottom: 0;
            }
            &-num {
              width: 16px;
              height: 16px;
              background-color: #54a8ff;
              border: solid 2px #3677b9;
              color: #fff;
              border-radius: 50%;
              display: inline-block;
              text-align: center;
              line-height: 16px;
              position: absolute;
              left: -10px;
              top: 0px;
            }
          }
        }
      }
    }
  }
}
</style>

