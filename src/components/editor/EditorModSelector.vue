<template>
  <div>
    <div class='operator' v-if='mod.isActive'>
      <el-button title='Edit'></el-button>
    </div>
    <component :is='modComponent' :mod='mod'> </component>
  </div>
</template>

<script>
import AdiComponents from '@/components/adi/adi-mod'

export default {
  props: {
    mod: {
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    modComponent() {
      return AdiComponents[this.mod.modType]
    }
  }
};
</script>
