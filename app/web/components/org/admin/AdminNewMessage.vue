<template>
  <new-message @save="saveNewMessage"></new-message>
</template>
<script>
import NewMessage from '@/components/org/common/NewMessage'
export default {
  name: 'AdminNewMessage',
  components: {
    NewMessage,
  },
  methods: {
    saveNewMessage(newMessage) {
      console.log(newMessage)
    },
  },
}
</script>
