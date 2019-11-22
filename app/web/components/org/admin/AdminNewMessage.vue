<template>
  <new-message v-loading="isLoading" @cancel="back" @save="saveNewMessage"></new-message>
</template>
<script>
import NewMessage from '@/components/org/common/NewMessage'
import { mapActions } from 'vuex'
export default {
  name: 'AdminNewMessage',
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    ...mapActions({
      orgCreateNewMessage: 'org/createNewMessage',
    }),
    back() {
      this.$router.push({
        name: 'MessageList',
      })
    },
    async saveNewMessage(newMessage) {
      this.isLoading = true
      try {
        await this.orgCreateNewMessage(newMessage)
        this.showMessage('success', '消息发送成功')
        this.back()
      } catch (error) {
        this.showMessage('danger', '消息发送失败，请重试')
      }
      this.isLoading = false
    },
    showMessage(type, message) {
      this.$message({ type, message })
    },
  },
  components: {
    NewMessage,
  },
}
</script>
