<template>
  <div class="class-list">
    <div class="class-list-header" v-if="orgClassesLength > 0">
      <div class="class-list-header-count">{{$t('org.IncludeClasses') + orgClasses.length + $t('org.classesCountUnit')}}</div>
      <router-link class="class-list-header-new" :to="{name: 'OrgNewClass'}">
        <i class="el-icon-circle-plus-outline"></i>{{$t('org.NewClass')}}
      </router-link>
    </div>
    <el-table v-if="orgClassesLength > 0" class="class-list-table" border :data="orgClasses" header-row-class-name="class-list-table-header">
      <el-table-column prop="name" :label="$t('org.ClassNameLabel')" width="240">
      </el-table-column>
      <el-table-column :label="$t('org.beginClassTime')" width="240"><template slot-scope="scope">{{scope.row.begin | formatTime}} - {{scope.row.end | formatTime}}</template></el-table-column>
      <el-table-column :label="$t('common.action')">
        <template slot-scope="scope">
          <router-link class='class-list-table-link' :to='{name: "OrgClassDetail", query: scope.row}'>{{$t('org.Details')}}</router-link>
          <router-link class='class-list-table-link' :to='{name: "OrgEditClass", query: scope.row}'>{{$t('org.Edit')}}</router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="class-list-empty" v-if="orgClassesLength == 0">
      <img class="class-list-empty-img" src="@/assets/org/list_empty.png" alt="">
      <p class="class-list-empty-info">{{$t('org.getStarted')}} <router-link :to="{name: 'OrgNewClass'}" class="class-list-empty-cursor">{{$t('org.addFirstClass')}}</router-link>
      </p>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'ClassList',
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgClassesById: 'org/getOrgClassesById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgClassesWithOvertime() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    },
    orgClasses() {
      let nowDate = new Date().valueOf()
      return _.filter(this.orgClassesWithOvertime, classDetail => {
        let classBegin = new Date(classDetail.begin).valueOf()
        let classEnd = new Date(classDetail.end).valueOf()
        return !classEnd || classEnd >= nowDate
      })
    },
    orgClassesLength() {
      return this.orgClasses.length
    }
  },
  filters: {
    formatTime(time) {
      return time ? moment(time).format('YYYY/MM/DD') : ''
    }
  }
}
</script>
<style lang="scss" scoped>
.class-list {
  padding: 24px;
  &-header {
    display: flex;
    margin-bottom: 16px;
    &-count {
      flex: 1;
    }
    &-new {
      color: #2397f3;
      cursor: pointer;
      text-decoration: none;
    }
  }
  &-table {
    width: 660px;
    &-header {
      font-size: 14px;
      color: #909399;
    }
    &-link {
      color: #2397f3;
      border-radius: 4px;
      border: solid 1px #2397f3;
      padding: 1px 14px;
      text-decoration: none;
      &:nth-child(1) {
        margin-right: 20px;
      }
    }
  }
  .el-icon-circle-plus-outline {
    margin-right: 4px;
    vertical-align: middle;
  }
  &-empty {
    padding-top: 48px;
    text-align: center;
    &-img {
      width: auto;
      max-width: 100%;
    }
    &-info {
      color: #999;
      margin: 68px 0 32px;
    }
    &-cursor {
      color: #409efe;
      cursor: pointer;
      text-decoration: none;
    }
  }
}
</style>
