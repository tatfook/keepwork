<template>
  <div class="org-package-cell" @click="handleCallback">
    <img class="org-package-cover" :src="packageCover" alt="">
    <div class="org-package-desc">
      <div class="org-package-desc-name">{{packageName}}</div>
      <div class="org-package-desc-line">{{$t('lesson.include')}}:<span class="line-strong">{{packageLessonsCount}}个课程</span></div>
      <div class="org-package-desc-line">{{$t('lesson.ages')}}:<span class="line-strong">{{packageSuitAge}}</span></div>
      <div class="org-package-desc-line">{{$t('lesson.intro')}}:<span class="line-strong">{{packageIntro}}</span></div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'OrgPackageCell',
  props: {
    packageData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    handleCallback() {
      this.$emit('package-click', this.packageId)
    }
  },
  computed: {
    packageCover() {
      return _.get(
        this.packageData,
        'extra.coverUrl',
        ''
      )
    },
    packageId() {
      return _.get(this.packageData, 'id', '')
    },
    packageName() {
      return _.get(this.packageData, 'packageName', '')
    },
    packageIntro() {
      return _.get(this.packageData, 'intro', '')
    },
    packageMaxAge() {
      return _.get(this.packageData, 'maxAge', 0)
    },
    packageMinAge() {
      return _.get(this.packageData, 'minAge', 0)
    },
    packageLessonsCount() {
      return _.get(this.packageData, 'lessons', []).length
    },
    packageSuitAge() {
      if (this.packageMaxAge == 0 && this.packageMinAge == 0) {
        return this.$t('lesson.packageManage.SuitableForAll')
      }
      return `${this.packageMinAge}-${this.packageMaxAge}`
    }
  }
}
</script>

<style lang="scss">
.org-package {
  &-cell {
    background: #fff;
    width: 288px;
    box-sizing: border-box;
    padding: 16px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.16);
      transition: all 200ms ease-in;
    }
  }
  &-cover {
    width: 256px;
    height: 143px;
    display: block;
    background: #c0c4cc;
    object-fit: cover;
    border-radius: 4px;
  }
  &-desc {
    font-size: 12px;
    color: #c0c4cc;
    &-name {
      font-size: 14px;
      margin: 10px 0;
      color: #333;
      height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &-line {
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #c0c4cc;
      margin-top: 8px;
      .line-strong {
        color: #909399;
        margin-left: 7px;
      }
    }
  }
}
</style>

