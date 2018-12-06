<template>
  <div class="comp-quiz">
    <div class="splic"></div>

    <div v-for="(item, index) in properties.data" :id="item.id" :key="index">
      <div class="no">
        <i class="el-icon-edit-outline"></i> {{$t('card.quiz')}} </div>

      <div class="quiz-content">
        <div class="title break-word">{{ item.title }}
          <span v-if="item.type == 1">(
            <span class="multiple-choices-font">{{$t('card.multipleChoices')}}</span>)</span>
        </div>
        <div :data-answer="item.answer" class="getData">
          <div class="opt-item" v-for="(opt, index) in item.options" v-if="item.type == 0 || item.type == 1 || item.type == 2" :key="index">
            {{serialNo[index]}}
            <span v-if="item.type == 2">{{$t(`card.${opt.item}`)}}</span>
            <span v-else>{{opt.item}}</span>
          </div>
          <div class="opt-item" v-for="(opt, index) in item.options" v-if="item.type == 3" :key="index">
            <div>{{$t('modList.text')}} {{index+1}}: </div>
            <pre class="break-word">{{opt.item}}</pre>
          </div>
        </div>
        <div v-if="item.type == 3">
          <el-input type="textarea" maxlength="512" :placeholder="$t('card.textMatchPlaceholder')"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiQuiz',
  mixins: [compBaseMixin],
  data() {
    return {
      serialNo: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ]
    }
  }
}
</script>

<style>
[mod-container],
.viewport-container {
  counter-reset: no;
}

[data-mod='ModQuiz'] {
  padding-top: 0;
  padding-bottom: 0;
}

[data-mod='ModQuiz'] .no {
  font-weight: 600;
}

[data-mod='ModQuiz'] .no > i {
  color: #1982ff;
  font-size: 22px;
  font-weight: 600;
  padding-right: 12px;
  vertical-align: middle;
}

[data-mod='ModQuiz'] .no:after {
  content: counters(no, '-');
  counter-increment: no;
}

.quiz-content {
  margin-left: 40px;
}

.splic {
  height: 1px;
  margin: 0 0 30px 40px;
  border-bottom: 1px dashed #bfbfbf;
}

[data-mod='ModQuiz']:last-child {
  padding-bottom: 40px;
}

.comp-quiz {
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #fff;
  color: #4c4c4c;
}

.comp-quiz .title {
  margin: 15px 0 5px;
}

.comp-quiz .title span {
  padding-left: 10px;
}

.multiple-choices-font {
  color: #ff414a;
  font-style: normal;
}

.comp-quiz .opt-item {
  margin-top: 20px;
}

.quiz-content .el-radio__label,
.quiz-content .el-checkbox__label {
  font-size: 16px;
}
.quiz-content .el-radio__input.is-checked + .el-radio__label,
.quiz-content .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #4c4c4c;
  font-weight: 600;
}

.quiz-content .el-button {
  margin: 20px 0;
}

.submit-show {
  margin: 20px 0 20px 20px;
  padding: 15px 25px;
  background: rgba(64, 158, 254, 0.05);
  font-weight: 600;
  color: #409efe;
}

.submit-show .opt-item {
  margin: 12px 0;
}

.submit-show span {
  color: #111;
}

.comp-quiz.error {
  margin-bottom: 20px;
  background: rgba(245, 56, 56, 0.05);
  border: 1px solid #f53838;
}

.comp-quiz.error .submit-show {
  background: none;
  color: #ff414a;
  margin-bottom: 0;
  padding: 15px 20px 0;
}

.quiz-item-done {
  background: #409efe;
  color: white;
}

.quiz-item:hover {
  background: #f99523;
  border: 1px solid #f99523;
  color: white;
}

.break-word {
  white-space: normal;
  word-wrap: break-word;
}
</style>
