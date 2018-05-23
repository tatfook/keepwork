<template>
  <div class="comp-bigfile">
    <a v-if="type=='link'" :href="url">{{extraMsg || url}}</a>
    <img v-if="type=='image'" :src="url" :alt="extraMsg">
    <div v-if="type=='video'">
      <video :src="url" controls>
          {{$t('editor.videoNotSupport')}}
      </video>
    </div>
    <div v-if="errMsg" class="err">{{errMsg}}</div>
  </div>
</template>
<script>
import compBaseMixin from '../comp.base.mixin'
import { keepwork } from '@/api'
import { mapGetters } from 'vuex';

export default {
  name: 'AdiBigFile',
  mixins: [compBaseMixin],
  data() {
    return {
      type: '',
      errMsg: false,
      url: ''
    }
  },
  methods: {
    getFileType(fileType) {
      if (/image\/\w+/.test(fileType)){
          return "image";
      }else if (/video\/\w+/.test(fileType)){
          return "video";
      } else {
          return;
      }
    }
  },
  computed: {
    ...mapGetters({
      token: 'user/token'
    })
  },
  async created() {
    if (this.properties.channel == "qiniu") {
      if (!this.properties.fileId) {
          return
      }

      this.url = await keepwork.bigFile.getDownloadUrlById(this.token, {_id: this.properties.fileId})

      if(!this.url) {
        this.errMsg = this.$t('editor.notFound')
        return
      }

      this.type = this.getFileType(this.properties.fileType)
    } else if (this.properties.fileUrl){
      this.url = this.fileUrl
      this.type = this.getFileType(this.properties.fileType)
    }
  }
}
</script>
<style lang="scss" scoped>
.comp-bigfile {
  video {
    width: 100%
  }

  img {
    max-width: 100%
  }

  .err {
    text-align: center
  }
}
</style>
