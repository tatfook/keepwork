<script>
export default {
  data() {
    return {
      perPage: 20,
      page: 1
    }
  },
  methods: {
    searchKeyResult(i, key) {
      if (i.highlight) {
        if (i.highlight[key]) {
          let name = _.get(i.highlight, key, i[key])
          if (key === 'id') {
            return name.join().replace(/<span>/g, `<span class="red">#`)
          }
          return name.join().replace(/<span>/g, `<span class="red">`)
        }
      }else{
        if(key === 'id'){
          return '#' + i[key]
        }
        return i[key]
      }
    }
  }
}
</script>
