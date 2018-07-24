<template>
  <el-input v-model="searchText" class="search-bar-comp" @keyup.enter.native='goSearch'>
    <el-select class="search-bar-comp-select" v-model="searchScope" slot="prepend">
      <el-option :label="$t('search.searchAll')" value="all"></el-option>
      <el-option :label="$t('search.searchMine')" value="loginUser" v-show="isLogin"></el-option>
    </el-select>
    <el-button slot="append" icon="el-icon-search" @click="goSearch"></el-button>
  </el-input>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SearchBar',
  data() {
    return {
      searchText: '',
      searchScope: 'all'
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
      let searchUrl = encodeURI(`/wiki/search?${searchParamsArr.join('&')}`)
      window.location.href = searchUrl
    }
  }
}
</script>
<style lang="scss">
.search-bar-comp {
  .el-input__inner {
    border-right: none;
    width: 100px;
    padding: 0 0 0 10px;
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
    padding: 9px 4px;
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
