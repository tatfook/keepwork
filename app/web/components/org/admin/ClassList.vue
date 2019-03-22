<template>
  <div class="class-list">
    <div class="class-list-header">
      <div class="class-list-header-count">{{$t('org.IncludeClasses') + orgClasses.length + $t('org.classesCountUnit')}}</div>
      <router-link class="class-list-header-new" :to="{name: 'OrgNewClass'}">
        <i class="el-icon-circle-plus-outline"></i>{{$t('org.NewClass')}}
      </router-link>
    </div>
    <el-table class="class-list-table" border :data="orgClasses" header-row-class-name="class-list-table-header">
      <el-table-column prop="name" :label="$t('org.ClassNameLabel')" width="240">
      </el-table-column>
      <el-table-column :label="$t('org.LessonPackagesAvailable')">
        <template slot-scope="scope">
          <router-link class='class-list-table-link' :to='{name: "OrgClassDetail", query: scope.row}'>{{$t('org.Details')}}</router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ClassList',
  async mounted() {
    await this.getOrgClassList({
      organizationId: this.orgId
    })
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgClassesById: 'org/getOrgClassesById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    }
  },
  methods: {
    ...mapActions({
      getOrgClassList: 'org/getOrgClassList'
    })
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
    width: 560px;
    &-header {
      font-size: 14px;
      color: #909399;
    }
    &-link {
      color: #2397f3;
    }
  }
  .el-icon-circle-plus-outline {
    margin-right: 4px;
    vertical-align: middle;
  }
}
</style>
