export default {
  title: '《Paracraft 3D动画与编程班》报名表',
  description: '请填写您的报名信息',
  quizzes: [
    { type: 2, isRequired: true, title: '姓名', remark: '', options: [] },
    {
      type: 2,
      isRequired: true,
      title: '所在班级',
      remark: '例如，3年级1班',
      options: []
    },
    {
      type: 0,
      isRequired: true,
      title: '请选择报名班级',
      remark: '',
      options: [{ value: '编剧班（2-3年级）' }, { value: '编程班（2-6年级）' }]
    },
    {
      type: 0,
      isRequired: true,
      title: '每周五放学后16:00 - 18:00是否有时间学习？',
      remark: '',
      options: [{ value: '是，有时间' }, { value: '否，没有时间' }]
    },
    {
      type: 2,
      isRequired: false,
      title: '是否有写作获奖经历或者编程学习经历？',
      remark:
        '如果有写作获奖经历或者编程学习经历，请做个简单的自我介绍，“无”则不填写',
      options: [],
      index: 4
    },
    {
      type: 2,
      isRequired: false,
      title: '家长联系方式',
      remark: '请家长输入手机号码，方便学校联系沟通',
      options: [],
      index: 5
    },
    {
      type: 2,
      isRequired: false,
      title: '请提交您使用Paracraft创作的作品项目ID',
      remark: '如有多个，请使用逗号隔开',
      options: [],
      index: 6
    }
  ]
}
