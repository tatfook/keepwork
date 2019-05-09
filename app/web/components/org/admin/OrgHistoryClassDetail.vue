<template>
  <div class="class-detail">
    <history-class-comp :classDetail='classDetail'></history-class-comp>
  </div>
</template>
<script>
import HistoryClassComp from './common/HistoryClassComp'
export default {
  name: 'OrgHistoryClassDetail',
  computed: {
    classDetail() {
      return _.get(this.$route, 'query')
    }
  },
  components: {
    HistoryClassComp
  }
}
</script>
