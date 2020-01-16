const compDefaultData = {
  0: {
    type: 0,
    title: '选择题',
    remark: '',
    options: [{ value: '选项1' }, { value: '选项2' }],
    isRequired: true,
  },
  2: {
    type: 2,
    title: '问答题',
    remark: '',
    options: [],
    isRequired: true,
  },
  3: {
    type: 3,
    content: '文本',
  },
  4: {
    type: 4,
    fileType: undefined,
    url: undefined,
    filename: undefined,
  },
}

export const getDefaultDataByType = function({ type, fileType, url, filename }) {
  let data = compDefaultData[type]
  if (type === 4) {
    data = {
      ...data,
      fileType,
      url,
      filename,
    }
  }
  return data
}

export default { getDefaultDataByType }
