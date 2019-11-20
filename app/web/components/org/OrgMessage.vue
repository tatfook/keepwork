<template>
  <div class="org-message">
    <org-header></org-header>
    <message-container></message-container>
  </div>
</template>


<script>
import OrgHeader from './common/OrgHeader'
import MessageContainer from '@/components/common/message/MessagePage'
export default {
  name: 'OrgMessage',
  components: {
    OrgHeader,
    MessageContainer
  }
}
</script>