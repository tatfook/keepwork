<template>
  <div class="message-list">
    <div class="message-list-header">
      校园OA
      <div class="message-list-header-link" @click="toNewMessagePage">发消息</div>
    </div>
    <div class="message-list-main">
      <message-list-comp :roleId="64" />
    </div>
  </div>
</template>
<script>
import MessageListComp from '@/components/org/common/MessageListComp'
import { mapActions } from 'vuex'
export default {
  name: 'MessageList',
  methods: {
    ...mapActions({
      checkCurrentOrgExpire: 'org/checkCurrentOrgExpire',
    }),
    async toNewMessagePage() {
      if (await this.checkCurrentOrgExpire({ toExpire: false })) return
      this.$router.push({ name: 'NewMessage' })
    },
  },
  components: {
    MessageListComp,
  },
}
</script>
<style lang="scss" scoped>
.message-list {
  font-size: 14px;
  padding: 0 24px;
  height: 100%;
  background-color: #fff;
  &-header {
    height: 70px;
    line-height: 70px;
    font-size: 16px;
    position: relative;
    padding-right: 124px;
    border-bottom: 1px solid #d9d9d9;
    &-link {
      text-decoration: none;
      width: 90px;
      line-height: 28px;
      position: absolute;
      right: 0;
      top: 24px;
      color: #fff;
      background-color: #1385ff;
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
