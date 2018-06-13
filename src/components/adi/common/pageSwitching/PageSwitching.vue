<template>
  <div class="comp comp-page-switching">
    <div class="container">
      <div v-for="(item, index) in sourceData" :key="index">
        <mod-list-viewer :modList='getModList(item._source.content)' :theme='theme' />
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { search } from '@/api/esGateway'
import { mapGetters } from 'vuex'
import compBaseMixin from '../comp.base.mixin'
import ModListViewer from '@/components/viewer/ModListViewer'
import Parser from '@/lib/mod/parser'

export default {
  name: 'AdiPageSwitching',
  mixins: [compBaseMixin],
  async created() {
    this.getSource()
  },
  data() {
    return {
      total: 0,
      pageSize: 1,
      currentPage: 1,
      allData: [],
      sourceData: [],
      loading: true
    }
  },
  components: {
    ModListViewer
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo'
    })
  },
  watch: {
    currentPage() {
      this.getSource()
    }
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.currentPage = pageNum
    },
    async getSource() {
      let path = '/introduction/pages'

      let index = process.env.ES_INDEX
      let type = process.env.ES_TYPE
      let body = {
        query: {
          match: {
            url: {
              query: this.activePageInfo.sitepath + path,
              operator: 'and'
            }
          }
        },
        from: this.currentPage - 1,
        size: this.pageSize
      }

      let source = await search({ index, type, body })

      this.total = source.hits.total
      this.sourceData = source.hits.hits
    },
    getModList(content) {
      return Parser.buildBlockList(content)
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-page-switching {
  .pagination {
    text-align: center;
  }
}
</style>
