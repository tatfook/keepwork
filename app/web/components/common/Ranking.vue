<template>
  <div class="ranking-list">
    <div class="ranking-list-banner"><img src="@/assets/pblImg/ranking_banner.png" alt="banner"></div>
    <div class="ranking-list-cabinet">
      <div class="ranking-list-cabinet-center">
        
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RankingList',
  data() {
    return {}
  }
}
</script>
<style lang="scss">
.ranking-list {
  &-banner {
    background: linear-gradient(to right, #6400d5, #7613d5);
    text-align: center;
    img{
      width: 100%;
      max-width: 1920px;
      object-fit: cover;
    }
  }
}
</style>


