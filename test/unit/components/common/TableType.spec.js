import { shallow, createLocalVue } from 'vue-test-utils'
import TableType from '@/components/common/skyDrive/TableType'
import { Table, TableColumn } from 'element-ui'
const localVue = createLocalVue()
localVue.use(Table)
localVue.use(TableColumn)
const createWrapper = ({ fileListFilteredSearched, loadMethod, tableData }) => {
  return shallow(TableType, {
    // localVue,
    propsData: {
      fileListFilteredSearched: fileListFilteredSearched || []
    },
    slots: {
      append: '<div class="append-slot"></div>',
      'no-more': '<div class="no-more-slot"></div>'
    },
    mocks: {
      $t: key => key,
      tableData: tableData || [],
      tableDataWithUploading: tableData || []
    },
    methods: {
      load: loadMethod || jest.fn()
    }
    // stubs: ['el-table', 'el-table-column']
    // stubs: {
    //   'el-table': Table,
    //   'el-table-column': TableColumn
    // }
  })
}

describe('TableType comp test', () => {
  it('"没有更多了" should show if infinite loading complete', () => {
    let loadMethodFn = jest.fn()
    let wrapper = createWrapper({
      fileListFilteredSearched: [{ filename: 'file1' }, { filename: 'file2' }],
      loadMethod: loadMethodFn
    })
    wrapper.vm.initData()
    console.log(wrapper.html())
    expect(wrapper.html()).toContain('没有更多了')
  })
})
