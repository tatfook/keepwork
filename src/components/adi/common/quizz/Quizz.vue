<template>
  <div class="comp-quizz">
    <div v-for="item in properties.data" :data-id="item.id">
      <div class="no">Quiz </div>
      <h3>{{ item.title }}</h3>

      <div v-if="isOperate">
        <!-- 单选题 -->
        <el-radio-group v-if="item.type == 0" v-model="quizz.single">
          <div class="opt-item" v-for="(opt, index) in item.options">
            <el-radio :label="serialNo[index]">{{serialNo[index]}} {{opt.item}}</el-radio>
          </div>
        </el-radio-group>

        <!-- 多选题 -->
        <el-checkbox-group v-if="item.type == 1" v-model="quizz.multiple">
          <div class="opt-item" v-for="(opt, index) in item.options">
            <el-checkbox name="option" :label="serialNo[index]">{{serialNo[index]}} {{opt.item}}</el-checkbox>
          </div>
        </el-checkbox-group>

        <!-- 判断题 -->
        <el-radio-group v-if="item.type == 2" v-model="quizz.judge">
            <div class="opt-item" v-for="(opt, index) in item.options">
              <el-radio :label="serialNo[index]">{{serialNo[index]}} {{opt.item}}</el-radio>
            </div>
        </el-radio-group>
      </div>

      <div v-if="!isOperate">
        <div class="opt-item" v-for="(opt, index) in item.options">
            {{serialNo[index]}} {{opt.item}}
        </div>
      </div>

      <div hidden><span>Answer:</span> {{ item.answer }}</div>
      <div hidden><span>Score:</span> {{ item.score }}</div>
      <div hidden><span>Analysis:</span> {{ item.desc }}</div>

      <el-button v-if="isOperate" type="primary" @click="submitQuizz">submit</el-button>
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

const hideMod = function(name, flag) {
  let eles = document.getElementsByTagName('div');
  for(let i =0; i < eles.length; i++) {
    let ele = eles[i];
    if(ele.getAttribute('data-mod')==name){
      if(flag) {
        ele.setAttribute('hidden', 'hidden');
      }else {
        ele.removeAttribute('hidden');
      }
    }
  }
}

export default {
  name: 'AdiQuizz',
  mixins: [compBaseMixin],
  data() {
    return {
      isOperate: false,
      serialNo: ['A', 'B', 'C', 'D', 'E', "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      quizz: {
        single: '',
        multiple: '',
        judge: ''
      }
    }
  },
  mounted: function() {
    let query = location.href.split('?')[1];
    let device;
    if (query) {
        query = query.split('&');
        for (var i = 0; i < query.length; i++) {
            var ary = query[i].split('=');
            if (ary[0] == 'device' && ary[1]) {
                device = ary[1];
                break;
            }
        }
    }
    if (device == 'pc' || device == 'pad') {
      document.getElementsByClassName('index-page-header')[0].setAttribute('hidden', 'hidden');
      document.getElementsByClassName('tool-header')[0].setAttribute('hidden', 'hidden');
      hideMod('ModLesson', true);
      this.isOperate = true;
    }
  },
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
  [data-mod="ModQuizz"] {
    padding: 30px 0;
  }
  [data-mod="ModQuizz"] .no:after {
    content: counters(no, '-');
    counter-increment: no;
  }

  .comp-quizz .opt-item{
    margin-bottom: 15px;
  }
</style>


