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
      currentTab: 'teachingIdea',
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
  watch: {
    $route(to) {
      this.isLoading = true
      const {
        params: { command }
      } = to
      this.currentTab = command
      this.isLoading = false
    }
  },
  mounted() {
    const {
      params: { command }
    } = this.$route
    this.currentTab = command
    this.isLoading = false
  },
  computed: {
    projectName() {
      return _.get(this.solutions, [this.currentTab, 'projectName'])
    },
    filePath() {
      return _.get(this.solutions, [this.currentTab, 'filePath'])
    }
  }
}
</script>

<style lang="scss">
.solution {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

