<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div :style="loadCover(properties)">
          <video :src='properties.lessonVideoSrc'></video>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="lessonDesc">
          <span>Lesson {{properties.lessonNo}}: {{properties.lessonTitle}}</span><br>
          <span>Lesson Goals:</span><br>
          <span>{{properties.lessonGoals}}</span>
          <el-row>
            <el-button @click="playClick" type="primary">Play Paracraft</el-button>
            <el-button @click="classOpClick" v-if="properties.vipFlag" type="primary">Begin the Class</el-button>
            <span>(Click here to begin the class)</span>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-tabs class="tabs" value="first" @tab-click="tabClick">
        <el-tab-pane label="Overview" name="first"></el-tab-pane>
        <el-tab-pane label="Related Animations" name="second"></el-tab-pane>
        <el-tab-pane label="Student's Performance" v-if="properties.vipFlag" name="third"></el-tab-pane>
        <el-tab-pane label="Summary" name="fourth"></el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiLesson',
  mixins: [compBaseMixin],
  methods: {
    loadCover(properties) {
      return this.generateStyleString({
        background: 'url(' + properties.lessonCoverSrc + ')',
        'background-position': 'center',
        'background-size': 'cover'
      })
    },
    tabClick(tab) {
      this.options.tabClick(tab)
    },
    playClick() {
      this.options.playClick()
    },
    classOpClick() {
      this.options.classOpClick()
    }
  },
  computed: {
  }
}
</script>

<style>
  .lessonDesc {
    padding-left: 20px;
  }
</style>

