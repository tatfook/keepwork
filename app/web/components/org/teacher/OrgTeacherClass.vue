<template>
  <div class="org-teacher-classes">
    <org-classes-tabbar :classes="orgClasses" @tab-click="handleSwitchClass" v-model="selectedClassId"></org-classes-tabbar>
    <div v-if="isShowAddStudentForm" class="org-teacher-classes-add">
      <div class="students-add-header">
        教师>添加学生 <span class="pull-right">
          <el-button class="students-add-header-button" @click="handleCancel">取消</el-button>
          <el-button class="students-add-header-button" @click="handleSave" type="primary">保存</el-button>
        </span>
      </div>
      <div class="students-add-main">
        <el-row>
          <el-col :span="10">
            <el-input></el-input>
          </el-col>
          <el-col :span="10">
            <el-input></el-input>
          </el-col>
          <el-col></el-col>
        </el-row>
      </div>
      <div class="students-add-bottom">
        <span><i class="el-icon-circle-plus-outline"></i> 继续添加</span>
      </div>
    </div>
    <div v-else class="org-teacher-classes-students">
      <div class="students-table-header">
        学生数:2
        <span class="add-student-button pull-right" @click="handleAddStudent"><i class="el-icon-circle-plus-outline"></i> 添加学生</span>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleRemoveStudent(scope)" size="mini">移出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import OrgClassesTabbar from '../common/OrgClassesTabbar'
import { keepwork } from '@/api'
const { lessonOrganizations: orgApi } = keepwork
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgTeacherClass',
  components: {
    OrgClassesTabbar
  },
  data() {
    return {
      selectedClassId: '',
      isShowAddStudentForm: false,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  async created() {
    await this.getOrgClasses()
    await this.getOrgClassStudentsById({ classId: this.firstOrgClassId })
    this.selectedClassId = this.firstOrgClassId
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/teacher/getOrgClasses',
      getOrgClassStudentsById: 'org/teacher/getOrgClassStudentsById'
    }),
    async handleSwitchClass(classId) {
      this.getOrgClassStudentsById({ classId })
      this.selectedClassId = classId
    },
    async handleRemoveStudent({ row }) {
      console.log(row)
    },
    handleAddStudent() {
      this.isShowAddStudentForm = true
    },
    handleCancel() {
      this.isShowAddStudentForm = false
    },
    handleSave() {
      console.log('handleSave----->')
    }
  },
  computed: {
    ...mapGetters({
      orgClasses: 'org/teacher/orgClasses',
      orgClassStudents: 'org/teacher/orgClassStudents'
    }),
    firstOrgClassId() {
      return _.get(this.orgClasses, '[0].id', '')
    },
    orgClassesCount() {
      return _.get(this.orgClasses, 'length', 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.org-teacher-classes {
  .pull-right {
    float: right;
    right: 0;
  }
  &-students {
    border-top: solid 1px #e8e8e8;
    background: #fff;
    padding: 0 24px 24px;
    box-sizing: border-box;
    .students-table-header {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #333;
      .add-student-button {
        color: #2397f3;
        cursor: pointer;
      }
    }
  }

  &-add {
    min-height: 330px;
    background: #fff;
    position: relative;
    .students-add {
      &-header {
        padding: 0 24px;
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        border-top: solid 1px #e8e8e8;
        border-bottom: solid 1px #e8e8e8;
        /deep/ &-button {
          padding: 8px 26px;
        }
      }
      &-main {
      }

      &-bottom {
        border-top: solid 1px #e8e8e8;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        height: 32px;
        line-height: 32px;
        text-align: center;
        color: #2397f3;
        cursor: pointer;
      }
    }
  }
}
</style>

