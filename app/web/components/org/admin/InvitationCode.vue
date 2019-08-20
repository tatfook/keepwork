<template>
  <div class="invitation-code" v-loading="loading">
    <div class="invitation-code-top clearfix">
      <span class="invitation-code-top-total">{{$t('org.InvitationCode')}}：{{codesCount}}</span>
      <div class="invitation-code-top-operation">
        <el-button class="invitation-code-top-operation-button invitation-code-top-operation-button-export" @click="exportData">{{$t('org.export')}}</el-button>
        <el-button class="invitation-code-top-operation-button invitation-code-top-operation-button-export" @click="toPrintCode">{{$t('org.print')}}</el-button>
        <el-button type="primary" class="invitation-code-top-operation-button" @click="createActiveCode()">{{$t('org.generateInvitationCode')}}</el-button>
      </div>
    </div>
    <div class="invitation-code-filter">
      <el-form ref="codeFilter" :model="codeFilterData" label-width="80px">
        <el-form-item :label="$t('org.state')">
          <el-select v-model="codeFilterData.state" size="medium">
            <el-option :label="$t('org.allState')" value=""></el-option>
            <el-option :label="$t('org.used')" value="1"></el-option>
            <el-option :label="$t('org.unused')" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('org.class')">
          <el-select v-model="codeFilterData.classId" size="medium">
            <el-option :label="$t('org.allState')" value=""></el-option>
            <el-option v-for="(classItem, index) in orgClasses" :key="index" :label="classItem.name" :value="classItem.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="invitation-code-filter-search-box">
          <el-input size="medium" class="invitation-code-filter-search" :placeholder="$t('org.codeSearchPlaceholder')" v-model="codeFilterData.searchBy">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="invitation-code-table">
      <el-table ref="codeTable" border :data="codeTableData" @selection-change="handleSelectionChange" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :label="$t('org.serialNum')" width="55" type="index"></el-table-column>
        <el-table-column :label="$t('org.InvitationCode')" width="125" prop="key"></el-table-column>
        <el-table-column :label="$t('org.stateLabel')" width="75"><template slot-scope="scope">{{stateFilter(scope.row.state)}}</template></el-table-column>
        <el-table-column :label="$t('org.createdTime')" width="105"><template slot-scope="scope">{{formatTime(scope.row.createdAt)}}</template></el-table-column>
        <el-table-column :label="$t('org.activateTime')" width="105"><template slot-scope="scope">{{formatTime(scope.row.activateTime)}}</template></el-table-column>
        <el-table-column :label="$t('org.usernameLabel')" width="125" prop="username"></el-table-column>
        <el-table-column :label="$t('org.nameLabel')" width="125"><template slot-scope="scope">{{scope.row.realname || scope.row.extra.name}}</template></el-table-column>
        <el-table-column :label="$t('org.classLabel')" width="" prop="lessonOrganizationClasses.name"></el-table-column>
      </el-table>
    </div>
    <div ref="printInvitationCode" :class="['print-invitation-code-print', {'print-invitation-code-print-hidden': currentRouteName === 'InvitationCode'}]">
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
                {{i.realname || i.extra.name || ''}}
              </div>
            </div>
            <div class="print-invitation-code-print-content-box-top">
              <p class="print-invitation-code-print-content-box-top-key">邀请码：{{i.key}}</p>
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
    <div class="invitation-code-pages" v-if="codesCount > 0">
      <el-pagination background @size-change="handleSizeChange" @current-change="targetPage" :current-page="page" :page-size="perPage" :page-sizes="[10,20,40,60,80,100,200,300]" :total="codesCount" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'InvitationCode',
  data() {
    return {
      codeFilterData: {
        state: '',
        classId: '',
        searchBy: ''
      },
      multipleSelection: [],
      perPage: 10,
      page: 1,
      loading: true,
      currentRouteName: this.$route.name,
      beginClassTime: '',
      endClassTime: ''
    }
  },
  async mounted() {
    await Promise.all([
      this.getOrgActivateCodes(this.filterData),
      this.getOrgClassList({
        organizationId: this.orgId
      })
    ])
    this.loading = false
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgClassesById: 'org/getOrgClassesById',
      orgActiveCodeList: 'org/orgActiveCodeList',
      currentOrgToExpire: 'org/currentOrgToExpire',
      currentOrgHaveExpired: 'org/currentOrgHaveExpired'
    }),
    className() {
      return _.get(
        this.multipleSelection[0],
        'lessonOrganizationClasses.name',
        ''
      )
    },
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgLogo() {
      return _.get(this.currentOrg, 'logo')
    },
    orgLoginUrl() {
      return _.get(this.currentOrg, 'loginUrl')
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    },
    codesCount() {
      return _.get(this.orgActiveCodeList, 'count', 0)
    },
    codeTableData() {
      let codeData = _.get(this.orgActiveCodeList, 'rows', [])
      return _.map(codeData, i => {
        return { ...i, key: this.handleKey(i.key) }
      })
    },
    printCodeListDataRow() {
      return _.chunk(this.multipleSelection, 2)
    },
    filterData() {
      let params = { 'x-page': this.page, 'x-per-page': this.perPage }
      if (this.codeFilterData.state) {
        params = { ...params, 'state-eq': Number(this.codeFilterData.state) }
      }
      if (this.codeFilterData.classId) {
        params = {
          ...params,
          'classId-eq': Number(this.codeFilterData.classId)
        }
      }
      if (this.codeFilterData.searchBy) {
        params = {
          ...params,
          $or: [
            { key: { $like: `%${this.codeFilterData.searchBy}%` } },
            { username: { $like: `%${this.codeFilterData.searchBy}%` } },
            { realname: { $like: `%${this.codeFilterData.searchBy}%` } }
          ]
        }
      }
      return params
    }
  },
  watch: {
    filterData(newVal) {
      this.getOrgActivateCodes(newVal)
    }
  },
  methods: {
    ...mapActions({
      getOrgActivateCodes: 'org/getOrgActivateCodes',
      getOrgClassList: 'org/getOrgClassList',
      toggleExpirationDialogVisible: 'org/toggleExpirationDialogVisible'
    }),
    handleKey(key) {
      let tempArr = key.split('')
      let count = 0
      let result = []
      _.map(tempArr, (val, i) => {
        result.push(val)
        count++
        if (count === 4) {
          result.push('  ')
          count = 0
        }
      })
      return result.join('')
    },
    handleSizeChange(val) {
      this.perPage = val
    },
    targetPage(targetPage) {
      this.page = targetPage
    },
    handleSelectionChange(val) {
      this.beginClassTime = _.get(val[0], 'lessonOrganizationClasses.begin', '')
      this.endClassTime = _.get(val[0], 'lessonOrganizationClasses.end', '')
      this.multipleSelection = val
    },
    createActiveCode() {
      if (this.currentOrgHaveExpired) {
        this.toggleExpirationDialogVisible(true)
        return
      }
      this.$router.push({ name: 'NewInvitationCode' })
    },
    stateFilter(state) {
      return state === 0 ? this.$t('org.unused') : this.$t('org.used')
    },
    formatTime(time) {
      return time ? moment(time).format('YYYY/MM/DD') : ''
    },
    exportData() {
      if (this.multipleSelection.length === 0) {
        this.$message(this.$t('org.exportData'))
        return
      }
      import('@/components/common/Export2Excel').then(excel => {
        const tHeader = [
          this.$t('org.serialNum'),
          this.$t('org.InvitationCode'),
          this.$t('org.stateLabel'),
          this.$t('org.createdTime'),
          this.$t('org.activateTime'),
          this.$t('org.usernameLabel'),
          this.$t('org.nameLabel'),
          this.$t('org.classLabel')
        ]
        const dataList = []
        _.map(this.multipleSelection, (data, index) => {
          let tempArr = []
          tempArr.push(index + 1)
          tempArr.push(data.key)
          tempArr.push(this.stateFilter(data.state))
          tempArr.push(this.formatTime(data.createdAt))
          tempArr.push(this.formatTime(data.activateTime))
          tempArr.push(data.username)
          tempArr.push(data.realname)
          tempArr.push(data.lessonOrganizationClasses.name)
          dataList.push(tempArr)
        })
        excel.export_json_to_excel({
          header: tHeader,
          data: dataList,
          filename: '邀请码'
        })
      })
    },
    toPrintCode() {
      if (this.multipleSelection.length === 0) {
        this.$message(this.$t('org.selectPrintData'))
        return
      }
      if (this.multipleSelection.length > 0) {
        let firstEleClassId = this.multipleSelection[0].classId
        let result = this.multipleSelection.every(i => {
          return i.classId === firstEleClassId
        })
        if (!result) {
          this.$message(this.$t('org.sameClassCode'))
          return
        }
      }
      const newWindow = window.open('', '标题')
      const bodyHtml = this.$refs.printInvitationCode.innerHTML
      let headHtml = document.head.innerHTML
      headHtml = headHtml.replace('screen', 'screen,print')
      newWindow.document.write(
        `<html>${headHtml}<body>${bodyHtml}<script>setTimeout(function() {window.print(); window.close();}, 500)<\/script><\/body><\/html>`
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.invitation-code {
  background: #fff;
  border-radius: 8px;
  &-top {
    min-height: 56px;
    border-bottom: solid 2px #e8e8e8;
    &-total {
      font-size: 16px;
      line-height: 56px;
      color: #2397f3;
      font-weight: normal;
      padding-left: 26px;
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
  &-filter {
    padding: 34px 0;
    color: #909399;
    /deep/ .el-form {
      display: flex;
      .el-form-item {
        .el-input.invitation-code-filter-search {
          .el-input__inner {
            border: 0px solid transparent;
            border-bottom: 1px solid #aaa;
            border-radius: 0;
          }
          .el-input__suffix {
            cursor: pointer;
            font-size: 18px;
            color: #606266;
          }
        }
      }
      .invitation-code-filter-search-box {
        .el-form-item__content {
          margin-left: 40px !important;
          width: 250px;
        }
      }
    }
  }
  &-pages {
    text-align: center;
    margin: 40px;
  }
  &-table {
    margin: 0 24px;
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
    &-hidden {
      display: none;
    }
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
          padding: 2px 0 18px 34px;
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
