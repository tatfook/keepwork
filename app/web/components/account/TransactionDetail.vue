<template>
  <div class="transaction-detail">
    <div class="transaction-detail-header">
      {{$t('account.transactions')}}
    </div>
    <div class="transaction-detail-main">
      <template v-if="hasTrades">
        <transaction-detail-item v-for="(item, index) in trades" :key="index" :data="item"></transaction-detail-item>
      </template>
      <template v-else>
        <div class="transaction-detail-main-empty">
          <img class="transaction-detail-main-empty-image" src="../../assets/lessonImg/no_packages.png" alt="无数据">
          <span class="transaction-detail-main-empty-tips">{{$t('account.noData')}}</span>
        </div>
      </template>
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
import TransactionDetailItem from './common/TransactionDetailItem'
export default {
  name: 'TransactionDetail',
  components: {
    TransactionDetailItem
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY/MM/DD HH: mm')
    }
  },
  computed: {
    ...mapGetters({
      originalTrades: 'account/trades'
    }),
    showPagination() {
      return this.total > 10
    },
    total() {
      return _.get(this.originalTrades, 'count', 0)
    },
    trades() {
      return _.get(this.originalTrades, 'rows', [])
    },
    hasTrades() {
      return this.trades.length > 0
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
    &-empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 428px;
      &-tips {
        font-size: 20px;
        color: #111;
        margin-top: 30px;
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


