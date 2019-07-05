export default [
  {
    id: 1,
    parentId: 0,
    name: '建筑',
    pBlockClassifies: []
  },
  {
    id: 2,
    parentId: 1,
    name: '房子',
    pBlockClassifies: [
      {
        blockId: 2 // 元件ID
      }
    ]
  },
  {
    id: 3,
    parentId: 1,
    name: '高塔',
    pBlockClassifies: [
      {
        blockId: 1 // 元件ID
      }
    ]
  },
  {
    id: 4,
    parentId: 1,
    name: '大厦',
    pBlockClassifies: [
      {
        blockId: 2 // 元件ID
      }
    ]
  },
  {
    id: 5,
    parentId: 0,
    name: '家居',
    pBlockClassifies: []
  },
  {
    id: 6,
    parentId: 5,
    name: '桌子',
    pBlockClassifies: [
      {
        blockId: 2 // 元件ID
      }
    ]
  },
  {
    id: 7,
    parentId: 5,
    name: '椅子',
    pBlockClassifies: [
      {
        blockId: 1 // 元件ID
      }
    ]
  },
  {
    id: 8,
    parentId: 0,
    name: '植物',
    pBlockClassifies: []
  },
  {
    id: 9,
    parentId: 8,
    name: '树',
    pBlockClassifies: [
      {
        blockId: 2 // 元件ID
      }
    ]
  },
  {
    id: 10,
    parentId: 8,
    name: '草',
    pBlockClassifies: [
      {
        blockId: 1 // 元件ID
      }
    ]
  }
]
