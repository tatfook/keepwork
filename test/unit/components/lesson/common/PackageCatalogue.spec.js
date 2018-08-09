import _ from 'lodash'
import { shallow } from 'vue-test-utils'
import PackageCatalogueComp from '@/components/lesson/common/PackageCatalogue'

describe('PackageCatalogue component test', () => {
  let cmp
  beforeEach(() => {
    cmp = shallow(PackageCatalogueComp, {
      propsData: {
        packageDetail: {
          lessons: [
            { id: 1, extra: {} }, { id: 2, extra: {} }
          ],
          'learnedLessons': [
            1
          ],
          'teachedLessons': [
            1, 2
          ]
        },
        actorType: ''
      },
      mocks: {
        $t: key => key
      }
    })
  })

  it('learnedLessons should be [1]', () => {
    expect(cmp.vm.learnedLessons).toEqual([1])
  })
  it('teachedLessons should be [2]', () => {
    expect(cmp.vm.teachedLessons).toEqual([1, 2])
  })
  it('test lessonFinishedList when actorType is teacher', () => {
    cmp.setProps({
      actorType: 'teacher'
    })
    expect(cmp.vm.lessonFinishedList).toEqual([1, 2])
  })
  it('test lessonFinishedList when actorType is student', () => {
    cmp.setProps({
      actorType: 'student'
    })
    expect(cmp.vm.lessonFinishedList).toEqual([1])
  })
  it('lessonProgressPercent should be 50 when actorType is student', () => {
    cmp.setProps({
      actorType: 'student'
    })
    expect(cmp.vm.lessonProgressPercent).toBe(50)
  })
  it('lessonProgressPercent should be 100 when actorType is teacher', () => {
    cmp.setProps({
      actorType: 'teacher'
    })
    expect(cmp.vm.lessonProgressPercent).toBe(100)
  })
  it('lessonProgressInfo should be "lesson.haveLearn 1 lesson.lessonsCount"', () => {
    cmp.setProps({
      actorType: 'student'
    })
    expect(cmp.vm.lessonProgressInfo).toBe('lesson.haveLearn1lesson.lessonsCount')
  })
  it('buttonText should be "lesson.continue" when actorType is student', () => {
    cmp.setProps({
      actorType: 'student'
    })
    expect(cmp.vm.buttonText).toBe('lesson.continue')
  })
  it('buttonText should be "lesson.finished" when actorType is teacher', () => {
    cmp.setProps({
      actorType: 'teacher'
    })
    expect(cmp.vm.buttonText).toBe('lesson.finished')
  })
  // it('buttonText should be "lesson.continue" when actorType is student', () => {
  //   cmp.setProps({
  //     actorType: 'teacher'
  //   })
  //   expect(cmp.vm.buttonText).toBe('lesson.continue')
  // })
  // it('test lessonsList result when actorType is teacher', () => {
  //   cmp.setProps({
  //     packageDetail: {
  //       actorType: 'teacher'
  //     }
  //   })
  //   expect(cmp.vm.lessonsList).toEqual([{
  //     id: 1,
  //     extra: {}
  //   },
  //   {
  //     id: 2,
  //     extra: {},
  //     finished: true
  //   }])
  // })
})
