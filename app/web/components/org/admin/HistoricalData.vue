<template>
  <div class="historical-data" v-loading="loading">
    <historical-header />
    <h4 class="historical-data-title">{{$t('org.IncludeClasses')}}{{orgHistoricalClassesLength}}</h4>
    <div class="historical-data-container">
      <el-table class="historical-data-table" border :data="orgHistoricalClassesData" header-row-class-name="historical-data-table-header">
        <el-table-column prop="name" :label="$t('org.ClassNameLabel')">
        </el-table-column>
        <el-table-column prop="createdAtLabel" label="创建时间" width='160'></el-table-column>
        <el-table-column prop="updatedAtLabel" label="关闭时间" width='160'></el-table-column>
        <el-table-column prop="teachersName" label="教师姓名" width='130'></el-table-column>
        <el-table-column prop="studentCount" :label="$t('org.studentCunt')" width='80'></el-table-column>
        <el-table-column :label="$t('common.action')" width="100">
          <template slot-scope="scope">
            <router-link class='historical-data-table-link' :to='{name: "OrgHistoryClassDetail", query: scope.row}'>{{$t('org.Details')}}</router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="historical-data-pages" v-if="orgHistoricalClassesLength > 0">
      <el-pagination background @size-change="handleSizeChange" @current-change="targetPage" :current-page="page" :page-size="perPage" :page-sizes="[10,20,40,60,80,100,200,300]" :total="orgHistoricalClassesLength" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import HistoricalHeader from './common/HistoricalHeader'
import moment from 'moment'
export default {
  name: 'HistoricalData',
  data() {
    return {
      loading: true,
      perPage: 10,
      page: 1,
    }
  },
  computed: {
    ...mapGetters({
      orgHistoricalClasses: 'org/orgHistoricalClasses',
    }),
    orgHistoricalClassesData() {
      let classData = _.get(this.orgHistoricalClasses, 'rows', [])
      return _.map(classData, i => {
        const { createdAt, updatedAt } = i
        return {
          ...i,
          createdAtLabel: this.formatTime(createdAt),
          updatedAtLabel: this.formatTime(updatedAt),
          studentCount: this.getStudentCount(i.lessonOrganizationClassMembers),
          teachersName: this.getTeacherCount(i.lessonOrganizationClassMembers),
        }
      })
    },
    orgHistoricalClassesLength() {
      return this.orgHistoricalClasses.count
    },
  },
  async mounted() {
    await this.targetPage(1)
    this.loading = false
  },
  methods: {
    ...mapActions({
      getHistoryClasses: 'org/getHistoryClasses',
    }),
    handleSizeChange(val) {
      this.perPage = val
      this.targetPage(1)
    },
    targetPage(targetPage) {
      this.page = targetPage
      this.getHistoryClasses({ params: { 'x-page': this.page, 'x-per-page': this.perPage } })
    },
    getStudentCount(member) {
      let students = _.filter(member, i => (i.roleId & 1) > 0)
      return students.length
    },
    getTeacherCount(member) {
      let teachers = _.filter(member, i => (i.roleId & 2) > 0)
      let teachersName = _.map(teachers, teacher => teacher.realname)
      return teachersName.join(', ')
    },
    formatTime(time) {
      return time ? moment(time).format('YYYY/MM/DD HH:mm') : ''
    },
  },
  components: {
    HistoricalHeader,
  },
}
</script>

<style lang="scss" scoped>
.historical-data {
  background: #fff;
  border-radius: 8px;
  &-title {
    margin: 20px 0;
    font-size: 14px;
    color: #333;
    padding: 8px 24px 0;
  }
  &-container {
    padding: 0 24px;
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
