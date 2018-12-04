<template>
  <div class="offline-guidance-course">
    <combo-box projectName="official/paracraft" filePath="learn/latest_offline_lesson"></combo-box>
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
