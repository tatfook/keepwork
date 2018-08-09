import { shallow } from 'vue-test-utils'
import PackageCatalogueComp from '@/components/lesson/common/PackageCatalogue'

describe('PackageCatalogue component test', () => {
  let cmp
  const LessonCoverUrlSelector = '.package-catalogue-item-cover'
  const LessonTitleSelector = '.package-catalogue-item-title'
  const ViewSummaryBtnSelector = '.package-catalogue-item-button'
  const ContinueToLearnBtnSelector = '.package-catalogue-progress-button'
  const ToLessonDetailFn = jest.fn()
  const ToViewSummaryFn = jest.fn()
  const ContinueToLearnFn = jest.fn()
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

  describe('test PackageCatalogue computed data', () => {
    it('learnedLessons should be [1]', () => {
      expect(cmp.vm.learnedLessons).toEqual([1])
    })
    it('teachedLessons should be [2]', () => {
      expect(cmp.vm.teachedLessons).toEqual([1, 2])
    })

    describe('test actorType of teacher', () => {
      beforeEach(() => {
        cmp.setProps({
          actorType: 'teacher'
        })
      })

      it('test lessonsList result when actorType is teacher', () => {
        expect(cmp.vm.lessonsList).toEqual([{
          id: 1,
          extra: {},
          isFinished: true
        },
        {
          id: 2,
          extra: {},
          isFinished: true
        }])
      })
      it('test lessonFinishedList when actorType is teacher', () => {
        expect(cmp.vm.lessonFinishedList).toEqual([1, 2])
      })
      it('lessonProgressPercent should be 100 when actorType is teacher', () => {
        expect(cmp.vm.lessonProgressPercent).toBe(100)
      })
      it('buttonText should be "lesson.finished" when actorType is teacher', () => {
        expect(cmp.vm.buttonText).toBe('lesson.finished')
      })
      it('isTeacher should be true if actorType is teacher', () => {
        expect(cmp.vm.isTeacher).toBe(true)
      })
    })

    describe('test actorType of student', () => {
      beforeEach(() => {
        cmp.setProps({
          actorType: 'student'
        })
      })

      it('test lessonsList result when actorType is student', () => {
        expect(cmp.vm.lessonsList).toEqual([{
          id: 1,
          extra: {},
          isFinished: true
        },
        {
          id: 2,
          extra: {}
        }])
      })
      it('test continueLearnedLesson', () => {
        expect(cmp.vm.continueLearnedLesson).toEqual({
          id: 2,
          extra: {}
        })
      })
      it('test lessonFinishedList when actorType is student', () => {
        expect(cmp.vm.lessonFinishedList).toEqual([1])
      })
      it('lessonProgressPercent should be 50 when actorType is student', () => {
        expect(cmp.vm.lessonProgressPercent).toBe(50)
      })
      it('lessonProgressInfo should be "lesson.haveLearn 1 lesson.lessonsCount"', () => {
        expect(cmp.vm.lessonProgressInfo).toBe('lesson.haveLearn1lesson.lessonsCount')
      })
      it('buttonText should be "lesson.continue" when actorType is student', () => {
        expect(cmp.vm.buttonText).toBe('lesson.continue')
      })
      it('isTeacher should be false if actorType is student', () => {
        expect(cmp.vm.isTeacher).toBe(false)
      })
    })
  })

  describe('test PackageCatalogue event', () => {
    it('toLessonDetail should be called if lesson coverUrl clicked', () => {
      expect(cmp.contains(LessonCoverUrlSelector)).toBe(true)

      let triggerObj = cmp.find(LessonCoverUrlSelector)
      cmp.setMethods({
        toLessonDetail: ToLessonDetailFn
      })
      triggerObj.trigger('click')
      expect(ToLessonDetailFn).toBeCalled()
    })
    it('toLessonDetail should be called if lesson title clicked', () => {
      expect(cmp.contains(LessonTitleSelector)).toBe(true)

      let triggerObj = cmp.find(LessonTitleSelector)
      cmp.setMethods({
        toLessonDetail: ToLessonDetailFn
      })
      triggerObj.trigger('click')
      expect(ToLessonDetailFn).toBeCalled()
    })
    it('toViewSummary should be called if toViewSummaryButton clicked', () => {
      expect(cmp.contains(ViewSummaryBtnSelector)).toBe(true)

      let triggerObj = cmp.find(ViewSummaryBtnSelector)
      cmp.setMethods({
        toViewSummary: ToViewSummaryFn
      })
      triggerObj.trigger('click')
      expect(ToViewSummaryFn).toBeCalled()
    })
    it('continueToLearn should be called if toViewSummaryButton clicked', () => {
      expect(cmp.contains(ContinueToLearnBtnSelector)).toBe(true)

      let triggerObj = cmp.find(ContinueToLearnBtnSelector)
      cmp.setMethods({
        continueToLearn: ContinueToLearnFn
      })
      triggerObj.trigger('click')
      expect(ContinueToLearnFn).toBeCalled()
    })
  })
})
