<template>
  <div class="exchange-mall">
    <div class="exchange-mall-header">
      兑换商城
    </div>
    <div class="exchange-mall-main">
      <el-row>
        <template v-for="(item, index) in goodsList">
          <el-col
            :span="6"
            :md="6"
            :sm="12"
            :xs="24"
            :key="index"
          >
            <exchange-item :data="item"></exchange-item>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script>
import ExchangeItem from './common/ExchangeItem'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ExchangeMall',
  components: {
    ExchangeItem
  },
  data() {
    return {
      items: []
    }
  },
  computed: {
    ...mapGetters({
      goods: 'account/goods'
    }),
    goodsList() {
        return this.goods.filter(i => i.id !== 1)
    }
  },
  async created() {
    await this.getGoods().catch(e => console.error(e))
  },
  mounted() {
    document.title = '兑换商城'
  },
  methods: {
    ...mapActions({
      getGoods: 'account/getGoods'
    })
  }
}
</script>


<style lang="scss">
.exchange-mall {
  max-width: 1200px;
  min-width: 400px;
  box-sizing: border-box;
  margin: 20px auto 0;
  background: #fff;
  padding: 0 53px 225px;
  &-header {
    height: 75px;
    line-height: 75px;
    font-size: 18px;
    color: #ff721e;
  }

  &-main {
    max-width: 1096px;
    margin: 0 auto;
    &-list {
      display: flex;
      &-item {
        flex: 1;
      }
    }
  }
}
</style>

