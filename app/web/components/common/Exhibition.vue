<template>
  <div class="exhibition-hall">
    <div class="exhibition-hall-breadcrumd">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>在线展厅</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="exhibition-hall-filter">
      <el-cascader v-model="selectedGameType" :options="gameTypeOptions" @change="handleChange"></el-cascader>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ExhibitionHall',
  data() {
    return {
      selectedGameType: [],
      gameTypeOptions: [
        {
          value: '1',
          label: '全国青少年科技创新大赛',
          children: [
            {
              value: '1-1',
              label: '参赛作品'
            },
            {
              value: '1-2',
              label: '获奖作品'
            },
          ]
        }
      ]
    }
  },
  methods: {
    handleChange(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.exhibition-hall {
  max-width: 1200px;
  margin: 10px auto;
  &-filter {
    height: 164px;
    background-color: #fff;
    padding-left: 20px;
    border: 1px solid red;
    margin: 20px 0;
  }
}
</style>

