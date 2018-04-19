<template>
  <div class="comp-quizz">
    <div v-for="(item, index) in properties.data">
      <div>Quiz {{index + 1}}</div>
      <div>{{ item.title }}</div>

      <ol type="A">
        <li v-for="opt in item.options">{{ opt.item }}</li>
      </ol>

      <div hidden><span>Answer:</span> {{ item.answer }}</div>
      <div><span>Score:</span> {{ item.score }}</div>
      <div hidden><span>Analysis:</span> {{ item.desc }}</div>
    </div>
  </div>
</template>


<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiQuizz',
  mixins: [compBaseMixin],
}
</script>

<style>
  .com-quizz {

  }
</style>


