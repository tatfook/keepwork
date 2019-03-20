<template>
  <div class="class-detail">
    <class-comp :classDetail='classDetail'></class-comp>
  </div>
</template>
<script>
import ClassComp from './common/ClassComp'
export default {
  name: 'ClassDetail',
  computed: {
    classDetail() {
      return _.get(this.$route, 'query')
    }
  },
  components: {
    ClassComp
  }
}
</script>
