<template>
  <div class="teacher-report-detail">
    <div class="teacher-report-detail-header">
      <span class="teacher-report-detail-header-name">报告名称</span> <span class="teacher-report-detail-header-tag">{{reportName}}</span> <i @click="handleShowEditReportDialog" class="iconfont icon-edit1 teacher-report-detail-header-edit"></i>
    </div>
    <div class="teacher-report-detail-main">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="待点评" name="1">
          <div class="teacher-report-detail-main-table">
            <el-table :data="toCommentTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" border="" style="width: 100%">
              <el-table-column prop="studentId" label="序号">
              </el-table-column>
              <el-table-column prop="realname" label="学生姓名">
              </el-table-column>
              <el-table-column prop="reportName" label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button size="small" @click="handleToCommnet(scope.row)">点评</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已点评" name="2" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
          <div class="teacher-report-detail-main-search">
            <div class="left-side">
              按发送状态显示：
              <el-dropdown class="search-dropdown" @command="handleSearchByStatus">
                <span class="el-dropdown-link">
                  {{sendStatusText}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="0">待发送</el-dropdown-item>
                  <el-dropdown-item command="1">已发送</el-dropdown-item>
                  <el-dropdown-item command="-1">全部</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <span class="search-input">
                <el-input placeholder="按学生姓名搜索" v-model="studentName">
                  <template slot="append">
                    <i class="el-icon-search" @click="handleSearchByStudentName"></i>
                  </template>
                </el-input>
              </span>
            </div>
            <div class="right-side">
              <el-button @click="handleToBulkPrint" size="small">打印</el-button>
              <el-button @click="handleSMS" :loading="isSending" size="small" type="primary">发送给家长</el-button>
            </div>
          </div>
          <div class="teacher-report-detail-main-table">
            <el-table :data="hasCommentTable" @selection-change="handleSelectionChange" border="" style="width: 100%">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="studentId" label="序号" width="120">
              </el-table-column>
              <el-table-column prop="realname" label="学生姓名" width="120">
              </el-table-column>
              <el-table-column label="点评时间" width="180">
                <template slot-scope="scope">
                  <span>{{scope.row.createdAt | formatTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="发送状态" width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.isSend | formatSendStatus}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button @click.native.prevent="toCommentDetail(scope.row)" size="small">
                    详情
                  </el-button>
                  <el-button @click.native.prevent="handleDeleteComment(scope.row)" size="small">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog custom-class="teacher-report-detail-dialog" :visible.sync="isShowEditDialog" width="552px">
      <div class="teacher-report-detail-dialog-title" slot="title">
        编辑
      </div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="报告名称:" prop="name">
          <el-input v-model.trim="form.name" placeholder="报告名称"></el-input>
        </el-form-item>
      </el-form>
      <report-type :showPreviewButton="false" v-model="form.type" class="report-type-reset"></report-type>
      <div slot="footer">
        <el-button @click="handleCancelEditReport">取消</el-button>
        <el-button :loading="loading" @click="handleUpdateReport" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ReportType from './ReportType'
import moment from 'moment'
import { keepwork } from '@/api'
export default {
  name: 'OrgTeacherReportDetail',
  components: {
    ReportType
  },
  filters: {
    formatTime(value) {
      return moment(value).format('YYYY/MM/DD HH:mm')
    },
    formatSendStatus(isSend) {
      return isSend == 1 ? '已发送' : '待发送'
    }
  },
  data() {
    return {
      activeName: '1',
      sendStatus: 0,
      studentName: '',
      loading: false,
      isSending: false,
      isPirnting: false,
      isShowEditDialog: false,
      selection: [],
      rules: {
        name: [
          { required: true, message: '报告名称不能为空', trigger: 'change' }
        ]
      },
      form: {
        name: '',
        type: 1
      }
    }
  },
  async created() {
    await this.getReportTable()
  },
  watch: {
    async activeName(activeName) {
      this.studentName = ''
      await this.getReportTable()
    }
  },
  computed: {
    ...mapGetters({
      evaluationReportDetail: 'org/teacher/evaluationReportDetail',
      currentOrg: 'org/currentOrg'
    }),
    orgName() {
      return this.currentOrg.name
    },
    searchParams() {
      const params = {
        status: this.activeName
      }
      if (this.activeName == '2' && this.sendStatus != -1) {
        params['isSend'] = this.sendStatus
      }
      if (this.studentName) {
        params['realname'] = this.studentName
      }
      return params
    },
    reportName() {
      return this.$route.query.reportName
    },
    reportType() {
      return _.get(this.$route, 'query.type', '')
    },
    sendStatusDict() {
      return {
        0: '待发送',
        1: '已发送',
        '-1': '全部'
      }
    },
    reportId() {
      return _.toNumber(this.$route.query.reportId)
    },
    sendStatusText() {
      return this.sendStatusDict[this.sendStatus]
    },
    toCommentTable() {
      return _.get(this.evaluationReportDetail, 1, [])
    },
    hasCommentTable() {
      return _.get(this.evaluationReportDetail, 2, [])
    },
    classId() {
      return _.toNumber(this.$route.query.classId)
    },
    reportURL() {
      const origin = window.location.origin
      const { orgLoginUrl } = this.$route.params
      return `${origin}/org/${orgLoginUrl}/report`
    }
  },
  methods: {
    ...mapActions({
      getEvaluationReportDetail: 'org/teacher/getEvaluationReportDetail',
      updateEvaluationReport: 'org/teacher/updateEvaluationReport',
      deleteEvaluationReportComment: 'org/teacher/deleteEvaluationReportComment'
    }),
    async getReportTable() {
      try {
        this.loading = true
        await this.getEvaluationReportDetail({
          reportId: this.reportId,
          params: this.searchParams
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async handleUpdateReport() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            await this.updateEvaluationReport(this.form)
            this.$message.success('更新成功')
            this.updateURL(this.form)
            this.isShowEditDialog = false
          } catch (error) {
            this.$message.error(error)
            console.error(error)
          } finally {
            this.loading = false
          }
        }
      })
    },
    updateURL({ name, type }) {
      this.$router.push({
        query: {
          ...this.$route.query,
          reportName: name,
          type
        }
      })
    },
    handleShowEditReportDialog() {
      this.form = {
        name: this.reportName,
        type: _.toNumber(this.reportType),
        reportId: this.reportId
      }
      this.isShowEditDialog = true
    },
    handleCancelEditReport() {
      this.isShowEditDialog = false
    },
    async handleSearchByStatus(sendStatus) {
      this.sendStatus = sendStatus
      await this.getReportTable()
    },
    async handleSearchByStudentName() {
      await this.getReportTable()
    },
    handleSelectionChange(selection) {
      this.selection = selection
    },
    handleToCommnet(row) {
      this.$router.push({
        name: 'OrgTeacherReportComment',
        query: {
          ...this.$route.query,
          ...row
        }
      })
    },
    async handleDeleteComment({ userReportId, realname }) {
      this.$confirm(`确定删除对${realname}的点评吗?`, '提示', {
        type: 'warning'
      })
        .then(async res => {
          try {
            this.loading = true
            await this.deleteEvaluationReportComment(userReportId)
            await this.getReportTable()
          } catch (error) {
            this.$message.error(
              _.get(error, 'response.data.message', '删除失败')
            )
          } finally {
            this.loading = false
          }
        })
        .catch(() => {})
    },
    toCommentDetail(row) {
      this.$router.push({
        name: 'OrgTeacherReportCommentDetail',
        query: {
          ...this.$route.query,
          ...row
        }
      })
    },
    generaURL(obj) {
      const {
        classId,
        reportName,
        type,
        userReportId,
        studentId,
        realname
      } = obj
      const paramsObj = {
        classId,
        reportName,
        type,
        userReportId,
        studentId,
        realname
      }
      const arr = _.map(_.keys(paramsObj), key => {
        return `${key}=${paramsObj[key]}`
      })
      return arr.join('&')
    },
    generaSMSData(arr) {
      const dataArr = _.map(arr, item => {
        const { parentPhoneNum, realname, star, studentId, userReportId } = item
        const params = {
          parentPhoneNum,
          realname,
          star,
          studentId,
          userReportId,
          classId: this.classId,
          type: this.reportType,
          baseUrl: this.reportURL,
          reportName: this.reportName,
          orgName: this.orgName
        }
        const query = this.generaURL(params)
        params.baseUrl = encodeURI(`${params.baseUrl}?${query}`)
        return params
      })
      return dataArr
    },
    handleSMS() {
      if (this.selection.length === 0) {
        this.$message.error('请选择学生')
        return
      }
      const selection = this.selection.filter(item => item.isSend === 0)
      const noParentPhonArr = _.reduce(
        selection,
        (arr, cur) => {
          if (!cur.parentPhoneNum) {
            arr.push(cur)
          }
          return arr
        },
        []
      )
      if (noParentPhonArr.length > 0) {
        const studentNameStr = _.map(
          noParentPhonArr,
          item => item.realname
        ).join(',')
        this.$alert(studentNameStr, '如下学生未设置家长手机号，请先设置。', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return
      }
      this.$confirm('确定将评估报告发送给学生家长吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          try {
            if (selection.length === 0) {
              return this.$message.success('发送成功')
            }
            this.isSending = true
            const dataArr = this.generaSMSData(selection)
            const failArr = await keepwork.evaluationReports.reportToParent({
              dataArr
            })
            if (failArr.length > 0) {
              this.$message({
                message: `以下学生发送失败: ${failArr.join(',')}, 其余发送成功`,
                type: 'warning',
                showClose: true,
                duration: 10000
              })
            } else {
              this.$message.success('发送成功')
            }
            await this.getReportTable()
          } catch (error) {
            const errMsg = _.get(error, 'response.data.message', '发送失败')
            console.error(error)
            this.$message.error(errMsg)
          } finally {
            this.isSending = false
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    async handleToBulkPrint() {
      if (this.selection.length === 0) {
        return this.$message.error('请选择学生')
      }
      try {
        this.isPirnting = true
        for (let item of this.selection) {
          const URL = this.$router.resolve({
            name: 'OrgPrint',
            query: {
              reportName: this.reportName,
              classId: this.classId,
              type: this.reportType,
              ...item
            }
          }).href
          await this.printReport(URL)
        }
      } catch (error) {
        console.error(error)
        this.$message.error('打印出错')
      } finally {
        this.isPirnting = false
      }
    },
    async printReport(URL) {
      await new Promise((resolve, reject) => {
        let a = document.createElement('a')
        a.target = '_blank'
        a.style.display = 'none'
        a.href = URL
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          a.remove()
          resolve()
        }, 300)
      }).catch(e => console.error(e))
    }
  }
}
</script>

<style lang="scss" scoped>
.teacher-report-detail {
  &-header {
    background: #fff;
    padding: 0 24px;
    height: 57px;
    line-height: 57px;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    color: #333;
    &-tag {
      font-size: 14px;
      border-radius: 4px;
      background: #ffd21f;
      color: #8e4c1d;
      padding: 2px 6px;
      margin-left: 4px;
    }
    &-edit {
      color: #409efe;
      margin-left: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }

  &-main {
    padding: 22px 24px;
    background: #fff;
    &-search {
      height: 96px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .search-dropdown {
        border: 1px solid #e8e8e8;
        padding: 6px 10px;
        border-radius: 4px;
        cursor: pointer;
        /deep/.el-dropdown-link {
          width: 110px;
          display: inline-block;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
        }
      }
      .search-input {
        display: inline-block;
        border-bottom: 1px solid #aaaaaa;
        margin-left: 47px;
        /deep/ .el-input__inner {
          border: none;
          height: 36px;
          line-height: 36px;
        }
        /deep/ .el-input-group__append {
          background: #fff;
          border: none;
          cursor: pointer;
          padding: 0 10px 0 0;
        }
      }
    }
  }

  /deep/ &-dialog {
    &-title {
      text-align: center;
      font-size: 18px;
      color: #303133;
      border-bottom: 1px solid #e8e8e8;
    }
    .el-dialog__headerbtn {
      font-size: 22px;
    }
    .el-dialog__header {
      padding: 0;
      height: 59px;
      line-height: 59px;
    }
    .el-dialog__body {
      padding: 16px 34px 30px;
    }
    .report-type-reset {
      margin-top: 34px;
      padding: 0;
    }
  }
}
</style>