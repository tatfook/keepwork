import Vuex from 'vuex'
import { shallow, mount, createLocalVue } from 'vue-test-utils'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import SkyDriveManager from '@/components/common/SkyDriveManager'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('SkyDriveManagerDialog Comp test', () => {
  const wrapper = shallow(SkyDriveManagerDialog, {
    propsData: {
      show: true
    },
    mocks: {
      $t: key => key,
      $confirm: () => {
        return Promise.resolve()
      },
      $store: {
        getters: {
          'skydrive/uploadingFiles': () => [],
          'skydrive/noFinishedUploadingFiles': () => [],
          'user/skyDriveFileList': () => []
        }
      }
    }
  })
  const handleCloseSpy = jest.spyOn(wrapper.vm, 'handleClose')
  const confirmSpy = jest.spyOn(wrapper.vm, '$confirm')

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
    wrapper.setProps({
      show: true
    })
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

  it('handleClose method be called when close event is emitted', () => {
    const childCompWrapper = wrapper.find(SkyDriveManager)
    childCompWrapper.vm.$emit('close')
    expect(handleCloseSpy).toBeCalled()
  })

  it('$confirm method be call if there exist uploading files', () => {
    wrapper.setComputed({
      stateDoingFiles: [{}, {}]
    })
    wrapper.vm.handleClose()
    expect(confirmSpy).toBeCalled()
  })

  it('close event emit if there not exist uploading files', () => {
    wrapper.setComputed({
      stateDoingFiles: []
    })
    wrapper.vm.handleClose()
    expect(wrapper.emitted().close).toBeTruthy()
  })
})
