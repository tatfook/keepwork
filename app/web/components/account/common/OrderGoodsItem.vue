<template>
  <div class="order-goods-item">
    <div class="order-goods-item-cover">
      <img
        :src="coverUrl"
        :alt="subject"
      >
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'OrderGoodsItem',
  prosp: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    coverUrl() {
      return _.get(this.data, 'thumbnail', '')
    },
    subject() {
      return _.get(this.data, 'subject', '')
    }
  }
}
</script>

<style lang="scss">
.order-goods-item {
  background: #f8f7f7;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
</style>


