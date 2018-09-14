<template>
  <div>
    <hint v-if="isTeacher && mod.cmd === 'Hint' && isShowHint" :data="mod" :key="mod.key"></hint>
    <quiz v-else-if="mod.cmd === 'Quiz'" :data="mod" :isPreview="isPreview" :isPrint="isPrint" :key="mod.key"></quiz>
    <div v-else class="mod-item-container">
      <mod-loader :mod="mod" :theme="theme" :key="mod.key"></mod-loader>
    </div>

  </div>
</template>

<script>
import ModLoader from '@/components/viewer/ModLoader'
import AsyncModLoader from '@/components/adi/mod/index.async'
import themeFactory from '@/lib/theme/theme.factory'
import ThemeHelper from '@/lib/theme'
import Quiz from './Quiz'
import Hint from './Hint'
import { mapGetters } from 'vuex'
export default {
  name: 'LessonWrap',
  components: {
    Quiz,
    Hint,
    ModLoader
  },
  props: {
    mod: Object,
    originData: Array,
    modList: Array,
    isPreview: {
      type: Boolean,
      default: false
    },
    isPrint: {
      type: Boolean,
      default: false
    },
    isTeacher: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      isShowHint: 'lesson/teacher/isShowHint'
    }),
    theme() {
      let newTheme = themeFactory.generate(ThemeHelper.defaultTheme)
      if (this.storedTheme === newTheme) return this.storedTheme
      if (this.storedTheme) this.storedTheme.sheet.detach()
      this.storedTheme = newTheme
      this.storedTheme.sheet.attach()
      return this.storedTheme
    }
  }
}
</script>

<style lang="scss">
.mod-item-container {
  background: white;
  max-width: 1229px;
  margin: 0 auto;
}
</style>

