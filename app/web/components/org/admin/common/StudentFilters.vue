 <template>
  <div class="student-filters">
    <div class="item">
      {{$t('org.classSelector')}}
      <el-select v-model="filterData.classId" size="medium" @change="filterDataChange">
        <el-option :label="$t('org.all')" :value="undefined">
        </el-option>
        <el-option v-for="(classItem, index) in orgClasses" :key="index" :label="classItem.name" :value="classItem.id">
        </el-option>
      </el-select>
    </div>
    <div class="item">
      用户类型：
      <el-select v-model="filterData.type" size="medium" @change="filterDataChange">
        <el-option :label="$t('org.all')" :value="undefined">
        </el-option>
        <el-option label="试听" :value="1"></el-option>
        <el-option label="正式" :value="2"></el-option>
      </el-select>
    </div>
    <div class="item input-item">
      <el-input placeholder="按学生姓名、用户名搜索" clearable suffix-icon="el-icon-search" size="medium" v-model.trim="filterData.username" @change="filterDataChange">
      </el-input>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'StudentFilters',
  mounted() {
    this.filterDataChange()
  },
  data() {
    return {
      filterData: {
        classId: undefined,
        type: undefined,
        username: undefined,
      },
    }
  },
  computed: {
    ...mapGetters({ getOrgClassesById: 'org/getOrgClassesById', currentOrgId: 'org/currentOrgId' }),
    orgClasses() {
      return this.getOrgClassesById({ id: this.currentOrgId }) || []
    },
  },
  methods: {
    filterDataChange() {
      this.$emit('change', this.filterData)
    },
  },
}
</script>
<style lang="scss" scoped>
.student-filters {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #e8e8e8;
  font-size: 14px;
  .el-select {
    width: 120px;
  }
  .item{
    margin-right: 40px;
  }
  .input-item {
    flex: 1;
    text-align: right;
    margin-right: 0;
    .el-input {
      width: 250px;
    }
    /deep/.el-input__inner {
      border: none;
      border-bottom: 1px solid #aaa;
      border-radius: 0;
      padding-left: 0;
    }
  }
}
</style>
