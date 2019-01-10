<template>
  <div class="exchange-mall">
    <div class="exchange-mall-header">
      {{$t('account.exchangeMall')}}
    </div>
    <div class="exchange-mall-main" v-loading="isLoading">
      <el-row>
        <template v-for="(item, index) in goodsList">
          <el-col :span="6" :md="6" :sm="12" :xs="24" :key="index">
            <exchange-mall-item :data="item"></exchange-mall-item>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script>
import ExchangeMallItem from './common/ExchangeMallItem'
import { mapActions, mapGetters } from 'vuex'
const PLATFORM = [2, 3]
export default {
  name: 'ExchangeMall',
  components: {
    ExchangeMallItem
  },
  data() {
    return {
      items: [],
      isLoading: true
    }
  },
  computed: {
    ...mapGetters({
      goods: 'account/goods'
    }),
    goodsList() {
      return this.goods.filter(i => PLATFORM.includes(i.platform))
    }
  },
  async created() {
    await this.getGoods().catch(e => console.error(e))
    this.isLoading = false
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
    font-weight: bold;
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

