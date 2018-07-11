<template>
  <div class="comp-bigfile">
    <div v-if="isOldData">
      <a v-if="type=='link'" :href="url">{{extraMsg || url}}</a>
      <img v-if="type=='image'" :src="url" :alt="extraMsg">
      <div v-if="type=='video'">
        <video :src="url" controls>
          {{$t('editor.videoNotSupport')}}
        </video>
      </div>
      <div v-if="errMsg" class="err">{{errMsg}}</div>
    </div>
    <div v-if="!isOldData">
      <div v-if="getType === otherExt" class="bigfile-box" v-loading="loading">
        <div class="file-type-icon">
          <div class="iconfont" :class="getIconClass"></div>
        </div>
        <div>
          <div class="filename">{{this.properties.filename}}</div>
          <div class="filesize">{{getSize()}}</div>
        </div>
        <div class="split"></div>
        <div class="download iconfont icon-download" @click="download"></div>
      </div>
      <div class="bigfile-image"
           v-if="getType === handleExt['png'] || getType === handleExt['jpg'] || getType === handleExt['gif']">
        <img :src="getSrc" />
      </div>
      <div v-if="getType === handleExt['mp4']">
        <video :src="getSrc" controls>
          {{$t('editor.videoNotSupport')}}
        </video>
      </div>
      <div class="bigfile-pdf" v-if="getType === handleExt['pdf']">
        <iframe :src="getSrc"></iframe>
      </div>
    </div>
  </div>
</template>
<script>
import compBaseMixin from '../comp.base.mixin'
import { keepwork } from '@/api'
import { mapGetters } from 'vuex'
import prettysize from 'prettysize'
import download from 'downloadjs'
import _ from 'lodash'

export default {
  name: 'AdiBigFile',
  mixins: [compBaseMixin],
  data() {
    return {
      type: '',
      errMsg: false,
      url: '',
      isOldData: false,
      loading: false,
      ext: {
        txt: 'icon-txt1',
        mp4: 'icon-mp4-1',
        mp3: 'icon-mp3-1',
        rar: 'icon-rar1',
        gif: 'icon-gif1',
        ppt: 'icon-ppt',
        png: 'icon-PNG',
        html: 'icon-html',
        pdf: 'icon-pdf1',
        xls: 'icon-excel',
        xlsx: 'icon-excel',
        jpg: 'icon-jpg',
        psd: 'icon-PSD',
        svg: 'icon-SVG',
        zip: 'icon-zip',
        ts: 'icon-ts',
        less: 'icon-less',
        jsx: 'icon-jsx',
        js: 'icon-js',
        css: 'icon-css',
        md: 'icon-markdown',
        json: 'icon-json',
        doc: 'icon-word',
        docx: 'icon-word',
        sql: 'icon-sql'
      },
      handleExt: {
        mp4:'mp4',
        jpg:'jpg',
        png:'png',
        // pdf:'pdf',
        gif:'gif'
      },
      otherExt: 'other'
    }
  },
  methods: {
    getSize() {
      return prettysize(this.properties.size)
    },
    download() {
      download(this.properties.src)
    },
    getFileType(fileType) {
      if (/image\/\w+/.test(fileType)) {
        return 'image'
      } else if (/video\/\w+/.test(fileType)) {
        return 'video'
      } else {
        return
      }
    },
    async initOldData() {
      if (this.properties.channel == 'qiniu') {
        if (!this.properties.fileId) {
          return
        }

        this.url = await keepwork.bigfile.getDownloadUrlById(this.token, {
          _id: this.properties.fileId
        })

        if (!this.url) {
          this.errMsg = this.$t('editor.notFound')
          return
        }

        this.type = this.getFileType(this.properties.fileType)
      } else if (this.properties.fileUrl) {
        this.url = this.fileUrl
        this.type = this.getFileType(this.properties.fileType)
      }
    }
  },
  computed: {
    ...mapGetters({
      token: 'user/token'
    }),
    getIconClass() {
      if (this.properties.ext) {
        if(this.ext[this.properties.ext]) {
          return this.ext[this.properties.ext]
        } else {
          return 'icon-ukown_file'
        }
      } else {
        return 'icon-ukown_file'
      }
    },
    getType() {
      let ext = this.properties.ext || ''

      if(ext) {
        let beHandle = false

        _.forEach(this.handleExt, item => {
          if (item === ext) {
            beHandle = true
          }
        })

        if (beHandle) {
          return ext
        } else {
          return this.otherExt
        }
      } else {
        return this.otherExt
      }
    },
    getSrc() {
      return this.properties && this.properties.src || ''
    }
  },
  created() {
    if (this.properties.fileId) {
      this.isOldData = true
      this.initOldData()
    }
  }
}
</script>
<style lang="scss" scoped>
.comp-bigfile {
  video {
    width: 100%;
  }

  img {
    max-width: 100%;
  }

  .err {
    text-align: center;
  }

  .bigfile-pdf {
    iframe {
      width: 100%;
      height: 1000px;
      border: none;
    }
  }

  .bigfile-image {
    img {
      width: 100%;
    }
  }

  .bigfile-box {
    width: 423px;
    height: 75 - 17 * 2px;
    border: 1px solid #d9d9d9;
    background-color: #f3f3f3;
    padding: 17px 0px;
    display: flex;
    align-items: center;
    justify-content: center;

    .filename, .filesize{
      width: 150px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .file-type-icon {

      .iconfont {
        margin-right: 16px;
        font-size: 45px;
      }

      .icon-txt1 {
        color: rgb(186, 189, 194);
      }

      .icon-mp4-1 {
        color: rgb(98, 166, 245);
      }

      .icon-mp3-1 {
        color: rgb(245, 108, 73);
      }

      .icon-rar1 {
        color: rgb(159, 209, 59);
      }

      .icon-gif1 {
        color: rgb(210, 110, 219);
      }

      .icon-ppt {
        color: rgb(243, 115, 39);
      }

      .icon-PNG {
        color: rgb(60, 153, 216);
      }

      .icon-html {
        color: rgb(240, 70, 49);
      }

      .icon-pdf1 {
        color: rgb(238, 126, 113);
      }

      .icon-excel {
        color: rgb(102, 188, 92);
      }

      .icon-jpg {
        color: rgb(56, 173, 255);
      }

      .icon-PSD {
        color: rgb(60, 153, 216);
      }

      .icon-SVG {
        color: rgb(249, 189, 15);
      }

      .icon-zip {
        color: rgb(249, 189, 15);
      }

      .icon-ts {
        color: rgb(60, 153, 216);
      }

      .icon-less {
        color: rgb(42, 78, 138);
      }

      .icon-jsx {
        color: rgb(249, 189, 15);
      }

      .icon-js {
        color: rgb(249, 189, 15);
      }

      .icon-css {
        color: rgb(102, 188, 92);
      }

      .icon-markdown {
        color: rgb(72, 79, 89);
      }

      .icon-json {
        color: rgb(102, 188, 92);
      }

      .icon-word {
        color: rgb(77, 151, 255);
      }

      .icon-sql {
        color: #333;
      }
    }

    .split {
      height: 100%;
      width: 1px;
      background-color: #979797;
      margin: 0px 38px;
    }

    .download {
      font-size: 20px;
      color: #333333;
      cursor: pointer;
    }
  }
}
</style>
