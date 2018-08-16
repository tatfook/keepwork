import { shallow } from 'vue-test-utils'
import HeaderComp from '@/components/lesson/common/Header'

describe('Header Comp test', () => {
  let Cmp

  describe('test Header on student packageDetailPage', () => {
    const $route = {
      fullPath: '/student/package/10',
      name: 'StudentPackage'
    }
    beforeEach(() => {
      Cmp = shallow(HeaderComp, {
        mocks: {
          $route,
          $t: key => key
        }
      })
    })

    it('fullPath equals to "/student/package/10"', () => {
      expect(Cmp.vm.nowFullPath).toEqual('/student/package/10')
    })
    it('nowPagename equals to "StudentPackage"', () => {
      expect(Cmp.vm.nowPagename).toEqual('StudentPackage')
    })
    it('activeNavType should equal to ""', () => {
      expect(Cmp.vm.activeNavType).toEqual('')
    })
    it('activeNavType should equal to "about" if pagename is "TeacherAbout"', () => {
      let fakeCmp = shallow(HeaderComp, {
        mocks: {
          $route: {
            fullPath: '/teacher/about',
            name: 'TeacherAbout'
          },
          $t: key => key
        }
      })
      expect(fakeCmp.vm.activeNavType).toEqual('about')
    })
    it('activeNavType should equal to "lessons" if pagename is "StudentCenter"', () => {
      let fakeCmp = shallow(HeaderComp, {
        mocks: {
          $route: {
            fullPath: '/student/center',
            name: 'StudentCenter'
          },
          $t: key => key
        }
      })
      expect(fakeCmp.vm.activeNavType).toEqual('lessons')
    })
    it('activeNavType should equal to "column" if pagename is "TeacherColumn"', () => {
      let fakeCmp = shallow(HeaderComp, {
        mocks: {
          $route: {
            fullPath: '/teacher',
            name: 'TeacherColumn'
          },
          $t: key => key
        }
      })
      expect(fakeCmp.vm.activeNavType).toEqual('column')
    })
    it('isTeacherPage should be false', () => {
      expect(Cmp.vm.isTeacherPage).toBe(false)
    })
    it('isStudentPage should be true', () => {
      expect(Cmp.vm.isStudentPage).toBe(true)
    })
    it('columnText be equal to "lesson.studentColumn"', () => {
      let columnText = Cmp.vm.columnText
      expect(columnText).toEqual('lesson.studentColumn')
    })
    it('statusTogglePath.path to be "/teacher/package/10"', () => {
      expect(Cmp.vm.statusTogglePath).toEqual({
        path: '/teacher/package/10'
      })
    })
    it('toggleButtonText to be "lesson.viewTeacherPage"', () => {
      expect(Cmp.vm.toggleButtonText).toEqual('lesson.viewTeacherPage')
    })
  })

  describe('test Header on teacher packageDetailPage', () => {
    const $route = {
      fullPath: '/teacher/package/10'
    }
    beforeEach(() => {
      Cmp = shallow(HeaderComp, {
        mocks: {
          $route,
          $t: key => key
        }
      })
    })

    it('fullPath equals to "/teacher/package/10"', () => {
      expect(Cmp.vm.nowFullPath).toEqual('/teacher/package/10')
    })
    it('isTeacherPage should be true', () => {
      expect(Cmp.vm.isTeacherPage).toBe(true)
    })
    it('isStudentPage should be false', () => {
      expect(Cmp.vm.isStudentPage).toBe(false)
    })
    it('columnText be equal to "lesson.teacherColumn"', () => {
      let columnText = Cmp.vm.columnText
      expect(columnText).toEqual('lesson.teacherColumn')
    })
    it('statusTogglePath.path to be "/student/package/10"', () => {
      expect(Cmp.vm.statusTogglePath).toEqual({
        path: '/student/package/10'
      })
    })
    it('toggleButtonText to be "lesson.viewStudentPage"', () => {
      expect(Cmp.vm.toggleButtonText).toEqual('lesson.viewStudentPage')
    })
  })
})
