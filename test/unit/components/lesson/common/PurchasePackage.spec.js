import Vuex from 'vuex'
import { shallow, createLocalVue } from 'vue-test-utils'
import PurchasePackage from '@/components/lesson/common/PurchasePackage'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('purchage package component test', () => {
  let cmp
  let actions, getters, store
  const FakeRmb = 50
  const FakePackageDetailPath = '/student/package/10'
  const FakePath = '/student/package/10/purchase'
  const PurchasePackageSelector = '.purchase-package-button'
  const SubscribePackageFn = jest.fn()

  beforeEach(() => {
    actions = {
      'user/getProfile': jest.fn(),
      'lesson/getPackageDetail': jest.fn(),
      'lesson/subscribePackage': jest.fn()
    }
    getters = {
      'user/isLogined': () => true,
      'lesson/packageDetail': (packageId) => {
        return {
          packageId: packageId
        }
      }
    }
    store = new Vuex.Store({
      state: {},
      actions,
      getters
    })

    cmp = shallow(PurchasePackage, {
      store,
      localVue,
      mocks: {
        $route: {
          params: {
            id: '10'
          },
          path: FakePath
        },
        $t: key => key,
        lessonPackageDetail: packageId => packageId
      }
    })
    cmp.setData({
      packageDetail: {
        rmb: FakeRmb
      }
    })
    cmp.setMethods({
      subscribePackage: SubscribePackageFn
    })
  })

  describe('test computed data', () => {
    it('isLogin should be true', () => {
      expect(cmp.vm.isLogin).toBe(true)
    })
    it('packageId should be 10', () => {
      expect(cmp.vm.packageId).toBe('10')
    })
    // isPayByCoin should be false
    it('payCount should be "￥ FakeRmb"', () => {
      expect(cmp.vm.payCount).toEqual('￥ ' + FakeRmb)
    })
    it('nowPath should equal FakePath', () => {
      expect(cmp.vm.nowPath).toEqual(FakePath)
    })
    it('packageDetailPath should equal FakePackageDetailPath', () => {
      expect(cmp.vm.packageDetailPath).toEqual(FakePackageDetailPath)
    })
  })

  describe('test function', () => {
    it('subscribePackage function should be called if button be clicked', () => {
      expect(cmp.contains(PurchasePackageSelector)).toBe(true)
      let triggerButton = cmp.find(PurchasePackageSelector)
      triggerButton.trigger('click')
      expect(SubscribePackageFn).toBeCalled()
    })
  })
})
