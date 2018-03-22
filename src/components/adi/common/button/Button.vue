<template>
  <button>{{properties.name}}</button>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiButton',
  mixins: [compBaseMixin]
}
</script>
