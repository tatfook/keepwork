import QuizzesContent from '@/components/org/common/QuizzesContent'
import { shallow, createLocalVue } from 'vue-test-utils'
import { Checkbox, CheckboxGroup } from 'element-ui'

const localVue = createLocalVue()
localVue.use(Checkbox)
localVue.use(CheckboxGroup)
const createWrapper = ({
  originQuizzes = [],
  isAnswerMode,
  isEditMode,
  formQuizzes
}) => {
  return shallow(QuizzesContent, {
    propsData: { originQuizzes, isAnswerMode, isEditMode },
    computed: {
      formQuizzes: () => formQuizzes
    },
    stubs: {
      'el-checkbox': Checkbox,
      'el-checkbox-group': CheckboxGroup
    },
    mocks: {
      $store: {
        getters: {
          'org/getOrgDetailByLoginUrl': jest.fn(),
          'org/getFormDetailById': jest.fn()
        },
        dispatch: jest.fn(),
        actions: {
          'org/getOrgDetailByLoginUrl': jest.fn(),
          'org/submitForm': jest.fn()
        }
      }
    }
  })
}

describe('QuizzesContent comp test when is answer mode', () => {
  let wrapper

  beforeEach(() => {
    wrapper = createWrapper({
      isEditMode: false,
      isAnswerMode: true,
      formQuizzes: [
        {
          type: 1,
          options: [
            { value: 'answer1' },
            { value: 'answer2' },
            { value: 'answer3' },
            { value: 'answer4' }
          ]
        }
      ]
    })
  })
  it.only('quiz answer should be ["answer2"] if select "answer2"', () => {
    const checkboxArr = wrapper.findAll('.el-checkbox__original')
    const answer2Dom = checkboxArr.at(1)
    answer2Dom.trigger('click')
    answer2Dom.trigger('change')
    expect(wrapper.vm.quizzes[0].answer).toEqual(['answer2'])
  })
})
