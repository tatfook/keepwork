<template>
  <div v-loading='loading' class="skydrive-manager">
    <h1>{{ '网盘管理' }}</h1>
    当前使用<br/>
    {{ info.unused | biteToG }} GB 可用<br/>
    总共 {{ info.total | biteToG }} GB

    <h1>{{ '文件列表' }}</h1>
    <div v-for='item in userSkyDriveFileList' :key='item._id'>
      <a target='_blank' :href='item.file.download_url'>{{ item.filename }}</a>
      <span @click='handleRemove(item)'>remove</span>
    </div>

    <h1>{{ '文件上传' }}</h1>
    <div class="skydrive-manager-dropzone" droppable="true" @drop.prevent='handleDrop' @dragover.prevent>
      <span>{{ '拖拽上传' }}</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SkyDriveManager',
  data() {
    return {
      loading: true
    }
  },
  async mounted() {
    await this.userRefreshSkyDrive()
    this.loading = false
  },
  computed: {
    ... mapGetters({
      'userSkyDriveFileList': 'user/skyDriveFileList',
      'userSkyDriveInfo': 'user/skyDriveInfo'
    }),
    info() {
      let {total = 0, used = 0} = this.userSkyDriveInfo
      let unused = total - used
      return {total, used, unused}
    }
  },
  methods: {
    ... mapActions({
      userRefreshSkyDrive: 'user/refreshSkyDrive',
      userUploadFileToSkyDrive: 'user/uploadFileToSkyDrive',
      userRemoveFileFromSkyDrive: 'user/removeFileFromSkyDrive',
      userChangeFileNameInSkyDrive: 'user/changeFileNameInSkyDrive'
    }),
    async handleDrop(e) {
      let file = e.dataTransfer.files[0]
      this.loading = true
      await this.userUploadFileToSkyDrive({file, onProgress(progress) {
        console.log(progress)
      }}).catch(err => console.error(err))
      await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
      this.loading = false
    },
    async handleRemove(file) {
      this.loading = true
      await this.userRemoveFileFromSkyDrive({file}).catch(err => console.error(err))
      await this.userRefreshSkyDrive({useCache: false}).catch(err => console.error(err))
      this.loading = false
    },
    async changeFileName(_id, filename) {
      this.loading = true
      await this.userChangeFileNameInSkyDrive({_id, filename}).catch(err => console.error(err))
      this.loading = false
    }
  },
  filters: {
    biteToG: (bite = 0) => (bite/(1024*1024*1024)).toFixed(2)
  }
}
</script>

<style lang="scss">
.skydrive-manager {
  border: 1px solid;
  &-dropzone {
    height: 200px;
    background: lightcyan;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
