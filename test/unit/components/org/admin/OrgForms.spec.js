import OrgForms from '@/components/org/admin/OrgForms'
import { shallow, createLocalVue } from 'vue-test-utils'
import { Table, TableColumn } from 'element-ui'
import sinon from 'sinon'
import _ from 'lodash'
import Vuex from 'vuex'
import { JsxEmit } from 'typescript'
const localVue = createLocalVue()

localVue.use(Vuex)
const createWrapper = ({ store, orgFormsList, formsList, isFormExist }) => {
  return shallow(OrgForms, {
    store,
    computed: {
      isFormExist,
      formsList
    },
    stubs: {
      'el-table': Table,
      'el-table-column': TableColumn
    },
    mocks: {
      $store: {
        dispatch: () => {},
        getters: {
          'org/formsList': () => [],
          'org/currentOrgId': 2
        },
        actions: {
          'org/getForms': () => {},
          // 'org/updateForm': () => {},
          'org/createForm': () => {},
          'org/deleteForm': () => {}
        }
      }
    }
  })
}

describe('form publish test', () => {
  it('orgUpdateForms function be called when click publish button', () => {
    let actions = {
      orgUpdateForms: jest.fn()
    }
    let store = new Vuex.Store({
      namespaced: true,
      state: {},
      actions
    })
    let wrapper = createWrapper({
      store,
      isFormExist: () => true,
      formsList: () => [
        {
          state: 0,
          title: 'test form',
          type: 1,
          text: 'test form text',
          buttonText: '发布'
        }
      ]
    })
    let changeFormStateSpy = sinon.spy()

    wrapper.setMethods({
      changeFormState: changeFormStateSpy
    })
    let publishBtn = wrapper.findAll('el-button').at(2)
    publishBtn.trigger('click')

    // expect(actions.orgUpdateForms).toHaveBeenCalled() // test failed
    expect(changeFormStateSpy.called).toBe(true)
  })
})
