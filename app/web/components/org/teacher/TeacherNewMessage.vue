<template>
  <new-message :roleId="2" @cancel="back" @back="back"></new-message>
</template>
<script>
import NewMessage from '@/components/org/common/NewMessage'
export default {
  name: 'TeacherNewMessage',
  methods: {
    back() {
      this.$router.push({
        name: 'TeacherMessageList',
      })
    },
  },
  components: {
    NewMessage,
  },
}
</script>
