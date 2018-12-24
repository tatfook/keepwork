<template>
  <div class="register-page">
    <register />
  </div>
</template>
<script>
import Register from '@/components/common/RegisterDialog'

export default {
  name: 'RegisterPage',
  components: {
    Register
  }
}
</script>
<style lang='scss'>
.register-page{
  max-width: 352px;
  margin: 80px auto 10px;
  box-shadow: 1px 1px 5px #cccccc;
  .register-dialog {
    &-form {
      padding: 20px 32px;
      margin: 0 auto;
      position: relative;
    }  
  }
}
</style>


