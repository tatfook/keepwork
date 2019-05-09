<template>
  <div class="historical-data" v-loading="loading">
    <h4 class="historical-data-title">{{$t('org.IncludeClasses')}}{{orgHistoricalClassesLength}}</h4>
    <el-table v-if="orgHistoricalClassesLength > 0" class="historical-data-table" border :data="orgHistoricalClassesData" header-row-class-name="historical-data-table-header">
      <el-table-column prop="name" :label="$t('org.ClassNameLabel')" width="150">
      </el-table-column>
      <el-table-column :label="$t('org.beginClassTime')" width="180">
        <template slot-scope="scope">{{scope.row.begin | formatTime}} - {{scope.row.end | formatTime}}</template>
      </el-table-column>
      <el-table-column prop="teachersName" :label="$t('org.teachersName')" width='130'></el-table-column>
      <el-table-column prop="studentCount" :label="$t('org.studentCunt')" width='130'></el-table-column>
      <el-table-column :label="$t('common.action')">
        <template slot-scope="scope">
          <router-link class='historical-data-table-link' :to='{name: "OrgHistoryClassDetail", query: scope.row}'>{{$t('org.Details')}}</router-link>
          <router-link class='historical-data-table-link' :to='{name: "OrgHistoryEditClass", query: scope.row}'>{{$t('org.Edit')}}</router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="historical-data-empty" v-if="orgHistoricalClassesLength == 0">
      <img class="historical-data-empty-img" src="@/assets/org/list_empty.png" alt="">
      <p class="historical-data-empty-info">{{$t('org.getStarted')}}
        <router-link :to="{name: 'OrgNewClass'}" class="historical-data-empty-cursor">{{$t('org.addFirstClass')}}</router-link>
      </p>
    </div>
      <div class="historical-data-pages" v-if="orgHistoricalClassesLength > 0">
      <el-pagination background @size-change="handleSizeChange" @current-change="targetPage" :current-page="page" :page-size="perPage" :page-sizes="[10,20,40,60,80,100,200,300]" :total="orgHistoricalClassesLength" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'HistoricalData',
  data() {
    return {
      loading: true,
      perPage: 10,
      page: 1
    }
  },
  computed: {
    ...mapGetters({
      orgHistoricalClasses: 'org/orgHistoricalClasses'
    }),
    orgHistoricalClassesData() {
      let classData = _.get(this.orgHistoricalClasses, 'rows', [])
      return _.map(classData, i => {
        return {
          id: i.id,
          organizationId: i.organizationId,
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
          name: i.name,
          begin: i.begin,
          end: i.end,
          studentCount: this.getStudentCount(i.lessonOrganizationClassMembers),
          teachersName: this.getTeacherCount(i.lessonOrganizationClassMembers)
        }
      })
    },
    orgHistoricalClassesLength() {
      return this.orgHistoricalClasses.count
      return this.orgHistoricalClassesData.length
    }
  },
  async mounted() {
    await this.targetPage(1)
    this.loading = false
  },
  methods: {
    ...mapActions({
      getHistoryClasses: 'org/getHistoryClasses'
    }),
    handleSizeChange(val) {
      this.perPage = val
    },
    targetPage(targetPage) {
      this.page = targetPage
      this.getHistoryClasses({params: { 'x-page': this.page, 'x-per-page': this.perPage }})
    },
    getStudentCount(member) {
      let students = _.filter(member, i => (i.roleId & 1) > 0)
      return students.length
    },
    getTeacherCount(member) {
      let teachers = _.filter(member, i => (i.roleId & 2) > 0)
      let teachersName = _.map(teachers, teacher => teacher.realname)
      return teachersName.join(', ')
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
.historical-data {
  background: #fff;
  border: solid 1px #e8e8e8;
  padding: 0 24px 26px;
  &-title {
    margin: 20px 0;
    font-size: 14px;
    color: #333;
  }
  &-table {
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
  &-pages {
    text-align: center;
    margin: 40px;
  }
}
</style>
