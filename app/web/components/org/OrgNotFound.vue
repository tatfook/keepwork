<template>
  <div class="org-not-found">
    <img class="org-not-found-img" src="@/assets/img/404.png" alt="">
    <div class="org-not-found-info">{{$t("org.pageNotFound")}}!</div>
  </div>

</template>

<script>
export default {
  name: 'OrgNotFound'
}
</script>
<style lang="scss" scoped>
.org-not-found {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &-img {
    max-width: 100%;
  }
  &-info {
    font-size: 24px;
    margin-top: 32px;
    font-weight: bold;
  }
}
</style>
