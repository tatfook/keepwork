<template>
  <div class="comment-list">
    <p class="comment-list-total">共收到<span>{{formatedListData.length}}</span>份评估报告</p>
    <el-table class="comment-list-table" :data="formatedListData" border>
      <el-table-column prop="createTime" label="点评时间" width="174">
      </el-table-column>
      <el-table-column prop="teacherName" label="点评人">
      </el-table-column>
      <el-table-column prop="reportName" label="报告名称" width="140">
      </el-table-column>
      <el-table-column prop="type" label="报告类型" width="140">
        <template slot-scope="scope">
          {{scope.row.type | reportTypeName}}
        </template>
      </el-table-column>
      <el-table-column prop="starText" label="总体评价" width="140">
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <div class="comment-list-table-btn" @click="viewDetail(scope.row)">查看</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'CommentList',
  filters: {
    reportTypeName(type) {
      const DICT = {
        1: '小评',
        2: '阶段总结'
      }
      return DICT[type]
    }
  },
  computed: {
    ...mapGetters({
      getEvaluationCommentListByClassId:
        'org/student/getEvaluationCommentListByClassId'
    }),
    classId() {
      return _.toNumber(_.get(this.$route, 'params.classId'))
    },
    evaluationCommentList() {
      return _.sortBy(
        this.getEvaluationCommentListByClassId({ classId: this.classId }) || [],
        o => -new Date(o.createdAt).valueOf()
      )
    },
    formatedListData() {
      return _.map(this.evaluationCommentList, comment => {
        let { createdAt, star } = comment
        return {
          ...comment,
          starText: star + '星',
          createTime: moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    }
  },
  methods: {
    viewDetail({ id, type, reportName }) {
      this.$router.push({
        name: 'OrgStudentEvaluationDetail',
        params: {
          classId: this.classId
        },
        query: {
          userReportId: id,
          classId: this.classId,
          reportName,
          type
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.comment-list {
  &-total {
    font-size: 14px;
    color: #666;
    & > span {
      font-weight: bold;
      color: #333;
    }
  }
  &-table {
    &-btn {
      font-size: 12px;
      width: 64px;
      height: 20px;
      line-height: 20px;
      color: #2397f3;
      border: 1px solid;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
    }
    /deep/th {
      font-weight: normal;
    }
  }
}
</style>
