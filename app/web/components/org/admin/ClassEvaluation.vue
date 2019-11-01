<template>
  <div class="class-evaluation">
    <div class="class-evaluation-header">
      <div class="class-evaluation-header-title">
        <router-link :to="{name: 'EvaluationReport'}">评估报告</router-link>
        <i class="el-icon-arrow-right"></i>
        <span>{{className}}</span>
      </div>
      <el-dropdown class="class-evaluation-header-dropdown" @command="handleDayCommand">
        <span class="el-dropdown-link">
          {{selectDayOption.text}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(option, index) in dayOptions" :key="index" :command="option">{{option.text}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="class-evaluation-item" v-if="isClassHasReport">
      <div class="class-evaluation-charts">
        <div class="class-evaluation-column">
          <div class="class-evaluation-column-header">点评（次）</div>
          <div class="class-evaluation-column-item">
            <div class="class-evaluation-column-info">
              <p>总计：{{getKeyCount(classEvaluations)}}次</p>
              <p v-if="getKeyCount(classEvaluations)>0">老师贡献度：</p>
            </div>
            <annulus-chart v-if="getKeyCount(classEvaluations)>0" class="class-evaluation-annulus" :width="350" :annulusData="totalData" :chartColumn="chartColumn" />
          </div>
          <div class="class-evaluation-column-item">
            <div class="class-evaluation-column-info">
              <p>小评：{{getKeyCount(commentEvaluations)}}次</p>
              <p v-if="getKeyCount(commentEvaluations)>0">老师贡献度：</p>
            </div>
            <annulus-chart v-if="getKeyCount(commentEvaluations)>0" class="class-evaluation-annulus" :width="350" :annulusData="commentData" :chartColumn="chartColumn" />
          </div>
          <div class="class-evaluation-column-item">
            <div class="class-evaluation-column-info">
              <p>阶段总结：{{getKeyCount(summaryEvaluations)}}次</p>
              <p v-if="getKeyCount(summaryEvaluations)>0">老师贡献度：</p>
            </div>
            <annulus-chart v-if="getKeyCount(summaryEvaluations)>0" class="class-evaluation-annulus" :width="350" :annulusData="summaryData" :chartColumn="chartColumn" />
          </div>
        </div>
        <div class="class-evaluation-column">
          <div class="class-evaluation-column-header">发送给家长（次）</div>
          <div class="class-evaluation-column-item">
            <div class="class-evaluation-column-info">
              <p>总计：{{getKeyCount(classEvaluations, 'sendCount')}}次</p>
              <p v-if="getKeyCount(classEvaluations, 'sendCount')>0">老师贡献度：</p>
            </div>
            <annulus-chart v-if="getKeyCount(classEvaluations, 'sendCount')>0" class="class-evaluation-annulus" :width="350" :annulusData="sendData" :chartColumn="chartColumn" />
          </div>
        </div>
      </div>
    </div>
    <div class="class-evaluation-item" v-if="isClassHasReport">
      <div class="class-evaluation-item-search">
        <div class="class-evaluation-item-search-item">
          <label for="typeDropdown">报告类型：</label>
          <el-select v-model="searchType" @change="getTableData">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.text" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="class-evaluation-item-search-item">
          <el-input placeholder="按报告名称搜索" prefix-icon="el-icon-search" v-model.trim="searchName" @input="getTableData">
          </el-input>
        </div>
      </div>
      <el-table class="class-evaluation-table" :data="formatedTableData" border v-loading="isGettingTableData">
        <el-table-column prop="reportName" label="报告名称"></el-table-column>
        <el-table-column prop="typeText" label="报告类型" width="132"></el-table-column>
        <el-table-column prop="teacherName" label="点评老师" width="86"></el-table-column>
        <el-table-column prop="createdAtFormated" label="创建时间" width="140"></el-table-column>
        <el-table-column prop="sendCount" label="已发送（人）" width="110"></el-table-column>
        <el-table-column prop="commentCount" label="已点评（人）" width="110"></el-table-column>
        <el-table-column prop="waitComment" label="待点评（人）" width="110"></el-table-column>
      </el-table>
    </div>
    <div class="class-evaluation-empty" v-if="!isClassHasReport">
      <img src="@/assets/img/media_library_empty.png" alt="">
      <p>
        暂无数据
      </p>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import AnnulusChart from '@/components/org/common/AnnulusChart'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ClassEvaluation',
  async mounted() {
    this.selectDayOption = this.dayOptions[0]
    try {
      await Promise.all([
        this.getTableData(),
        this.orgGetClassEvaluation({
          classId: this.classId,
          days: this.selectDayOption.value
        })
      ])
    } catch (error) {}
  },
  data() {
    return {
      isClassHasReport: false,
      isGettingTableData: false,
      typeOptions: [
        {
          value: null,
          text: '全部'
        },
        {
          value: 1,
          text: '小评'
        },
        {
          value: 2,
          text: '阶段总结'
        }
      ],
      searchType: null,
      searchName: '',
      chartColumn: ['realnameLabel', 'count'],
      dayOptions: [
        {
          value: 30,
          text: '近30天'
        },
        {
          value: 7,
          text: '近7天'
        },
        {
          value: null,
          text: '全部'
        }
      ],
      selectDayOption: {}
    }
  },
  computed: {
    ...mapGetters({
      getClassEvaluation: 'org/getClassEvaluation',
      getClassEvaluationList: 'org/getClassEvaluationList'
    }),
    classId() {
      return _.get(this.$route, 'params.classId')
    },
    classEvaluationList() {
      return _.sortBy(
        this.getClassEvaluationList({ classId: this.classId }) || [],
        o => -new Date(o.createdAt).valueOf()
      )
    },
    formatedTableData() {
      return _.map(this.classEvaluationList, item => {
        let { type, createdAt } = item
        return {
          ...item,
          typeText: type == 1 ? '小评' : '阶段总结',
          createdAtFormated: moment(createdAt).format('YYYY/MM/DD')
        }
      })
    },
    classEvaluations() {
      return this.getClassEvaluation({ classId: this.classId }) || []
    },
    className() {
      return _.get(this.classEvaluations[0], 'className', this.classId)
    },
    totalData() {
      return this.formatedAnnulusData(this.classEvaluations)
    },
    commentEvaluations() {
      return _.filter(this.classEvaluations, { type: 1 })
    },
    commentData() {
      return this.formatedAnnulusData(this.commentEvaluations)
    },
    summaryEvaluations() {
      return _.filter(this.classEvaluations, { type: 2 })
    },
    summaryData() {
      return this.formatedAnnulusData(this.summaryEvaluations)
    },
    sendData() {
      return this.formatedAnnulusData(this.classEvaluations, 'sendCount')
    }
  },
  methods: {
    ...mapActions({
      orgGetClassEvaluation: 'org/getClassEvaluation',
      orgGetClassEvaluationList: 'org/getClassEvaluationList'
    }),
    getKeyCount(originData, dataKey) {
      dataKey = dataKey || 'commentCount'
      return _.reduce(
        originData,
        (oldResult, value) => {
          return oldResult + value[dataKey]
        },
        0
      )
    },
    formatedAnnulusData(originData, dataKey) {
      dataKey = dataKey || 'commentCount'
      const allCount = _.reduce(
        originData,
        (oldResult, value) => {
          return oldResult + value[dataKey]
        },
        0
      )
      let result = []
      _.forEach(_.groupBy(originData, 'teacherName'), (userValues, key) => {
        let totalCount = _.reduce(
          userValues,
          (oldResult, value) => {
            return oldResult + value[dataKey]
          },
          0
        )
        let percentage =
          allCount != 0 ? _.round((totalCount / allCount) * 100, 0) : 0
        result.push({
          realname: key,
          realnameLabel: `${key} ${percentage}%`,
          count: totalCount
        })
      })
      return result
    },
    async handleDayCommand(dayOption) {
      this.selectDayOption = dayOption
      this.isLoading = true
      try {
        await Promise.all([
          this.getTableData(),
          this.orgGetClassEvaluation({
            classId: this.classId,
            days: dayOption.value
          })
        ])
        await this.orgGetOrgClassReport({ days: dayOption.value })
      } catch (error) {
        console.log(error)
      }
      this.isLoading = false
    },
    async getTableData() {
      this.isGettingTableData = true
      try {
        await this.orgGetClassEvaluationList({
          classId: this.classId,
          name: this.searchName,
          type: this.searchType,
          days: this.selectDayOption.value,
          roleId: 64
        })
        if (!this.isClassHasReport) {
          this.isClassHasReport =
            this.classEvaluationList.length > 0 ? true : false
        }
      } catch (error) {}
      this.isGettingTableData = false
    }
  },
  components: {
    AnnulusChart
  }
}
</script>
<style lang="scss" scoped>
.class-evaluation {
  min-height: 100%;
  position: relative;
  &-item {
    padding: 0 28px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    margin-bottom: 16px;
    &-search {
      font-size: 14px;
      color: #000;
      margin: 32px 0 12px;
      &-item {
        display: inline-block;
        margin-right: 120px;
        /deep/.el-select {
          width: 122px;
          .el-input__inner {
            border: 1px solid #dcdfe6;
          }
        }
        /deep/.el-input__inner {
          height: 24px;
          line-height: 24px;
          border: none;
        }
        /deep/.el-input__icon {
          line-height: 24px;
        }
      }
    }
  }
  &-header {
    padding: 32px 28px;
    border-bottom: 1px solid #cacaca;
    font-size: 18px;
    color: #000;
    display: flex;
    justify-content: center;
    background-color: #fff;
    border: 1px solid #e8e8e8;
    margin-bottom: -1px;
    border-radius: 4px 4px 0 0;
    &-title {
      flex: 1;
      & > .el-icon-arrow-right {
        margin-left: 18px;
      }
      & > a {
        text-decoration: none;
        color: inherit;
        &:hover {
          color: #409efe;
        }
      }
      & > span {
        color: #ababab;
      }
    }
    &-dropdown {
      font-size: 14px;
      cursor: pointer;
    }
  }
  &-charts {
    display: flex;
    padding: 40px 0;
  }
  &-column {
    flex: 1;
    border-right: 1px solid #dadada;
    padding: 0 36px;
    &:last-child {
      border-right: none;
    }
    &-header {
      text-align: center;
      font-size: 18px;
      color: #000;
      font-weight: bold;
      margin-bottom: 36px;
    }
    &-item {
      position: relative;
      padding: 21px 0;
    }
    &-info {
      position: absolute;
      & > p {
        margin: 0;
        font-size: 14px;
        color: #555;
      }
    }
  }
  &-annulus {
    position: relative;
  }
  &-table {
    margin-bottom: 36px;
  }
  &-empty {
    background-color: #fff;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: auto;
    top: 88px;
    & > p {
      font-size: 14px;
      color: #666;
      margin: 26px 0 0;
    }
  }
}
</style>
