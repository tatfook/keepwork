<template>
  <div :class="modClasses()">
    <CompWrapper :mod="mod" property="logo" :compType="conf.components['logo']" :modData="modData" :editMode="editMode" :classes="compWrapperClass('logo')" :options="compWrapperOptions('logo')" />
    <div :class="compWrapperClass('couple')">
      <CompWrapper :mod="mod" property='businessName' :compType="conf.components['businessName']" :modData="modData" :editMode="editMode" :classes="compWrapperClass('businessName')" :options="compWrapperOptions('businessName')" />
      <CompWrapper :mod="mod" property='tagline' :compType="conf.components['tagline']" :modData="modData" :editMode="editMode" :classes="compWrapperClass('tagline')" :options="compWrapperOptions('tagline')" />
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
  mixins: [baseMixin],
  components: { CompWrapper }
}
</script>