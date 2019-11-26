<template>
  <new-message @cancel="back" @back="back"></new-message>
</template>
<script>
import NewMessage from '@/components/org/common/NewMessage'
export default {
  name: 'AdminNewMessage',
  methods: {
    back() {
      this.$router.push({
        name: 'MessageList',
      })
    },
  },
  components: {
    NewMessage,
  },
}
</script>
