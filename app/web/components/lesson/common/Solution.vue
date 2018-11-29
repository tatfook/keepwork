<template>
  <div class="solution">
    <combo-box :routes="solutions"></combo-box>
  </div>
</template>
<script>
import ComboBox from '@/components/combo/ComboBox'
import _ from 'lodash'
export default {
  name: 'Solution',
  components: {
    ComboBox
  },
  data() {
    return {
      solutions: {
        teachingIdea: {
          projectName: 'official/paracraft',
          filePath: 'learn/our_ideas'
        },
        teacher: {
          projectName: 'official/paracraft',
          filePath: 'learn/educators'
        },
        parents: {
          projectName: 'official/paracraft',
          filePath: 'learn/parents'
        },
        organization: {
          projectName: 'official/paracraft',
          filePath: 'learn/partnership'
        },
        competition: {
          projectName: 'official/paracraft',
          filePath: 'learn/works_and_contests'
        }
      }
    }
  },
}
</script>

<style lang="scss">
.solution {
  background: #fff;
}
</style>

