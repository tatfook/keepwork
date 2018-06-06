<template>
  <div class="comp comp-page-switching">
    <div class="pagination">
      <el-pagination
        background="red"
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdiPageSwitching',
  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.comp-page-switching {
  .pagination {
    text-align: center;
  }
}
</style>
