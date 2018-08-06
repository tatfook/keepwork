<template>
  <div class="hint-container">
    <span class="hint-title">教师:</span>
    <div class="hint-content">{{content}}</div>
  </div>
</template>


<script>
export default {
  name: 'Hint',
  data() {
    return {}
  },
  mounted() {
  },
  props: {
    data: Object
  },
  computed: {
    content() {
      return _.get(this.data, 'data.hint.content', '')
    }
  }
}
</script>


<style lang="scss">
.hint-container {
  max-width: 1080px;
  min-height: 100px;
  padding: 20px;
  margin: 0 auto;
  background: rgb(240, 240, 240);
  box-sizing: border-box;
  .hint-title {
    color: #ff414a;
    display: block;
  }
  .hint-content {
    white-space: normal;
    word-wrap: break-word;
    margin-top: 10px;
  }
}
</style>
