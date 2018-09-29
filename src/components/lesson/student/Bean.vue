<template>
  <div class="bean-wrap">
    <div class="bean" v-loading="beanLoading">
      <div class="bean-header">
        <div class="bean-header-state"><span class="beans">{{beansCount}}{{$t('lesson.beans')}}</span><span class="explain">({{$t('lesson.explain')}})</span></div>
        <div class="bean-header-button">
          <el-button type="primary" size="small" :disabled="!tableData.length" @click="goConvert">{{$t('lesson.conversion')}}</el-button>
        </div>
      </div>
      <div class="bean-nothing" v-if='!tableData.length && !beanLoading'>
        <img src="@/assets/lessonImg/no_packages.png" alt="">
      </div>
      <div class="bean-table" v-else>
        <el-table :data="tableData" style="width: 90%">
          <el-table-column prop="createdAt" :label="$t('lesson.detail')" width="280">
          </el-table-column>
          <el-table-column prop="description" label="" width="280">
          </el-table-column>
          <el-table-column prop="balance" label="" align="right">
          </el-table-column>
        </el-table>
      </div>
      </div>
    </div>
</template>
<script>
import { lesson } from '@/api'
import _ from 'lodash'
import moment from 'moment'
import {mapActions,mapGetters} from 'vuex'
export default {
  name: 'Bean',
  data() {
    return {
      beanLoading: true,
      beanInfo: ''
    }
  },
  async mounted() {
    await lesson.trades
      .getTradesList()
      .then(res => {
        this.beanInfo = _.get(res, 'rows', [])
        this.beanLoading = false
      })
      .catch(err => console.log(err))
  },
  computed: {
    ...mapGetters({
      userinfo: 'lesson/userinfo'
    }),
    beansCount(){
      return _.get(this.userinfo,'bean',0)
    },
    tableData() {
      let data = _.map(this.beanInfo, i => {
        let createdAt = moment(i.createdAt).format('YYYY[/]MM[/]DD  HH:mm')
        let description = i.description
        let balance = i.amount + '  ' + this.$t('lesson.beans')
        return { createdAt, description, balance }
      })
      return data.sort(this.sortByUpdateAt)
    }
  },
  methods: {
    sortByUpdateAt(obj1, obj2) {
      return obj1.updatedAt >= obj2.updatedAt ? -1 : 1
    },
    goConvert() {
      window.open('/wiki/js/mod/knowledgeBean/index')
    }
  },
}
</script>

<style lang='scss'>
.bean-wrap {
  .bean {
    max-width: 1200px;
    margin: 20px auto;
    background: #fff;
    padding: 50px 40px;
    &-header {
      display: flex;
      padding-bottom: 10px;
      border-bottom: 1px solid #f3f3f3;
      &-state {
        flex: 1;
        font-size: 18px;
        .beans{
          color: #333;
          margin-right: 20px;
          font-weight: 700;
        }
        .explain{
          color: #808080;
        }
      }
      &-button {
        max-width: 143px;
      }
    }
    &-nothing {
      padding: 50px 0;
      text-align: center;
    }
  }
}
</style>

