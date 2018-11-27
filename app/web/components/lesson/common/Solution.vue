<template>
  <div class="solution">
   <combo-box projectName="official/paracraft" filePath="offline-courses"></combo-box>
  </div>
</template>
<script>
import ComboBox from '@/components/combo/ComboBox'
export default {
  name: 'Solution',
  components: {
    ComboBox
  },
  data() {
    return {
      solutions: {

      }
    }
  },
  watch: {
    $route(to) {

    }
  },
  mounted(){
    console.log(this.$route)
  }
}
</script>

<style lang="scss">
.solution {
 
}
</style>

