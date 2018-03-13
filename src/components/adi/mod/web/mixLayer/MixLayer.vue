<template>
  <div :class="modClasses()">
    <CompWrapper :mod="mod" property='title' :editMode="editMode" :classes="compWrapperClass('title')" :options="compWrapperOptions('title')" />
    <CompWrapper :mod="mod" property='subtitle' :editMode="editMode" :classes="compWrapperClass('subtitle')" :options="compWrapperOptions('subtitle')" />
    <CompWrapper :mod="mod" property='paragraph' :editMode="editMode" :classes="compWrapperClass('paragraph')" :options="compWrapperOptions('paragraph')" />
    <CompWrapper :mod="mod" property="media" :editMode="editMode" :classes="compWrapperClass('media')" :options="compWrapperOptions('media')" />
  </div>
</template>

<script>
import baseMixin from '@/components/adi/mod/base/base.mixin'
import CompWrapper from '@/components/adi/mod/base/CompWrapper'
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

export default {
  props: {
    mod: Object,
    conf: Object,
    theme: Object,
    editMode: Boolean
  },
  mixins: [baseMixin],
  components: { CompWrapper },
  created() {
    if (this.sheet) this.sheet.detach()
    this.style = this.conf.styles[this.mod.styleID]
    this.sheet = jss.createStyleSheet(this.style.data)
    this.sheet.attach()
  }
}
</script>
