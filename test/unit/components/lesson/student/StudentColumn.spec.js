import { shallow } from 'vue-test-utils'
import StudentColumnComp from '@/components/lesson/student/StudentColumn'
import Header from '@/components/lesson/common/Header'
import UserSubscribePackages from '@/components/lesson/common/UserSubscribePackages'

describe('StudentColumn Comp test', () => {
  let Cmp
  const $route = {
    fullPath: '/student'
  }
  beforeEach(() => {
    Cmp = shallow(StudentColumnComp, {
      mocks: {
        $route,
        $t: key => key
      }
    })
  })

  it('fullPath equals to "/student"', () => {
    expect(Cmp.vm.nowFullPath).toEqual('/student')
  })
  it('contain Header Comp', () => {
    expect(Cmp.contains(Header)).toBe(true)
  })
  it('contain UserSubscribePackages Comp', () => {
    expect(Cmp.contains(UserSubscribePackages)).toBe(true)
  })
})
