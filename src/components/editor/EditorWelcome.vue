<template>
  <div class="guid-content">
    <h1 class="welcomeText">{{ $t('common.welcomeToKeepwork') }}</h1>
    <div>
      <el-button type='primary' @click="openNewWebsiteDialog">{{ $t('common.createNewWebsite') }}</el-button>
    </div>
    <div class="resentWeb">
      <ul>
        <li v-for="(site,index) in recentOpenWeb" :key="index"><a href='http://localhost:8080/editor.html#/kaitlyn/header/312312'>{{site.path}}</a></li>
      </ul>
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
      isNewWebsiteDialogShow: false,
      recentOpenWeb: JSON.parse(localStorage.getItem('recentUrl'))
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
<style lang="scss" scoped>
.guid-content{
  .welcomeText{
    color: #000;
    font-size: 46px;
  }
  .resentWeb{
    border-left: 2px solid #dc75cd;
    margin: 40px 0;
    ul
    {
      margin: 0;
      padding: 0 22px;
       li{
      list-style: none;
      margin: 8px 0;
      a{
        text-decoration: none;
        color:#535353;
      }
    }
    }
  }
} 
</style>