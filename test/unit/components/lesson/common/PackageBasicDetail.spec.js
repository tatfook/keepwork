import { shallow, createLocalVue } from 'vue-test-utils'
import Vuex from 'vuex'
import PackageBasicDetailComp from '@/components/lesson/common/PackageBasicDetail'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('PackageBasicDetail component test', () => {
  let cmp
  let actions, getters, store

  const FakeCoverUrl = 'https://keepwork.com/fakeCoverUrl.jpg'
  beforeEach(() => {
    const $route = {
      path: '/student/package/10',
      name: 'StudentPackage'
    }
    actions = {
      userGetProfile: jest.fn()
    }
    getters = {
      'user/profile': () => { },
      'user/isLogined': () => true
    }
    store = new Vuex.Store({
      state: {},
      actions,
      getters
    })

    cmp = shallow(PackageBasicDetailComp, {
      store,
      localVue,
      propsData: {
        packageDetail: {
          isSubscribe: false
        }
      },
      mocks: {
        $route,
        $t: key => key
      }
    })
  })

  describe('test PackageBasicDetail computed data', () => {
    it('lessons count of package should be 2', () => {
      cmp.setProps({
        packageDetail: {
          lessons: [
            { id: 1 }, { id: 2 }
          ]
        }
      })
      expect(cmp.vm.packageLessonsCount).toBe(2)
    })
    it('package coverUrl should equal to FakeCoverUrl', () => {
      cmp.setProps({
        packageDetail: {
          extra: {
            coverUrl: FakeCoverUrl
          }
        }
      })
      expect(cmp.vm.packageCoverUrl).toEqual(FakeCoverUrl)
    })
    it('packageId should be "2"', () => {
      cmp.setProps({
        packageDetail: {
          id: '2'
        }
      })
      expect(cmp.vm.packageId).toEqual('2')
    })
  })

  describe('test PackageBasicDetail event', () => {
    it('addPackage method should be called if button click event triggered', () => {
      expect(cmp.contains('.package-detail-operate-button')).toBe(true)

      let buttonObj = cmp.find('.package-detail-operate-button')
      let addPackageFn = jest.fn()
      cmp.setMethods({
        addPackage: addPackageFn
      })
      buttonObj.trigger('click')
      expect(addPackageFn).toBeCalled()
    })
  })
})
