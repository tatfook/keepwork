<template>
  <div class="guid-content">
    <h1>Welcome to Keepwork</h1>
    <div>
      <el-button type='primary' @click="createWebsite">创建新网站</el-button>
      <el-button @click="createSitePage">创建新网页</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'EditorWelcome',
  methods: {
    ... mapActions({
      userCreateWebsite: 'user/createWebsite'
    }),
    createWebsite() {
      let websiteName = prompt('What\'s your new website name?')
      this.userCreateWebsite({name: websiteName})
    },
    createSitePage() {
      alert('Coming Soon!')
    }
  }
}
</script>