<template>
  <div class="invitation-code" v-loading="loading">
    <div class="invitation-code-top clearfix">
      <span class="invitation-code-top-total">{{$t('org.InvitationCode')}}：{{codesCount}}</span>
      <div class="invitation-code-top-operation">
        <el-button class="invitation-code-top-operation-button invitation-code-top-operation-button-export" @click="exportData">{{$t('org.export')}}</el-button>
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
        <el-table-column :label="$t('org.nameLabel')" width="125" prop="realname"></el-table-column>
        <el-table-column :label="$t('org.classLabel')" width="" prop="lessonOrganizationClasses.name"></el-table-column>
      </el-table>
    </div>
    <div class="invitation-code-pages" v-if="codesCount > perPage">
      <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="codesCount">
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
      loading: true
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
      orgActiveCodeList: 'org/orgActiveCodeList'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    },
    codesCount() {
      return _.get(this.orgActiveCodeList, 'count', 0)
    },
    codeTableData() {
      return _.get(this.orgActiveCodeList, 'rows', [])
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
      getOrgClassList: 'org/getOrgClassList'
    }),
    targetPage(targetPage) {
      this.page = targetPage
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    createActiveCode() {
      this.$router.push({ name: 'NewInvitationCode' })
    },
    stateFilter(state) {
      return state === 0 ? this.$t('org.unused') : this.$t('org.used')
    },
    formatTime(time) {
      return time ? moment(time).format('YYYY/MM/DD') : ''
    },
    exportData() {
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
        _.map(this.codeTableData, (data, index) => {
          let tempArr = []
          tempArr.push(index)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.invitation-code {
  background: #fff;
  border: solid 1px #e8e8e8;
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
