import { shallow, createLocalVue } from 'vue-test-utils'
import Vuex from 'vuex'
import PackageBasicDetailComp from '@/components/lesson/common/PackageBasicDetail'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('PackageBasicDetail component test', () => {
  let cmp
  let actions, getters, store

  const FakeCoverUrl = 'https://keepwork.com/fakeCoverUrl.jpg'
  const FakePath = '/student/package/10'
  const FakeName = 'StudentPackage'
  const FakeRmbCount = 5
  beforeEach(() => {
    const $route = {
      path: FakePath,
      name: FakeName
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
          isSubscribe: false,
          rmb: FakeRmbCount
        }
      },
      mocks: {
        $route,
        $t: key => key
      }
    })
  })

  describe('test PackageBasicDetail computed data', () => {
    it('isLogin should be true', () => {
      expect(cmp.vm.isLogin).toBe(true)
    })
    it('nowPath should equal FakePath', () => {
      expect(cmp.vm.nowPath).toEqual(FakePath)
    })
    it('nowPageName should equal FakeName', () => {
      expect(cmp.vm.nowPageName).toEqual(FakeName)
    })
    it('purchasePath should equal "/student/package/10/purchase"', () => {
      expect(cmp.vm.purchasePath).toEqual(FakePath + '/purchase')
    })
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
    it('backCoinHtml should equal "<span>FakeRmbCount</span>"', () => {
      expect(cmp.vm.backCoinHtml).toEqual(`<span>${FakeRmbCount}</span>`)
    })
    it('isPurchaseButtonHide should be false', () => { // packageDetail.isSubscribe === false && nowPageName !== 'StudentPurchase' && nowPageName !== 'TeacherPurchase'
      expect(cmp.vm.isPurchaseButtonHide).toBe(false)
    })
    it('isPurchaseButtonHide should be true', () => { // packageDetail.isSubscribe === true && nowPageName !== 'StudentPurchase' && nowPageName !== 'TeacherPurchase'
      cmp.setProps({
        packageDetail: {
          isSubscribe: true
        }
      })
      expect(cmp.vm.isPurchaseButtonHide).toBe(true)
    })
    it('isPurchaseButtonHide should be true', () => { // packageDetail.isSubscribe === false && nowPageName === 'StudentPurchase' && nowPageName !== 'TeacherPurchase'
      cmp = shallow(PackageBasicDetailComp, {
        store,
        localVue,
        propsData: {
          packageDetail: {
            isSubscribe: false,
            rmb: FakeRmbCount
          }
        },
        mocks: {
          $route: {
            path: '/student/package/10/purchase',
            name: 'StudentPurchase'
          },
          $t: key => key
        }
      })
      expect(cmp.vm.isPurchaseButtonHide).toBe(true)
    })
    it('isPurchaseButtonHide should be true', () => { // packageDetail.isSubscribe === false && nowPageName !== 'StudentPurchase' && nowPageName === 'TeacherPurchase'
      cmp = shallow(PackageBasicDetailComp, {
        store,
        localVue,
        propsData: {
          packageDetail: {
            isSubscribe: false,
            rmb: FakeRmbCount
          }
        },
        mocks: {
          $route: {
            path: '/teacher/package/10/purchase',
            name: 'TeacherPurchase'
          },
          $t: key => key
        }
      })
      expect(cmp.vm.isPurchaseButtonHide).toBe(true)
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
