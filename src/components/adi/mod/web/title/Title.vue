<template>
    <div :class="modClasses()">
        <CompWrapper :mod="mod" property="logo" :editMode="editMode" :classes="compWrapperClass('logo')" :options="compWrapperOptions('logo')" />
        <div :class="compWrapperClass('couple')">
            <CompWrapper :mod="mod" property='businessName' :editMode="editMode" :classes="compWrapperClass('businessName')" :options="compWrapperOptions('businessName')" />
            <CompWrapper :mod="mod" property='tagline' :editMode="editMode" :classes="compWrapperClass('tagline')" :options="compWrapperOptions('tagline')" />
        </div>
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