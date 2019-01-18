const Board = require('./board')
const Paracraft = require('./paracraft')
const BigFile = require('./bigFile')

const parsers = {
  Board,
  Paracraft,
  BigFile
}

const transfer = (md, cmd, targetCmd) => {
  const parser = parsers[targetCmd]
  if (parser) return parser.transfer(md, cmd)
}

module.exports = { transfer }
