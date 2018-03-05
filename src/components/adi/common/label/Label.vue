<template>
  <div class='comp-label'>
    <a :href='source.link'>
      <label> {{source.text}} </label>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiLabel',
  mixins: [compBaseMixin]
}
</script>
