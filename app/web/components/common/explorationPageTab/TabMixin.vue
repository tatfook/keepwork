<script>
import ProjectCell from '../ProjectCell'

export default {
  data() {
    return {
      loading: true,
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
          if (key === 'content') {
            return name.join('...').replace(/<span>/g, `<span class="red">`)
          }
          return name.join().replace(/<span>/g, `<span class="red">`)
        }
      }
      if (key === 'id') {
        return '#' + i[key]
      }
      if (key === 'content' && i[key].length > 80) {
        return i[key].substring(0, 80) + '...'
      }
      return i[key]
    }
  },
  components: {
    ProjectCell
  }
}
</script>
