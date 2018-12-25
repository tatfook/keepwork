<template>
  <div class="solution">
    <combo-box
      v-show="isParents"
      projectName="official/paracraft"
      filePath="learn/parent_banner"
    ></combo-box>
    <educators-tab v-show="isParents"></educators-tab>
    <combo-box :routes="routes"></combo-box>
  </div>
</template>
<script>
import EducatorsTab from './EducatorsTab'
import ComboBox from '@/components/combo/ComboBox'
import _ from 'lodash'
export default {
  name: 'Solution',
  components: {
    ComboBox,
    EducatorsTab
  },
  watch: {
    $route(to) {
      const { params: { command } } = to
      const { projectName, filePath } = this.routes[command]
      this.currentFilePath = filePath
    }
  },
  mounted() {
    const { params: { command } } = this.$route
    const { projectName, filePath } = this.routes[command]
    this.currentFilePath = filePath
  },
  computed: {
    isParents() {
      return this.currentFilePath === 'learn/parents'
    }
  },
  data() {
    return {
      routes: {
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
      },
      currentFilePath: ''
    }
  },
}
</script>

<style lang="scss">
.solution {
  background: #fff;
  max-width: 1200px;
  margin: 0 auto 80px;
}
</style>

