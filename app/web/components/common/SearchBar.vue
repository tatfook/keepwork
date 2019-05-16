<template>
  <el-input v-if="isShowSearchBar" v-model="searchText" class="search-bar-comp" :placeholder="$t('common.searchInKp')" @keyup.enter.native='goSearch'>
    <i slot="suffix" class="el-icon-search search-bar-comp-button" @click="goSearch"></i>
  </el-input>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SearchBar',
  data() {
    return {
      searchText: '',
      searchScope: 'all',
      isShowSearchBar: true
    }
  },
  computed: {
    ...mapGetters({
      loginUsername: 'user/username'
    }),
    isLogin() {
      return this.loginUsername
    }
  },
  watch: {
    $route({ name }) {
      this.isShowSearchBar = !['ExplorationPage'].includes(name)
    }
  },
  methods: {
    goSearch() {
      let searchParams = {
        searchType: 'pageinfo',
        keyword: this.searchText
      }
      if (this.searchScope === 'loginUser') {
        searchParams.username = this.loginUsername
      }
      let searchParamsArr = []
      _.forIn(searchParams, (value, key) => {
        searchParamsArr.push(`${key}=${value}`)
      })
      let searchUrl = encodeURI(`/explore?tab=allProjects&${searchParamsArr.join('&')}`)
      window.location.href = searchUrl
    }
  }
}
</script>
<style lang="scss">
.search-bar-comp {
  .el-input__inner {
    width: 240px;
    height: 32px;
    background: #f5f5f5;
    border: none;
  }
  &-button {
    font-weight: bold;
  }
  .el-input__inner:hover,
  .el-input__inner:focus {
    border-color: #dcdfe6;
  }
  &-select {
    .el-input__inner {
      width: 82px;
      font-size: 12px;
      padding: 0 5px 0 10px;
    }
    .el-select__caret {
      font-size: 12px;
    }
    .el-input__suffix {
      right: 0;
    }
  }
  .el-input-group__append .el-button {
    margin: 0;
    padding: 7px 4px;
  }
  .el-icon-search {
    position: relative;
    width: 24px;
    margin: 0;
    bottom: unset;
    right: unset;
    font-size: 14px;
  }
  .el-input-group__append {
    padding: 0;
    background-color: transparent;
    border-left: none;
  }
}
</style>
