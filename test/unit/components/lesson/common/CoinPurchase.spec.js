import Vuex from 'vuex'
import { shallow, createLocalVue } from 'vue-test-utils'
import CoinPurchase from '@/components/lesson/common/CoinPurchase'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('purchase by coin component test', () => {
  let cmp
  let getters, store

  const FakeRmbCount = 5
  const FakeRestCoin = 3000
  const FakePackageNeedCoin = 2000
  const FakeLargerPackageNeedCoin = 4000

  beforeEach(() => {
    getters = {
      'lesson/userinfo': () => {
        return {
          id: 6,
          coin: FakeRestCoin
        }
      }
    }
    store = new Vuex.Store({
      state: {},
      getters
    })

    cmp = shallow(CoinPurchase, {
      store,
      localVue,
      propsData: {
        packageDetail: {
          isSubscribe: false,
          coin: FakePackageNeedCoin,
          rmb: FakeRmbCount
        }
      },
      mocks: {
        $t: key => key
      }
    })
  })

  it('restCoin should equal FakeRestCoin', () => {
    expect(cmp.vm.restCoin).toEqual(FakeRestCoin)
  })
  it('packageNeedCoinsCount should equal FakePackageNeedCoin', () => {
    expect(cmp.vm.packageNeedCoinsCount).toEqual(FakePackageNeedCoin)
  })
  it('isUserHaveEnoughCoin should be true', () => {
    expect(cmp.vm.isUserHaveEnoughCoin).toBe(true)
  })
  it('isUserHaveEnoughCoin should be false if restCoin < packageNeedCoinsCount', () => {
    let notEnoughCmp = shallow(CoinPurchase, {
      store,
      localVue,
      propsData: {
        packageDetail: {
          isSubscribe: false,
          coin: FakeLargerPackageNeedCoin,
          rmb: FakeRmbCount
        }
      },
      mocks: {
        $t: key => key
      }
    })
    expect(notEnoughCmp.vm.isUserHaveEnoughCoin).toBe(false)
  })
})
