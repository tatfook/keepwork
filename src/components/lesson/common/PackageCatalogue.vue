<template>
  <div class="package-catalogue">
    <div class="package-catalogue-title">{{$t('lesson.catalogue')}}</div>
    <div class="package-catalogue-box">
      <div class="package-catalogue-item" v-for="(lesson, index) in lessonsList" :key='index' @click="toPackageDetail">
        <img class="package-catalogue-item-cover" :src="lesson.extra.coverUrl" alt="">
        <div class="package-catalogue-item-detail">
          <div class="package-catalogue-item-title">
            <span>{{lesson.lessonName}}</span>
          </div>
          <div class="package-catalogue-item-info">{{$t('lesson.lessonGoals')}}:</div>
          <div class="package-catalogue-item-goals">
            <p class="package-catalogue-item-goals-item">{{lesson.goals}}</p>
          </div>
          <div class="package-catalogue-item-duration">{{$t('lesson.duration')}}:
            <span>45min</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PackageCatalogue',
  props: {
    packageDetail: Object
  },
  computed: {
    lessonsList() {
      return _.get(this.packageDetail, 'lessons', [])
    }
  },
  methods: {
    toPackageDetail() {
      this.$alert(this.$t('lesson.addPackageFirst'), this.$t('lesson.infoTitle'))
    }
  }
}
</script>
<style lang="scss" scoped>
.package-catalogue {
  border: 1px solid #e5e5e5;
  padding-bottom: 30px;
  &-title {
    font-size: 16px;
    color: #333;
    height: 55px;
    line-height: 55px;
    padding: 0 11px;
    font-weight: bold;
  }
  &-item {
    border: 1px solid #e5e5e5;
    border-width: 1px 0;
    padding: 3px 10px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
    font-weight: lighter;
    cursor: pointer;
    &-cover {
      width: 250px;
      height: 146px;
      object-fit: cover;
      margin-right: 22px;
    }
    &-detail {
      flex: 1;
      min-width: 0;
    }
    &-title {
      margin: 12px 0 8px;
      font-size: 18px;
      color: #181818;
      font-weight: normal;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &-info {
      color: #999;
    }
    &-duration {
      margin: 25px 0 15px;
    }
    &-goals {
      max-height: 100px;
      overflow: auto;
      &-item {
        padding-left: 12px;
        position: relative;
        margin: 0;
        line-height: 22px;
      }
      &-item::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #666;
        position: absolute;
        left: 0;
        top: 10px;
      }
    }
  }
}
</style>
