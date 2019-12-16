<template>
  <div class="invitation-code" v-loading="loading">
    <div class="invitation-code-top clearfix">
      <span class="invitation-code-top-total">学生邀请码管理</span>
      <div class="invitation-code-top-statics">
        可生成正式邀请码数：
        <span class="invitation-code-top-statics-item">3个月(<span>{{codeRemainderStatus.type5}}</span>个)</span>
        <span class="invitation-code-top-statics-item">半年(<span>{{codeRemainderStatus.type6}}</span>个)</span>
        <span class="invitation-code-top-statics-item">1年送3个月(<span>{{codeRemainderStatus.type7}}</span>个)</span>
        <el-popover placement="top-start" width="200" trigger="hover" popper-class="invitation-code-more-code-popover">
          <p>如需提高正式邀请码上限，请联系keepwork客服：<a href="mailto:support@paraengine.com" class="link">support@paraengine.com</a></p>
          <i slot="reference" class="iconfont icon-help"></i>
        </el-popover>
      </div>
    </div>
    <div class="invitation-code-statics">
      <div class="invitation-code-statics-label">已使用邀请码统计：</div>
      <div class="invitation-code-statics-detail">
        <div class="invitation-code-statics-item">
          <div class="invitation-code-statics-item-label">正式邀请码</div>
          <div class="invitation-code-statics-item-content">3个月(<span>{{codeUsedStatusData.type5}}个</span>)、半年(<span>{{codeUsedStatusData.type6}}个</span>)、1年(送3个月)(<span>{{codeUsedStatusData.type7}}个</span>)</div>
        </div>
        <div class="invitation-code-statics-item">
          <div class="invitation-code-statics-item-label">试用邀请码</div>
          <div class="invitation-code-statics-item-content">1个月(<span>{{codeUsedStatusData.type1}}个</span>)、2个月(<span>{{codeUsedStatusData.type2}}个</span>)</div>
        </div>
      </div>
    </div>
    <div class="invitation-code-operate">
      <div class="invitation-code-operate-total">
        邀请码列表：<span>{{codesCount}}个</span>
      </div>
      <div class="invitation-code-operate-buttons">
        <el-button class="invitation-code-top-operation-button invitation-code-top-operation-button-export" @click="setInvalid">设为无效</el-button>
        <el-button class="invitation-code-top-operation-button invitation-code-top-operation-button-export" @click="exportData">{{$t('org.export')}}</el-button>
        <el-button class="invitation-code-top-operation-button invitation-code-top-operation-button-export" @click="toPrintCode">{{$t('org.print')}}</el-button>
        <el-button type="primary" class="invitation-code-top-operation-button" @click="createActiveCode()">{{$t('org.generateInvitationCode')}}</el-button>
      </div>
    </div>
    <div class="invitation-code-filter">
      <el-form ref="codeFilter" :model="codeFilterData">
        <el-form-item label="类型">
          <el-select v-model="codeFilterData.type" size="medium">
            <el-option label="全部" value=""></el-option>
            <el-option label="正式" value="formal"></el-option>
            <el-option label="试听" value="try"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用期限">
          <el-select v-model="codeFilterData.duration" size="medium">
            <el-option v-for="option in durationOptions" :key="option.value" :label="option.text" :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('org.state')">
          <el-select v-model="codeFilterData.state" size="medium">
            <el-option :label="$t('org.allState')" value=""></el-option>
            <el-option :label="$t('org.used')" value="1"></el-option>
            <el-option :label="$t('org.unused')" value="0"></el-option>
            <el-option label="无效" value="2"></el-option>
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
        <el-table-column type="selection" width="39"></el-table-column>
        <el-table-column :label="$t('org.serialNum')" width="50" type="index"></el-table-column>
        <el-table-column :label="$t('org.InvitationCode')" width="98" prop="key"></el-table-column>
        <el-table-column label="类型" width="68"><template slot-scope="scope">{{typeFilter(scope.row.type)}}</template></el-table-column>
        <el-table-column label="使用期限" width="80"><template slot-scope="scope">{{durationFilter(scope.row.type)}}</template></el-table-column>
        <el-table-column :label="$t('org.stateLabel')" width="68"><template slot-scope="scope">{{stateFilter(scope.row.state)}}</template></el-table-column>
        <el-table-column :label="$t('org.createdTime')" width="98"><template slot-scope="scope">{{formatTime(scope.row.createdAt)}}</template></el-table-column>
        <el-table-column :label="$t('org.activateTime')" width="98"><template slot-scope="scope">{{formatTime(scope.row.activateTime)}}</template></el-table-column>
        <el-table-column :label="$t('org.usernameLabel')" width="98" prop="username"></el-table-column>
        <el-table-column :label="$t('org.nameLabel')"><template slot-scope="scope">{{scope.row.realname || scope.row.name}}</template></el-table-column>
        <el-table-column :label="$t('org.classLabel')" width="98" prop="lessonOrganizationClasses.name"></el-table-column>
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
                {{i.realname || i.name || ''}}
              </div>
            </div>
            <div class="print-invitation-code-print-content-box-top">
              <p class="print-invitation-code-print-content-box-top-key">邀请码：{{i.key}}</p>
              <img class="print-invitation-code-print-content-box-top-left" src="@/assets/org/invite_code.png" alt="">
              <img class="print-invitation-code-print-content-box-top-center" src="@/assets/org/stripe.png" alt="">
              <img class="print-invitation-code-print-content-box-top-right" src="@/assets/org/shining.png" alt="">
            </div>
            <div class="print-invitation-code-print-content-box-guide">
              <p class="print-invitation-code-print-content-box-guide-step"><span class="print-invitation-code-print-content-box-guide-step-num">1</span>
                打开帕拉卡（Paracraft）（下载地址：paracraft.keepwork.com） </p>
              <p class="print-invitation-code-print-content-box-guide-step"><span class="print-invitation-code-print-content-box-guide-step-num">2</span>注册账号，并登录帕拉卡（Paracraft）</p>
              <p class="print-invitation-code-print-content-box-guide-step"><span class="print-invitation-code-print-content-box-guide-step-num">3</span>进入“我的学校”，输入上方邀请码</p>
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
import { getIsFormalTypeByValue, getTypeText } from '@/lib/utils/org'

