<template>
  <div class="comp-item">
    <img class="comp-item-cover" :src="compDetail.cover" :alt="compDetail.name">
    <div class="comp-item-info">
      <div class="comp-item-info-left">
        <div class="comp-item-type-name">
          <span class="comp-item-type">{{compDetail.type}}</span>
          {{compDetail.name}}
        </div>
        <div class="comp-item-author">贡献者：{{compDetail.author}}</div>
      </div>
      <el-button @click="useComp">使用</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompItem',
  props: {
    compDetail: {
      type: Object,
      required: true
    }
  },
  computed: {
    downloadUrl() {
      return _.get(this.compDetail, 'downloadUrl')
    }
  },
  methods: {
    useComp() {
      alert(this.downloadUrl)
    }
  }
}
</script>
<style lang="scss" scoped>
.comp-item {
  padding: 12px;
  background-color: #fff;
  &-cover {
    max-width: 100%;
  }
  &-info {
    display: flex;
    align-items: center;
    margin-top: 4px;
    &-left {
      flex: 1;
    }
    .el-button {
      font-size: 14px;
      padding: 0 12px;
      height: 28px;
      line-height: 26px;
      color: #2397f3;
      border-color: #2397f3;
      border-radius: 28px;
    }
  }
  &-type-name {
    font-size: 14px;
    color: #303133;
  }
  &-type {
    font-size: 12px;
    color: #fff;
    background-color: #e6a23c;
    display: inline-block;
    border-radius: 4px;
    padding: 2px;
    min-width: 24px;
    text-align: center;
  }
  &-author {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
  }
}
</style>
