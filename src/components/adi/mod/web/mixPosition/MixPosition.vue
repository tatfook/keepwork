<template>
  <div :class="modClasses()">
    <CompWrapper :mod="mod" property="media" :compType="conf.components['media']" :modData="modData" :editMode="editMode" :classes="compWrapperClass('media')" :options="compWrapperOptions('media')" />

    <div :class="compWrapperClass('group')">
      <CompWrapper :mod="mod" property='title' :compType="conf.components['title']" :modData="modData" :editMode="editMode" :classes="compWrapperClass('title')" :options="compWrapperOptions('title')" />
      <CompWrapper :mod="mod" property='subtitle' :compType="conf.components['subtitle']" :modData="modData" :editMode="editMode" :classes="compWrapperClass('subtitle')" :options="compWrapperOptions('subtitle')" />
      <CompWrapper :mod="mod" property='paragraph' :compType="conf.components['paragraph']" :modData="modData" :editMode="editMode" :classes="compWrapperClass('paragraph')" :options="compWrapperOptions('paragraph')" />
      <CompWrapper :mod="mod" property='button' :compType="conf.components['button']" :modData="modData" :editMode="editMode" :classes="compWrapperClass('button')" :options="compWrapperOptions('button')" />
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
