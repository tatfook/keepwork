<template>
  <div class="class-list" v-loading="isLoading">
    <div class="class-list-header" v-if="orgClassesLength > 0">
      <div class="class-list-header-count">{{$t('org.IncludeClasses') + orgClasses.length + $t('org.classesCountUnit')}}</div>
      <router-link class="class-list-header-new" :to="{name: 'OrgNewClass'}">
        <i class="el-icon-circle-plus-outline"></i>{{$t('org.NewClass')}}
      </router-link>
    </div>
    <el-table v-if="orgClassesLength > 0" class="class-list-table" border :data="orgClasses" header-row-class-name="class-list-table-header">
      <el-table-column prop="name" :label="$t('org.ClassNameLabel')">
      </el-table-column>
      <el-table-column label="创建时间" width="240"><template slot-scope="scope">{{scope.row.createdAt | formatTime}}</template></el-table-column>
      <el-table-column :label="$t('common.action')" width="252">
        <template slot-scope="scope">
          <router-link class='class-list-table-link' :to='{name: "OrgEditClass", query: scope.row}'>课程</router-link>
          <router-link class='class-list-table-link' :to='{name: "OrgClassMembers", query: {id:scope.row.id, className: scope.row.name}}'>成员</router-link>
          <el-button class='class-list-table-link' @click="showWarningDialog(scope.row)">关闭班级</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="class-list-empty" v-if="orgClassesLength == 0">
      <img class="class-list-empty-img" src="@/assets/org/list_empty.png" alt="">
      <p class="class-list-empty-info">{{$t('org.getStarted')}} <router-link :to="{name: 'OrgNewClass'}" class="class-list-empty-cursor">{{$t('org.addFirstClass')}}</router-link>
      </p>
    </div>
    <el-dialog custom-class="class-list-warning" :visible.sync="isCloseWarningVisible" width="524px" center>
      <div class="class-list-warning-title">确定关闭该班级吗？</div>
      <div class="class-list-warning-info">（关闭后，该班级的学生将不能继续学习班级下的课程，且班级关闭后不能重新开启，请谨慎操作）</div>
      <span slot="footer" class="class-list-warning-footer">
        <el-button @click="isCloseWarningVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeClass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'ClassList',
  data() {
    return {
      isCloseWarningVisible: false,
      isLoading: false,
      closingClass: {},
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgClassesById: 'org/getOrgClassesById',
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    },
    orgClassesLength() {
      return this.orgClasses.length
    },
  },
  methods: {
    ...mapActions({
      endClass: 'org/endClass',
    }),
    showWarningDialog(classDetail) {
      this.isCloseWarningVisible = true
      this.closingClass = classDetail
    },
    async closeClass() {
      this.isCloseWarningVisible = false
      this.isLoading = true
      try {
        await this.endClass({ classId: this.closingClass.id })
        this.$message({
          type: 'success',
          message: '关闭成功',
        })
      } catch (error) {
        this.$message({
          type: 'error',
          message: '关闭失败',
        })
      }
      this.isLoading = false
    },
  },
  filters: {
    formatTime(time) {
      return time ? moment(time).format('YYYY/MM/DD HH:mm') : ''
    },
  },
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
      padding: 0;
      text-decoration: none;
      width: 64px;
      display: inline-block;
      text-align: center;
      font-size: 12px;
      height: 20px;
      line-height: 18px;
      margin-right: 4px;
      box-sizing: border-box;
      &:last-child {
        margin-right: 0;
        background-color: #2397f3;
        color: #fff;
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
  /deep/ &-warning {
    &-info {
      color: #2397f3;
      margin-top: 18px;
    }
    .el-button {
      width: 120px;
      height: 36px;
      padding: 0;
    }
    .el-dialog__body {
      text-align: center;
      font-size: 16px;
      color: #303133;
    }
  }
}
</style>
