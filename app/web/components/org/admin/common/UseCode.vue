<template>
  <div class="use-code" v-loading="isLoading">
    <div class="use-code-header">
      <div class="left">
        <span class="link" @click="toStudentListPage">学生</span>
        <span class="seperator">&gt;</span>
        <span class="label">{{nowPageText}}</span>
      </div>
      <div class="operates">
        <el-button v-if="step==1" @click="toStudentListPage">取消</el-button>
        <el-button v-if="step==1" type="primary" @click="toStep(2)">下一步</el-button>
        <el-button v-if="step==2" @click="toStep(1)">上一步</el-button>
        <el-button v-if="step==2" type="primary" @click="confirmOperate">确认</el-button>
      </div>
    </div>
    <div class="use-code-title">
      第<span class="step">{{step}}</span>步：{{stepText}}
      <p class="info" v-if="step==2">说明：点击“确认”按钮，系统将根据下方信息自动生成邀请码，并激活学生账号</p>
    </div>
    <div class="use-code-step1" v-show="step==1">
      <div class="title">已选中用户<span>(共{{waitingStudents.length}}位)</span></div>
      <div class="list">
        <div class="item" v-for="(student, index) in waitingStudents" :key="index">
          <span class="realname">{{student.realname}}</span>
          <span class="username">{{student.users.username}}</span>
          <i class="el-icon-close" @click="removeStudent(student)"></i>
        </div>
      </div>
      <div class="title"><span class="selectable-label">(可选)</span>班级选择</div>
      <el-select class="class-selector" multiple collapse-tags v-loading="classesLoading" v-model="classIds">
        <el-option v-for="(classItem, index) in orgClasses" :key="index" :label="classItem.name" :value="classItem.id">
        </el-option>
      </el-select>
      <div class="warning">(选择班级后，用户可学习对应班级的课程。)</div>
    </div>
    <div class="use-code-step2" v-show="step==2">
      <div class="header">生成邀请码：</div>
      <div class="container">
        <div class="item">
          <div class="label"><span class="info">(可选)</span>班级</div>
          <div class="content">{{selectedClassStr}}</div>
        </div>
        <invitation-code-types ref="codeTypesRef" :isTryShow="isTryShow" />
        <div class="item">
          <div class="label">生成指定数量</div>
          <div class="content">{{waitingStudents.length}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InvitationCodeTypes from './InvitationCodeTypes'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'UseCode',
  props: {
    nowPageText: String,
    selectedStudents: Array,
    isTryShow: {
      type: Boolean,
      default: true,
    },
  },
  async mounted() {
    this.classesLoading = true
    try {
      await this.getCurrentOrgClassList()
    } catch (error) {}
    this.classesLoading = false
  },
  data() {
    return {
      isLoading: false,
      step: 1,
      waitingStudents: [],
      classIds: [],
      classesLoading: false,
    }
  },
  computed: {
    ...mapGetters({
      currentOrgId: 'org/currentOrgId',
      getOrgClassesById: 'org/getOrgClassesById',
    }),
    orgClasses() {
      return this.getOrgClassesById({ id: this.currentOrgId }) || []
    },
    stepText() {
      return this.step == 1 ? '确认学生信息' : '为学生配置邀请码，并激活学生账号'
    },
    selectedClassStr() {
      return _.map(this.classIds, classId => {
        return _.find(this.orgClasses, classDetail => classDetail.id === classId).name
      }).join('、')
    },
  },
  methods: {
    ...mapActions({
      getCurrentOrgClassList: 'org/getCurrentOrgClassList',
      orgToBeFormal: 'org/toBeFormal',
      orgRenew: 'org/renew',
    }),
    toStudentListPage() {
      this.$emit('cancel')
    },
    confirmOperate() {
      const params = {
        type: this.$refs.codeTypesRef.activeTypeValue,
        userIds: _.map(this.waitingStudents, student => student.id),
        classIds: this.classIds,
      }
      this.$emit('save', params)
    },
    removeStudent(student) {
      if (this.waitingStudents.length === 1) {
        this.$confirm('已选中用户全部移出后，将关闭该页面。确定移出该用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.toStudentListPage()
        })
        return
      }
      this.$confirm('确定将这个学生从队列里删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const waitingStudents = this.waitingStudents
        this.waitingStudents.splice(waitingStudents.findIndex(item => item.id === student.id), 1)
      })
    },
    toStep(step) {
      this.step = step
    },
  },
  watch: {
    selectedStudents: {
      handler(students) {
        this.waitingStudents = students
      },
      immediate: true,
    },
  },
  components: {
    InvitationCodeTypes,
  },
}
</script>
<style lang="scss" scoped>
.use-code {
  font-size: 16px;
  &-header {
    display: flex;
    padding: 10px 24px;
    border-bottom: 1px solid #e8e8e8;
    align-items: center;
    .left {
      align-items: center;
      flex: 1;
      color: #999;
    }
    .link {
      cursor: pointer;
      &:hover {
        color: #2397f3;
      }
    }
    .label {
      color: #333;
    }
    .el-button {
      width: 90px;
      height: 36px;
      line-height: 36px;
      padding: 0;
    }
  }
  &-title {
    margin: 0 24px;
    padding: 20px 0;
    border-bottom: 1px solid #e8e8e8;
    .step {
      display: inline-block;
      width: 20px;
      height: 20px;
      color: #1385ff;
      border: 1px solid;
      background-color: #ecf5ff;
      margin: 0 8px;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
    }
    .info {
      font-size: 14px;
      color: #1385ff;
      margin: 18px 0 0;
    }
  }
  &-step1 {
    padding: 28px 24px;
    .info {
      color: #1385ff;
    }
    .list {
      width: 238px;
      border: 1px solid #e8e8e8;
      padding: 16px 20px;
      margin: 18px 0 40px;
    }
    .item {
      position: relative;
      margin-bottom: 8px;
      background-color: #f1f1f1;
      font-size: 14px;
      padding: 0 16px;
      height: 32px;
      line-height: 32px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .username {
      margin-left: 16px;
    }
    .el-icon-close {
      display: none;
      background-color: #f50f10;
      color: #fff;
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
    }
    .item:hover {
      .el-icon-close {
        display: inline-block;
      }
    }
    .class-selector {
      margin: 16px 0 12px;
    }
    .selectable-label {
      color: #999;
      margin-right: 3px;
    }
    .warning {
      color: #e6a23c;
    }
  }
  &-step2 {
    font-size: 14px;
    color: #999;
    margin: 24px;
    width: 636px;
    border: 1px solid #e8e8e8;
    .header {
      font-size: 16px;
      color: #333;
      height: 50px;
      line-height: 50px;
      padding-left: 24px;
      border-bottom: 1px solid #e8e8e8;
    }
    .container {
      padding: 20px 0 80px;
    }
    .label {
      width: 120px;
      color: #595959;
      display: inline-block;
      padding-right: 16px;
      text-align: right;
      box-sizing: border-box;
    }
    .content {
      display: inline-block;
    }
    .item {
      margin: 28px 0;
    }
    .info {
      color: #999;
    }
  }
}
</style>
