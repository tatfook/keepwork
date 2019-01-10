<template>
  <div class="transaction-detail-item">
    <div class="transaction-detail-item-date">
      {{ createdAt | formatTime }}
    </div>
    <div class="transaction-detail-item-thing">
      <template v-if="isRecharge">
        {{ subject }}
      </template>
      <template v-else-if="isExchange">
        兑换【<span class="transaction-detail-item-highlight">{{ subject }}</span>】X <span class="transaction-detail-item-highlight">{{count}}</span>
      </template>
      <template v-else-if="isPackage">
        购买课程包【<span class="transaction-detail-item-highlight">{{ subject }}</span>】, 奖励 {{cost}}知识币(待解锁)
      </template>
      <template v-else-if="isLesson">
        课程 【<span class="transaction-detail-item-highlight">{{ subject }}</span>】学习完成
      </template>
    </div>
    <div class="transaction-detail-item-sum">
      <template v-if="isRecharge">
        +{{$t('account.rmbUnit', { money: rmb })}}
      </template>
      <template v-else-if="isExchange">
        -{{ finalCostByUnit }}
      </template>
      <template v-else-if="isPackage">
        -{{ finalCostByUnit }}
      </template>
      <template v-else-if="isLesson">
        <span v-if="coin">+{{ coin && $t('account.coinUnit', { money: coin }) }}</span>
        <span v-if="bean">, +{{ bean && $t('account.beanUnit', { money: bean })}}</span>
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import UnitMixin from './UnitMixin'
export default {
  name: 'TransactionDetailItem',
  mixins: [UnitMixin],
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY/MM/DD HH: mm')
    }
  },
  computed: {
    subject() {
      return _.get(this.data, 'subject', '')
    },
    type() {
      return _.get(this.data, 'type', '')
    },
    rmb() {
      return _.get(this.data, 'rmb', 0)
    },
    coin() {
      return _.get(this.data, 'coin', 0)
    },
    bean() {
      return _.get(this.data, 'bean', 0)
    },
    cost() {
      return this.rmb || this.coin || this.bean
    },
    count() {
      return _.get(this.data, 'count', 1)
    },
    finalCostByUnit() {
      return this.isRmbPayment
        ? this.$t('account.rmbUnit', { money: this.rmb })
        : `${this.cost} ${this.costUnit}`
    },
    isRmbPayment() {
      return this.rmb > 0
    },
    payment() {
      if (this.rmb) {
        return 'rmb'
      }
      if (this.coin) {
        return 'coin'
      }
      if (this.bean) {
        return 'bean'
      }
    },
    isRecharge() {
      return this.type === 0
    },
    isExchange() {
      return this.type === 1
    },
    isPackage() {
      return this.type === 2
    },
    isLesson() {
      return this.type === 3
    },
    createdAt() {
      return _.get(this.data, 'createdAt', '')
    }
  }
}
</script>


<style lang="scss">
.transaction-detail-item {
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
  }

  &-sum {
    flex: 1;
    text-align: end;
  }

  &-highlight {
    color: #2397f3;
  }
}
</style>
