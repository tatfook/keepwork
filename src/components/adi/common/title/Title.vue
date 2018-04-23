<template>
  <div class="comp-title">
    <a :target='properties.target ? properties.target : options.emptyTarget' :href='properties.link ? properties.link : options.emptyLink'>
      <h1>{{ properties.name ? properties.name : $t(options.emptyName) }}</h1>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiTitle',
  mixins: [compBaseMixin],
  methods: {},
  computed: {}
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: unset;
}

h1 {
  margin: 0;
  font-size: unset;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
