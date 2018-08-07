import { shallow } from 'vue-test-utils'
import PackageDetailPageComp from '@/components/lesson/student/PackageDetailPage'
import Header from '@/components/lesson/common/Header'
import PackageDetail from '@/components/lesson/common/PackageDetail'
describe('package detail of student', () => {
  let Cmp
  const $route = {
    params: {
      id: '10'
    }
  }
  beforeEach(() => {
    Cmp = shallow(PackageDetailPageComp, {
      mocks: {
        $route,
        $t: () => {}
      }
    })
  })

  it('equal actorType to "student"', () => {
    expect(Cmp.vm.actorType).toEqual('student')
  })

  it('contain Header Comp', () => {
    expect(Cmp.contains(Header)).toBe(true)
  })

  it('contain PackageDetail Comp', () => {
    expect(Cmp.contains(PackageDetail)).toBe(true)
  })
})
