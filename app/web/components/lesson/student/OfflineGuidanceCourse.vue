<template>
  <div class="offline-guidance-course">
    <combo-box projectName="official/paracraft" filePath="offline-courses"></combo-box>
  </div>
</template>

<script>
import ComboBox from '@/components/combo/ComboBox'
export default {
  components: {
    ComboBox
  }
}
</script>

<style lang="scss">
.offline-guidance-course {
  height: 100%;
}
</style>
