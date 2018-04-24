<template>
  <div class="comp-quizz">
    <div v-for="item in properties.data" :data-id="item.id">
      <h3 class="no">Quiz </h3>
      <div>{{ item.title }}</div>

      <ol type="A">
        <li v-for="opt in item.options">{{ opt.item }}</li>
      </ol>

      <div hidden><span>Answer:</span> {{ item.answer }}</div>
      <div hidden><span>Score:</span> {{ item.score }}</div>
      <div hidden><span>Analysis:</span> {{ item.desc }}</div>

      <!-- <el-button type="primary" @click="submitQuizz">submit</el-button> -->
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiQuizz',
  mixins: [compBaseMixin],
  methods: {
    submitQuizz() {
      console.log(this.properties.data);
    }
  }
}
</script>

<style>
  [mod-container], .viewport-container {
    counter-reset: no;
  }
  [data-mod="ModQuizz"] .no:after {
    content: counters(no, '-');
    counter-increment: no;
  }
</style>


