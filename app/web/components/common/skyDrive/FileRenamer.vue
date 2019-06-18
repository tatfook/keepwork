<template>
  <el-button class="file-renamer" type="text" @click="renameFile" :disabled='isDisabled'>
    <i class="el-icon-edit"></i>
    <span v-show="isTextShow">{{$t('common.rename')}}</span>
  </el-button>
</template>
<script>
import { getBareFilename } from '@/lib/utils/filename'
import { getFilenameWithExt } from '@/lib/utils/gitlab'
import { mapGetters, mapActions } from 'vuex'

const ErrFilenamePatt = new RegExp('^[^\\\\/*?|<>:"]+$')

export default {
  name: 'FileRenamer',
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    selectFile: {
      type: Object,
      required: true
    },
    isTextShow: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      userSkyDriveFileList: 'user/skyDriveFileList'
    })
  },
  methods: {
    ...mapActions({
      userChangeFileNameInSkyDrive: 'user/changeFileNameInSkyDrive'
    }),
    testFilenameIsValid(newFilename) {
      let errMsg = this.$t('skydrive.nameContainSpecialCharacterError')
      return !ErrFilenamePatt.test(newFilename) ? errMsg : true
    },
    filenameValidator(newFilename) {
      let errMsg = this.$t('skydrive.nameConflictError')
      return this.userSkyDriveFileList.filter(
        ({ filename }) => filename === newFilename
      ).length
        ? errMsg
        : true
    },
    async showRenamePrompt() {
      let { filename, ext } = this.selectFile
      let bareFilename = getBareFilename(filename)
      return await this.$prompt(
        this.$t('skydrive.newFilenamePromptMsg'),
        this.$t('common.rename'),
        {
          inputValue: bareFilename,
          confirmButtonText: this.$t('common.OK'),
          cancelButtonText: this.$t('common.Cancel'),
          inputValidator: str => {
            if (str === bareFilename || str === filename) return true
            if (!str) return this.$t('skydrive.nameEmptyError')
            let isFilenameValid = this.testFilenameIsValid(str)
            if (typeof isFilenameValid === 'string') return isFilenameValid
            return this.filenameValidator(getFilenameWithExt(str, ext))
          }
        }
      )
    },
    async renameFile() {
      let { _id, ext, filename, key } = this.selectFile
      let { value: newname } = await this.showRenamePrompt()
      newname = (newname || '').trim()
      if (!newname) return
      let newnameExt = /.+\./.test(newname) ? newname.split('.').pop() : ''
      newnameExt = newnameExt.toLowerCase()
      newname = newnameExt !== ext ? `${newname}.${ext}` : newname
      let newFilename = newname
      if (newFilename === filename) return
      this.loading = true
      await this.userChangeFileNameInSkyDrive({
        key,
        filename: newFilename
      }).catch(err => console.error(err))
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.file-renamer {
  color: inherit;
  padding: 0;
  &.is-disabled {
    color: #c0c4cc;
  }
  [class*='el-icon-'] + span {
    margin-left: 0;
  }
}
.iconfont {
  margin-right: 4px;
}
</style>
