import _ from 'lodash'
import Parser from '@/lib/mod/parser'
import BlockHelper from '@/lib/mod/parser/blockHelper'

describe('mod parser', () => {
  const code = '\nhello\n```@Img\n```\n\n```@Title\n```\nworld\nwelcome\nto\nkeepwork\n'
  const oldBlockList = Parser.buildBlockList(code)
  let blockList
  beforeEach(() => {
    blockList = _.cloneDeep(oldBlockList)
  })

  describe('#buildBlockList', () => {
    test('sample code', () => {
      expect(code.split('\n').length).toEqual(12)
      expect(blockList.length).toEqual(4)
      expect(blockList[0].lineBegin).toEqual(1)
      expect(blockList[1].lineBegin).toEqual(3)
      expect(blockList[2].lineBegin).toEqual(6)
      expect(blockList[3].lineBegin).toEqual(8)
      expect(blockList[0].modType).toEqual('ModMarkdown')
      expect(blockList[1].modType).toEqual('ModImg')
      expect(blockList[2].modType).toEqual('ModTitle')
      expect(blockList[3].modType).toEqual('ModMarkdown')
    })
    test('empty code', () => {
      const newBlockList = Parser.buildBlockList('')
      expect(newBlockList.length).toEqual(0)
    })
    test('code only contains \n', () => {
      const newBlockList = Parser.buildBlockList('\n\n\n')
      expect(newBlockList.length).toEqual(1)
    })
    test('non-empty code', () => {
      const newBlockList = Parser.buildBlockList('\n hello \n world \n')
      expect(newBlockList.length).toEqual(1)
    })
    test('mod list include different mods', () => {
      const newBlockList = Parser.buildBlockList('\n hello \n```@Title\n```\n')
      expect(newBlockList.length).toEqual(2)
    })
    test('begin line', () => {
      const newBlockList = Parser.buildBlockList('\n hello \n world \n')
      expect(newBlockList[0].lineBegin).toEqual(1)
    })
    test('should avoid the invalid mod cmd', () => {
      const newBlockList = Parser.buildBlockList('\n hello \n```@AreYouKiddingMe\n```\n')
      expect(newBlockList.length).toEqual(1)
    })
    test('should parse the old version cmd', () => {
      const newBlockList = Parser.buildBlockList('\n hello \n```@board/main\n```\n')
      expect(newBlockList.length).toEqual(2)
      expect(newBlockList[1].modType).toEqual('ModBoard')
    })
    test('should parse the irregular cmd', () => {
      let newBlockList = Parser.buildBlockList('\n hello \n```@bOArd\n```\n')
      expect(newBlockList.length).toEqual(2)
      expect(newBlockList[1].modType).toEqual('ModBoard')
      newBlockList = Parser.buildBlockList('\n hello \n```@pARacraft\n```\n')
      expect(newBlockList.length).toEqual(2)
      expect(newBlockList[1].modType).toEqual('ModParacraft')
    })
    test('should not parse the irregular cmd with old version', () => {
      let newBlockList = Parser.buildBlockList('\n hello \n```@boArd/MaIn\n```\n')
      expect(newBlockList.length).toEqual(1)
      newBlockList = Parser.buildBlockList('\n hello \n```@wiki/js/WOrld3D\n```\n')
      expect(newBlockList.length).toEqual(1)
    })
    test('old paracraft mod', () => {
      const newBlockList = Parser.buildBlockList('\n hello \n```@paracraft\n```\n```@wiki/js/world3D\n```\n')
      expect(newBlockList.length).toEqual(3)
      expect(newBlockList[1].modType).toEqual('ModParacraft')
      expect(newBlockList[2].modType).toEqual('ModParacraft')
    })
  })

  describe('#buildMarkdown', () => {
    test('will keep the previous empty lines', () => {
      const newCode = '\n\nhello\n```@Img\n```\n```@Title\n```\nworld\n'
      const newBlockList = Parser.updateBlockList(blockList, Parser.buildBlockList(newCode))
      expect(newBlockList[0].lineBegin).toEqual(1)
      expect(Parser.buildMarkdown(newBlockList)).toMatch(newCode)
    })
    test('will remove the ending empty lines if the last mod is not markdown mod', () => {
      const newCode = '\n\nhello\n```@Img\n```\n```@Title\n```\n\n\n'
      const newBlockList = Parser.updateBlockList(blockList, Parser.buildBlockList(newCode))
      expect(newBlockList[0].lineBegin).toEqual(1)
      expect(Parser.buildMarkdown(newBlockList)).not.toEqual(newCode)
    })
    test('will keep the empty lines between mods', () => {
      const newCode = '\n\nhello\n```@Img\n```\n\n\n```@Title\n```\nworld\n'
      const newBlockList = Parser.updateBlockList(blockList, Parser.buildBlockList(newCode))
      expect(newBlockList[0].lineBegin).toEqual(1)
      expect(Parser.buildMarkdown(newBlockList)).toEqual(newCode)
    })
  })

  describe('#updateBlockList', () => {
    test('insert mod at the beginning', () => {
      const newCode = '```@Menu\n```\n\nhello\n```@Img\n```\n```@Title\n```\nworld\n'
      const newBlockList = Parser.updateBlockList(blockList, Parser.buildBlockList(newCode))
      expect(newBlockList[1].key).toEqual(oldBlockList[0].key)
      expect(newBlockList[2].key).toEqual(oldBlockList[1].key)
      expect(newBlockList[1].lineBegin).toEqual(oldBlockList[0].lineBegin + 2)
      expect(newBlockList[2].lineBegin).toEqual(oldBlockList[1].lineBegin + 2)
    })
    test('insert mod into the middle', () => {
      const newCode = '\nhello\n```@Img\n```\n```@Menu\n```\n\n```@Title\n```\nworld\n'
      const newBlockList = Parser.updateBlockList(blockList, Parser.buildBlockList(newCode))
      expect(newBlockList[0].key).toEqual(oldBlockList[0].key)
      expect(newBlockList[3].key).toEqual(oldBlockList[2].key)
      expect(newBlockList[0].lineBegin).toEqual(oldBlockList[0].lineBegin)
      expect(newBlockList[3].lineBegin).toEqual(oldBlockList[2].lineBegin + 2)
    })
    test('insert mod to the end', () => {
      const newCode = '\nhello\n```@Img\n```\n```@Title\n```\nworld\n```@Menu\n```\n'
      const newBlockList = Parser.updateBlockList(blockList, Parser.buildBlockList(newCode))
      expect(newBlockList[0].key).toEqual(oldBlockList[0].key)
      expect(newBlockList[1].key).toEqual(oldBlockList[1].key)
      expect(newBlockList[0].lineBegin).toEqual(oldBlockList[0].lineBegin)
      expect(newBlockList[1].lineBegin).toEqual(oldBlockList[1].lineBegin)
    })
    test('copy and paste to rearange mod order', () => {
      const newCode = '\nhello\n```@Title\n```\n```@Img\n```\nworld\n'
      const newBlockList = Parser.updateBlockList(blockList, Parser.buildBlockList(newCode))
      expect(newBlockList[1].key).toEqual(oldBlockList[2].key)
      expect(newBlockList[2].key).toEqual(oldBlockList[1].key)
    })
    test('copy and paste to rearange and update mods', () => {
      const newCode = '\nhello\n```@Title\n```\nabc world\n```@Img\n```\n'
      const newBlockList = Parser.updateBlockList(blockList, Parser.buildBlockList(newCode))
      expect(newBlockList[2].uuid).toEqual(oldBlockList[3].uuid)
      expect(newBlockList[1].key).toEqual(oldBlockList[2].key)
      expect(newBlockList[3].key).toEqual(oldBlockList[1].key)
    })
  })

  describe('#willAffectModData', () => {
    const markdownBlock = oldBlockList[0]
    const generalMod = oldBlockList[1]
    test('no cmd info', () => {
      const mdLines = 'hello\n world\n'.split('\n')
      expect(Parser.willAffectModData(markdownBlock, mdLines)).toEqual(false)
      expect(Parser.willAffectModData(generalMod, mdLines)).toEqual(false)
    })
    test('include fake cmd info', () => {
      const mdLines = 'hello\n```@AreYouKiddingMe\n'.split('\n')
      expect(Parser.willAffectModData(markdownBlock, mdLines)).toEqual(false)
      expect(Parser.willAffectModData(generalMod, mdLines)).toEqual(false)
    })
    test('include real cmd info', () => {
      const mdLines = 'hello\n```@Title\n'.split('\n')
      expect(Parser.willAffectModData(markdownBlock, mdLines)).toEqual(true)
      expect(Parser.willAffectModData(generalMod, mdLines)).toEqual(true)
    })
    test('include cmd ending', () => {
      const mdLines = 'hello\n```\n'.split('\n')
      expect(Parser.willAffectModData(markdownBlock, mdLines)).toEqual(false)
      expect(Parser.willAffectModData(generalMod, mdLines)).toEqual(true)
    })
  })

  describe('#updateBlockCode', () => {
    test('update general mod code', () => {
      const newCode = '\nhello\n```@Img\nstyle: 0\n```\n```@Title\n```\nworld\n'
      const newBlock = Parser.updateBlockCode(blockList, blockList[1].key, newCode)
      expect(blockList[2].lineBegin).toEqual(oldBlockList[2].lineBegin + 1)
      expect(newBlock.lengthDiff).toEqual(1)
    })

    test('update markdown code', () => {
      const newCode = '\nhello\nheyyo\n```@Img\n```\n```@Title\n```\nworld\n'
      const newBlock = Parser.updateBlockCode(blockList, blockList[0].key, newCode)
      expect(blockList[1].lineBegin).toEqual(oldBlockList[1].lineBegin + 1)
      expect(newBlock.lengthDiff).toEqual(1)
    })
  })

  describe('#updateBlockAttribute', () => {
    test('set new attribute', () => {
      let generalMod = oldBlockList[1]
      // yaml parser will always add an empty line in the end of code
      generalMod = Parser.updateBlockAttribute(blockList, generalMod.key, 'style', 0)
      expect(generalMod.lengthDiff).toEqual(2)
      expect(blockList[2].lineBegin).toEqual(oldBlockList[2].lineBegin + 2)
      generalMod = Parser.updateBlockAttribute(blockList, generalMod.key, 'src', 'keepwork.com')
      expect(generalMod.lengthDiff).toEqual(1)
    })
    test('update attribute', () => {
      let generalMod = oldBlockList[1]
      generalMod = Parser.updateBlockAttribute(blockList, generalMod.key, 'style', 0)
      generalMod = Parser.updateBlockAttribute(blockList, generalMod.key, 'style', 1)
      expect(generalMod.lengthDiff).toEqual(0)
    })
  })

  describe('#deleteBlock', () => {
    test('delete a general block', () => {
      let generalMod = oldBlockList[1]
      Parser.deleteBlock(blockList, generalMod.key)
      expect(blockList.length).toEqual(oldBlockList.length - 1)
      expect(blockList[1].lineBegin).not.toEqual(oldBlockList[2].lineBegin)
    })
    test('delete a markdown block', () => {
      let markdownMod = oldBlockList[0]
      Parser.deleteBlock(blockList, markdownMod.key)
      expect(blockList.length).toEqual(oldBlockList.length - 1)
      expect(blockList[1].lineBegin).not.toEqual(oldBlockList[2].lineBegin)
    })
    test('delete a general mod which is in the middle of two markdown mod', () => {
      const newCode = '\nhello\n```@Img\n```\nworld\n'
      let newBlockList = Parser.updateBlockList(blockList, Parser.buildBlockList(newCode))
      expect(newBlockList[0].md.length).toEqual(2)
      Parser.deleteBlock(newBlockList, newBlockList[1].key)
      expect(newBlockList.length).toEqual(1)
      expect(newBlockList[0].md.length).toEqual(4)
    })
  })

  describe('#moveBlock', () => {
    test('general moving', () => {
      Parser.moveBlock(blockList, 2, 3)
      expect(blockList.length).toEqual(oldBlockList.length)
      expect(blockList[3].lineBegin).not.toEqual(oldBlockList[2].lineBegin)
    })

    test('moving with markdown merging', () => {
      Parser.moveBlock(blockList, 0, 2)
      expect(blockList.length).toEqual(oldBlockList.length - 1)
      expect(blockList[1].lineBegin).not.toEqual(oldBlockList[0].lineBegin)
    })
  })

  describe('#addBlockAfterIndex', () => {
    test('add general mod after markdown mod', () => {
      let newBlock = Parser.buildBlock('Title')
      newBlock = Parser.addBlockAfterIndex(blockList, 0, newBlock)
      expect(blockList.length).toEqual(oldBlockList.length + 1)
      expect(newBlock.lineBegin).toBeGreaterThan(blockList[0].lineBegin)
      expect(newBlock.lineBegin).toEqual(BlockHelper.endLine(blockList[0]))
    })

    test('add general mod after general mod', () => {
      let newBlock = Parser.buildBlock('Title')
      newBlock = Parser.addBlockAfterIndex(blockList, 1, newBlock)
      expect(blockList.length).toEqual(oldBlockList.length + 1)
      expect(newBlock.lineBegin).toBeGreaterThan(blockList[1].lineBegin)
      expect(newBlock.lineBegin).toEqual(BlockHelper.endLine(blockList[1]) + 1)
    })

    test('add markdown mod before or after markdown mod', () => {
      let newBlock = Parser.buildBlock('Markdown', {md: {data: ''}})
      Parser.addBlockAfterIndex(blockList, 0, newBlock)
      expect(blockList.length).toEqual(oldBlockList.length)
      expect(blockList[0].md).not.toEqual(oldBlockList[0].md)
      expect(blockList[0].key).not.toEqual(oldBlockList[0].key)
      expect(blockList[1].key).toEqual(oldBlockList[1].key)
      Parser.addBlockAfterIndex(blockList, -1, newBlock)
      expect(blockList.length).toEqual(oldBlockList.length)
      expect(blockList[0].md).not.toEqual(oldBlockList[0].md)
      expect(blockList[0].key).not.toEqual(oldBlockList[0].key)
      expect(blockList[1].key).toEqual(oldBlockList[1].key)
    })
  })

  describe('#addBlockByKey', () => {
    test('add general mod after markdown mod', () => {
      let newBlock = Parser.buildBlock('Title')
      newBlock = Parser.addBlockByKey(blockList, blockList[0].key, newBlock)
      expect(blockList.length).toEqual(oldBlockList.length + 1)
      expect(newBlock.lineBegin).toBeGreaterThan(blockList[0].lineBegin)
      expect(newBlock.lineBegin).toEqual(BlockHelper.endLine(blockList[0]))
    })

    test('add general mod after general mod', () => {
      let newBlock = Parser.buildBlock('Title')
      newBlock = Parser.addBlockByKey(blockList, blockList[1].key, newBlock)
      expect(blockList.length).toEqual(oldBlockList.length + 1)
      expect(newBlock.lineBegin).toBeGreaterThan(blockList[1].lineBegin)
      expect(newBlock.lineBegin).toEqual(BlockHelper.endLine(blockList[1]) + 1)
    })

    test('add markdown mod before or after markdown mod', () => {
      let newBlock = Parser.buildBlock('Markdown', {md: {data: ''}})
      Parser.addBlockByKey(blockList, blockList[0].key, newBlock)
      expect(blockList.length).toEqual(oldBlockList.length)
      expect(blockList[0].md).not.toEqual(oldBlockList[0].md)
      expect(blockList[0].key).not.toEqual(oldBlockList[0].key)
      expect(blockList[1].key).toEqual(oldBlockList[1].key)
      Parser.addBlockByKey(blockList, null, newBlock)
      expect(blockList.length).toEqual(oldBlockList.length)
      expect(blockList[0].md).not.toEqual(oldBlockList[0].md)
      expect(blockList[0].key).not.toEqual(oldBlockList[0].key)
      expect(blockList[1].key).toEqual(oldBlockList[1].key)
    })
  })

  describe('#addBlockToMarkdown', () => {
    test('add mod inside markdown mod', () => {
      let newCode = Parser.addBlockToMarkdown(code, 8, 'ModTitle', 1)
      expect(newCode).toContain('styleID')
      const newBlockList = Parser.buildBlockList(newCode)
      expect(newBlockList.length).toBeGreaterThan(oldBlockList.length)
      expect(newBlockList.length).toEqual(6)
      expect(newBlockList[4].modType).toEqual('ModTitle')
      expect(newBlockList[4].data.styleID).toEqual(1)
    })

    test('add mod inside markdown mod without styleID', () => {
      let newCode = Parser.addBlockToMarkdown(code, 8, 'ModTitle')
      expect(newCode).not.toContain('styleID')
      const newBlockList = Parser.buildBlockList(newCode)
      expect(newBlockList.length).toBeGreaterThan(oldBlockList.length)
      expect(newBlockList.length).toEqual(6)
      expect(newBlockList[4].modType).toEqual('ModTitle')
      expect(newBlockList[4].data.styleID).toBeUndefined()
    })

    test('should not add markdown mod', () => {
      let newCode = Parser.addBlockToMarkdown(code, 8, 'ModMarkdown')
      expect(newCode).toEqual(code)
    })
  })

  describe('#getCmd', () => {
    test('valid cmd', () => {
      expect(Parser.getCmd('ModTitle')).toEqual('Title')
    })
    test('invalid cmd', () => {
      expect(Parser.getCmd('ModKiddingMe')).toEqual('')
    })
  })

  describe('#getActiveBlock', () => {
    test('cursor inside a mod', () => {
      expect(Parser.getActiveBlock(blockList, 2)).not.toBeUndefined()
    })
    test('cursor outside a mod', () => {
      expect(Parser.getActiveBlock(blockList, 5)).toBeUndefined()
    })
    test('cursor point to the cmd line', () => {
      expect(Parser.getActiveBlock(blockList, 3)).toBeUndefined()
    })
  })
})
