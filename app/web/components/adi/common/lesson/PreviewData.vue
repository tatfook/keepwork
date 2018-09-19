<template>
 <div class="el-row mod-full-width-0-0-65">
    <div class="no-data">
        {{ message }}
    </div>
</div>
</template>

<script>
export default {
  props: {
    message: ''
  }
}
</script>

<style lang="scss" >
.no-data {
  padding-top: 230px;
  margin: 5% auto;
  background: url(/assets/adi/lesson/search.png) no-repeat top center;
  background-size: 200px;
  font-size: 24px;
  line-height: 30px;
  color: #b8b8b8;
  text-align: center;
}
</style>


