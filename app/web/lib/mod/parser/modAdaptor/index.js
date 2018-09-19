import Board from './board'
import Paracraft from './paracraft'
import BigFile from './bigFile'

const parsers = {
  Board,
  Paracraft,
  BigFile
}

const transfer = (md, cmd, targetCmd) => {
  const parser = parsers[targetCmd]
  if (parser) return parser.transfer(md, cmd)
}

export default { transfer }
