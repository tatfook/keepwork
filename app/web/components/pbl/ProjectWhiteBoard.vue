<template>
  <div class="project-white-board">
    <div class="container">
      <div class="title">新建问题</div>
      <div class="sketch">
        
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProjectWhiteBoard'
}
</script>

<style lang="scss">
.project-white-board{
  background: #f5f5f5;
  padding: 24px 0;
  .container{
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
    .title{
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      color: #303133;
      padding-left: 16px;
      font-weight: bold;
      border-bottom: 1px solid #e8e8e8;
    }
  }
}
</style>

