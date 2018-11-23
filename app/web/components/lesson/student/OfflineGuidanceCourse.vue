<template>
  <div class="offline-guidance-course">
    线下导引课
    <combo-box projectName="official/paracraft" filePath="offline-courses"></combo-box>
  </div>
</template>

<script>
import ComboBox from '@/components/common/ComboBox'
export default {
  components:  {
    ComboBox
  }
}
</script>
