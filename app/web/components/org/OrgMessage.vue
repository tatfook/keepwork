<template>
  <div class="org-message">
    <org-header></org-header>
    <message-page></message-page>
  </div>
</template>


<script>
import OrgHeader from './common/OrgHeader'
import MessagePage from '@/components/common/message/MessagePage'
export default {
  name: 'OrgMessage',
  components: {
    OrgHeader,
    MessagePage
  }
}
</script>