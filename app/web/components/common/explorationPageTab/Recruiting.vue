<template>
  <div class="recruiting">
    <el-row>
      <el-col :span="6" v-for="(project,index) in recruitmentData" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ProjectCell from '../ProjectCell'

export default {
  name: 'Recruiting',
  components: {
    ProjectCell
  }
}
</script>

