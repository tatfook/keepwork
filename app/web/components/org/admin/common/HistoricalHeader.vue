<template>
  <div class="historical-header">
    <div class="header-item" :class="{'is-active': isItemActive(item)}" v-for="(item, index) in headerData" :key="index">
      <router-link class="link" :to='{name: item.indexPageName}'>{{item.text}}</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HistoricalHeader',
  data() {
    return {
      headerData: [
        {
          text: '班级',
          indexPageName: 'HistoricalData',
          pages: ['HistoricalData'],
        },
        {
          text: '学生',
          indexPageName: 'HistoricalMember',
          pages: ['HistoricalMember'],
        },
      ],
    }
  },
  computed: {
    currentPageName() {
      return _.get(this.$route, 'name')
    },
  },
  methods: {
    isItemActive(item) {
      return _.indexOf(item.pages, this.currentPageName) !== -1
    },
  },
}
</script>
<style lang="scss" scoped>
.historical-header {
  border-bottom: 1px solid #e8e8e8;
  height: 56px;
  font-size: 16px;
  color: #999;
  padding: 0 16px;
  .header-item {
    padding: 16px 8px 8px;
    display: inline-block;
    border-bottom: 3px solid transparent;
    padding: 16px 8px 8px;
    margin-right: 16px;
    &.is-active {
      color: #2397f3;
      border-color: #2397f3;
    }
  }
  .link {
    cursor: pointer;
    color: inherit;
    text-decoration: none;
  }
}
</style>
