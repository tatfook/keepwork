<template>
  <div class="transaction-detail">
    <div class="transaction-detail-header">
      交易明细
    </div>
    <div class="transaction-detail-main">
      <div class="transaction-detail-main-row" v-for="(item, index) in trades" :key="index">
        <div class="transaction-detail-main-row-date">
          {{ item.createdAt | formatTime }}
        </div>
        <div class="transaction-detail-main-row-thing">
          {{ item.subject }}
          <!-- "购买课程包【<span class="highlight">贪吃王思聪</span>】X <span class="highlight">3</span> -->

        </div>
        <div class="transaction-detail-main-row-sum">
          {{ item.rmb }}
          <!-- +10 知识币，+10 知识豆 -->
        </div>
      </div>
    </div>
    <div v-if="showPagination" class="transaction-detail-footer">
      <el-pagination class="transaction-detail-footer-pagination" @current-change="handleChangePage" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'TransactionDetail',
  data() {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY/MM/DD H: mm')
    }
  },
  computed: {
    ...mapGetters({
      origialTrades: 'account/trades'
    }),
    showPagination() {
      return this.total > 10
    },
    total() {
      return _.get(this.origialTrades, 'count', 0)
    },
    trades() {
      return _.get(this.origialTrades, 'rows', [])
    }
  },
  methods: {
    ...mapActions({
      getTrades: 'account/getTrades'
    }),
    async handleChangePage() {
      await this.getTrades({
        'x-order': 'createdAt-desc',
        'x-per-page': this.pageSize,
        'x-page': this.currentPage
      })
    }
  },
  async created() {
    await this.getTrades({
      'x-order': 'createdAt-desc',
      'x-per-page': this.pageSize,
      'x-page': this.currentPage
    })
  }
}
</script>

<style lang="scss">
.transaction-detail {
  background: #fff;
  padding-bottom: 54px;
  &-header {
    height: 61px;
    line-height: 61px;
    font-size: 16px;
    color: #303133;
    padding-left: 28px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-main {
    margin: 0 28px;
    color: #606266;
    &-row {
      display: flex;
      min-height: 52px;
      align-items: center;
      font-size: 14px;
      border-bottom: 1px solid #f6f6f6;
      &-date {
        width: 200px;
      }
      &-thing {
        flex: 3;
        font-size: 14px;
        .highlight {
          color: #2397f3;
        }
      }

      &-sum {
        flex: 1;
        text-align: end;
      }
    }
  }

  &-footer {
    text-align: end;
    margin: 28px;
    &-pagination {
      .el-pager {
        .number {
          min-width: 28px;
        }
        li.active {
          background: #409eff;
          color: #fff;
          height: 28px;
          min-width: 28px;
          display: inline-block;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>


