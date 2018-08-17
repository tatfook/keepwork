<template>
  <div class="review">
    <div class="review-nothing" v-if="noRecord">
      <div><img src="@/assets/lessonImg/no_packages.png" alt=""></div>
      <p class="review-nothing-hint">There is no teaching record yet.</p>
    </div>
    <div class="review-list" v-else></div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      noRecord: true
    }
  }
}
</script>

<style lang="scss">
.review{
  &-nothing {
    width: 100%;
    height: 660px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-hint {
      font-size: 20px;
      line-height: 30px;
      color: #111111;
    }
  }
}
</style>


