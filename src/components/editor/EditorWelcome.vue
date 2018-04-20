<template>
  <div class="guid-content">
    <h1>{{ $t('common.welcomeToKeepwork') }}</h1>
    <div>
      <el-button type='primary' @click="openNewWebsiteDialog">{{ $t('common.createNewWebsite') }}</el-button>
    </div>
    <NewWebsiteDialog :show='isNewWebsiteDialogShow' @close='closeNewWebsiteDialog'/>
  </div>
</template>

<script>
import NewWebsiteDialog from '@/components/common/NewWebsiteDialog'

export default {
  name: 'EditorWelcome',
  data() {
    return {
      isNewWebsiteDialogShow: false
    }
  },
  methods: {
    openNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = true
    },
    closeNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = false
    }
  },
  components: {
    NewWebsiteDialog
  }
}
</script>