export default {
  name: 'InvitationCode',
  data() {
    return {
      codeFilterData: {
        type: '',
        duration: '',
        state: '',
        classId: '',
        searchBy: '',
      },
      multipleSelection: [],
      perPage: 10,
      page: 1,
      loading: true,
      currentRouteName: this.$route.name,
      beginClassTime: '',
      endClassTime: '',
      allOptionItem: [
        {
          text: '全部',
          value: '',
        },
      ],
      formalDurationOptions: [
        {
          text: '3个月',
          value: 5,
        },
        {
          text: '半年',
          value: 6,
        },
        {
          text: '1年(送3个月)',
          value: 7,
        },
      ],
      tryDurationOptions: [
        {
          text: '1个月',
          value: 1,
        },
        {
          text: '2个月',
          value: 2,
        },
      ],
    }
  },
  async mounted() {
    try {
      await Promise.all([
        this.getOrgActivateCodes(this.filterData),
        this.getOrgCodesStatus(),
        this.getOrgClassList({
          organizationId: this.orgId,
        }),
      ])
    } catch (error) {}
    this.loading = false
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgClassesById: 'org/getOrgClassesById',
      orgActiveCodeList: 'org/orgActiveCodeList',
      currentOrgToExpire: 'org/currentOrgToExpire',
      currentOrgHaveExpired: 'org/currentOrgHaveExpired',
      codeUsedStatus: 'org/codeUsedStatus',
    }),
    codeUsedStatusData() {
      return this.codeUsedStatus.used || {}
    },
    codeRemainderStatus() {
      return this.codeUsedStatus.remainder || {}
    },
    durationOptions() {
      return _.concat(
        this.allOptionItem,
        this.codeFilterData.type == 'formal'
          ? this.formalDurationOptions
          : this.codeFilterData.type == 'try'
          ? this.tryDurationOptions
          : [],
      )
    },
    className() {
      return _.get(this.multipleSelection[0], 'lessonOrganizationClasses.name', '')
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
      const { state, classId, searchBy, type, duration } = this.codeFilterData
      return _.omitBy(
        {
          'x-page': this.page,
          'x-per-page': this.perPage,
          'state-eq': state ? Number(this.codeFilterData.state) : null,
          'classId-eq': classId ? Number(this.codeFilterData.classId) : null,
          $or: searchBy
            ? [
                { key: { $like: `%${this.codeFilterData.searchBy}%` } },
                { username: { $like: `%${this.codeFilterData.searchBy}%` } },
                { realname: { $like: `%${this.codeFilterData.searchBy}%` } },
              ]
            : null,
          'type-in': this.getTypeInParam(type, duration),
        },
        _.isNull,
      )
    },
  },
  watch: {
    filterData(newVal) {
      this.getOrgActivateCodes(newVal)
    },
  },
  methods: {
    ...mapActions({
      getOrgActivateCodes: 'org/getOrgActivateCodes',
      getOrgCodesStatus: 'org/getOrgCodesStatus',
      getOrgClassList: 'org/getOrgClassList',
      toggleExpirationDialogVisible: 'org/toggleExpirationDialogVisible',
      orgSetInvalid: 'org/setInvalid',
    }),
    getTypeInParam(type, duration) {
      let mapOptions = []
      if (duration) {
        mapOptions = [
          {
            value: duration,
          },
        ]
      } else {
        mapOptions =
          type == 'formal'
            ? this.formalDurationOptions
            : type == 'try'
            ? this.tryDurationOptions
            : _.concat(this.tryDurationOptions, this.formalDurationOptions)
      }
      return _.remove(_.map(mapOptions, option => option.value || null), value => !_.isNull(value))
    },
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
      return state === 0 ? this.$t('org.unused') : state === 1 ? this.$t('org.used') : '无效'
    },
    typeFilter(type) {
      return getIsFormalTypeByValue(type) ? '正式' : '试听'
    },
    durationFilter(type) {
      return getTypeText(type)
    },
    formatTime(time) {
      return time ? moment(time).format('YYYY/MM/DD') : ''
    },
    async setInvalid() {
      if (this.multipleSelection.length === 0) {
        this.$message('请选择邀请码')
        return
      }
      this.loading = true
      try {
        const ids = _.map(this.multipleSelection, codeDetail => codeDetail.id)
        await this.orgSetInvalid({ ids })
        this.$message('设置成功')
      } catch (error) {
        console.log(error)
      }
      this.loading = false
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
          this.$t('org.classLabel'),
        ]
        const dataList = []
        _.map(this.multipleSelection, (data, index) => {
          let tempArr = []
          let realname = data.realname || data.name
          tempArr.push(index + 1)
          tempArr.push(data.key)
          tempArr.push(this.stateFilter(data.state))
          tempArr.push(this.formatTime(data.createdAt))
          tempArr.push(this.formatTime(data.activateTime))
          tempArr.push(data.username)
          tempArr.push(realname)
          tempArr.push(data.lessonOrganizationClasses.name)
          dataList.push(tempArr)
        })
        excel.export_json_to_excel({
          header: tHeader,
          data: dataList,
          filename: '邀请码',
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
        `<html>${headHtml}<body>${bodyHtml}<script>setTimeout(function() {window.print(); window.close();}, 500)<\/script><\/body><\/html>`,
      )
    },
  },
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
      font-weight: normal;
      padding-left: 26px;
    }
    &-statics {
      float: right;
      line-height: 56px;
      font-size: 14px;
      padding-right: 24px;
      color: #595959;
      &-item {
        margin-right: 6px;
        & > span {
          color: #1385ff;
        }
      }
    }
    .icon-help {
      color: #2397f3;
      cursor: pointer;
    }
  }
  &-more-code-popover {
    .link {
      color: #2397f3;
      text-decoration: none;
    }
  }
  &-statics {
    margin: 0 26px;
    border-bottom: 1px solid #e8e8e8;
    padding: 28px 0;
    &-label {
      display: inline-block;
    }
    &-detail {
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      color: #8c8c8c;
    }
    &-item {
      margin-bottom: 18px;
      &-label {
        display: inline-block;
        color: #1385ff;
        margin-right: 16px;
      }
      &-content {
        vertical-align: top;
        display: inline-block;
        & > span {
          color: #262626;
        }
      }
    }
  }
  &-operate {
    display: flex;
    padding: 20px 26px;
    align-items: center;
    &-total {
      flex: 1;
      & > span {
        color: #1385ff;
      }
    }
  }
  &-filter {
    padding: 34px 26px;
    color: #909399;
    /deep/ .el-form {
      display: flex;
      justify-content: space-between;
      .el-form-item__content {
        width: 88px;
        display: inline-block;
      }
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
          width: 220px;
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
          padding: 2px 0 18px 2px;
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
            padding: 0 0 12px 14px;
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
