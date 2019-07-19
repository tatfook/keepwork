import Vuex from 'vuex'
import { shallow, mount, createLocalVue } from 'vue-test-utils'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('SkyDriveManagerDialog Comp test', () => {
  const wrapper = shallow(SkyDriveManagerDialog, {
    propsData: {
      show: true
    },
    mocks: {
      $t: key => key,
      $store: {
        getters: {
          'skydrive/uploadingFiles': () => [],
          'skydrive/noFinishedUploadingFiles': () => [],
          'user/skyDriveFileList': () => []
        }
      }
    }
  })

  it('dialog should show when show is true', () => {
    expect(wrapper.html()).not.toBe(undefined)
  })

  it('dialog should not show when show is false', () => {
    wrapper.setProps({
      show: false
    })
    expect(wrapper.html()).toBe(undefined)
  })

  it('stateDoingFiles test', () => {
    wrapper.setComputed({
      uploadingFiles: [
        { filename: 'name1', state: 'doing' },
        { filename: 'name2', state: 'error' },
        { filename: 'name3', state: 'doing' },
        { filename: 'name4', state: 'success' }
      ]
    })
    expect(wrapper.vm.stateDoingFiles).toEqual([
      { filename: 'name1', state: 'doing' },
      { filename: 'name3', state: 'doing' }
    ])
  })

  it('handleClose method be called when close event is emitted', () => {})
})
