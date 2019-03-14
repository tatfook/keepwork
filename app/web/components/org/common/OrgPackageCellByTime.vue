<template>
  <div class="org-package-append">
    <div class="org-package-append-header">最近上课: <span class="last-teach-time">2019-2-25 18:30</span></div>
    <org-package-cell></org-package-cell>
  </div>
</template>

<script>
import OrgPackageCell from './OrgPackageCell'
export default {
  name: 'OrgPackageCellByTime',
  props: {
    package: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    OrgPackageCell
  }
}
</script>

<style lang="scss">
.org-package-append {
  width: 288px;
  box-sizing: border-box;
  cursor: pointer;
  margin-top: 16px;
  &-header {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #909399;
    .last-teach-time {
      margin-left: 7px;
      color: #f18e3d;
    }
  }
}
</style>


