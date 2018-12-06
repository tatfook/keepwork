<template>
  <div class="password-reset-page">
    <div class="password-reset-page-form">
      <password-reset-form></password-reset-form>
      <div class="password-reset-page-operation">
          <router-link to="/" class="password-reset-page-operation-home">
          {{$t('editor.backHomePage')}}
          </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import PasswordResetForm from '@/components/common/PasswordResetForm'
export default {
  name: 'PasswordResetPage',
  components: {
    PasswordResetForm
  },
  methods: {
    handleBackHome() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style lang="scss">
.password-reset-page {
  background: #f7f8f9;
  padding-top: 100px;
  &-form {
    padding: 32px 0 32px;
    border-radius: 4px;
    background: #fff;
    width: 352px;
    margin: 0 auto;
  }
  &-operation {
    margin-left: 32px;
    &-home {
      font-size: 14px;
      width: 110px;
      color: #1272cc;
      cursor: pointer;
      text-decoration: none;
    }
  }
}

@media (max-width: 768px) {
  .password-reset-page {
    padding-top: 8px;
    &-form {
      width: 95%;
    }
  }
}
</style>

