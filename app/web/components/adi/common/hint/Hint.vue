<template>
  <div class="comp-teachers">
    <span>{{$t('card.teachersColon')}}</span>
    <vue-markdown :source="validData" />
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import VueMarkdown from 'vue-markdown'
export default {
  name: 'AdiTeachers',
  mixins: [compBaseMixin],
  components: {
    VueMarkdown
  },
  computed: {
    validData() {
      let isEmpty = !(this.properties.data && this.properties.data.trim())
      if (isEmpty && this.options.content) return this.$t(this.options.content)
      return this.properties.data
    }
  }
}
</script>

<style>
[data-mod='ModTeachers'] {
  padding-top: 0;
  padding-bottom: 0;
}
.comp-teachers {
  margin: 25px 40px;
  padding: 5px 3px;
  background: rgba(238, 238, 238, 0.5);
  border-radius: 4px;
  font-size: 16px;
  line-height: 20px;
}
.comp-teachers span {
  color: #ff5c5c;
}

.comp-teachers .content {
  margin: 20px 0 0;
  font-size: 16px;
  color: #333;
  font-family: inherit;
  word-wrap: break-word;
  white-space: pre-wrap;
}

#isTeachersContent {
  position: relative;
}

#isTeachersContent:hover:before {
  content: attr(data-tip);
  background: #303133;
  color: #fff;
  border-radius: 3px;
  padding: 8px 10px;
  position: absolute;
  left: -150px;
  top: -4px;
  white-space: pre-wrap;
  width: 120px;
  line-height: 16px;
  line-height: 1.2;
  font-size: 12px;
}
#isTeachersContent:hover:after {
  content: '';
  position: absolute;
  left: -10px;
  width: 0;
  height: 0;
  border-left: 8px solid #313033;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}
</style>
