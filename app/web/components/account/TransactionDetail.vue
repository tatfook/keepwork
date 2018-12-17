<template>
  <div class="transaction-detail">
    <div class="transaction-detail-header">
      交易明细
    </div>
    <div class="transaction-detail-main">
      <!-- <div class="transaction-detail-main-row">
        <div class="transaction-detail-main-row-date">
          2018/12/12 15:20
        </div>
        <div class="transaction-detail-main-row-thing">

          "购买课程包【<span class="highlight">贪吃王思聪</span>】X <span class="highlight">3</span>

        </div>
        <div class="transaction-detail-main-row-sum">
          +10 知识币，+10 知识豆
        </div>
      </div> -->
    </div>
    <div v-if="showPagination" class="transaction-detail-footer">
      <el-pagination
        class="transaction-detail-footer-pagination"
        :page-size="10"
        :pager-count="11"
        layout="prev, pager, next"
        :total="100000"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'TransactionDetail',
  computed: {
    ...mapGetters({
      trades: 'account/trades'
    }),
    showPagination() {
      return this.trades > 10
    }
  },
  methods: {
    ...mapActions({
      getTrades: 'account/getTrades'
    })
  },
  async mounted() {
    await this.getTrades()
  },
}
</script>

<style lang="scss">
.transaction-detail {
  background: #fff;
  padding-bottom: 77px;
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


