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
        <el-table-column :label="$t('org.name')" width="135"><template slot-scope="scope">{{scope.row.name}}</template></el-table-column>
        <el-table-column :label="$t('org.stateLabel')" width="135"><template slot-scope="scope">{{stateFilter(scope.row.state)}}</template></el-table-column>
        <el-table-column :label="$t('org.createdTime')" width="135"><template slot-scope="scope">{{formatTime(scope.row.createdAt)}}</template></el-table-column>
        <el-table-column :label="$t('org.classLabel')" width="" prop="className"></el-table-column>
      </el-table>
    </div>
    <print-invitation-code-content ref="printContent" :isPrintContentHidden="isPrintContentHidden" :printData="printCodeListDataRow" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import PrintInvitationCodeContent from './common/PrintInvitationCodeContent'

export default {
  name: 'PrintInvitationCode',
  computed: {
    ...mapGetters({
      printCodeList: 'org/printCodeList',
    }),
    isPrintContentHidden() {
      return this.$route.name === 'PrintInvitationCode'
    },
    printCodeListData() {
      return _.map(this.printCodeList, i => {
        return {
          ...i,
          className: this.className,
        }
      })
    },
    printCodeListDataRow() {
      return _.chunk(this.printCodeListData, 2)
    },
    className() {
      return this.$route.query.className || ''
    },
  },
  methods: {
    toPrintCode() {
      const newWindow = window.open('', '标题')
      const bodyHtml = this.$refs.printContent.$el.innerHTML
      let headHtml = document.head.innerHTML
      headHtml = headHtml.replace('screen', 'screen,print')
      newWindow.document.write(
        `<html>${headHtml}<body>${bodyHtml}<script>setTimeout(function() {window.print(); window.close();}, 500)<\/script><\/body><\/html>`,
      )
    },
    stateFilter(state) {
      return state === 0 ? this.$t('org.unused') : this.$t('org.used')
    },
    formatTime(time) {
      return time ? moment(time).format('YYYY/MM/DD') : ''
    },
  },
  filters: {
    idPretty(value) {
      return _.map(_.chunk(value.toString().split(''), 4), i => i.join('')).join(' ')
    },
  },
  components: {
    PrintInvitationCodeContent,
  },
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
</style>

