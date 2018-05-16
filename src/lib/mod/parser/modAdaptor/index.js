import Board from './board'
import Paracraft from './paracraft'

const parsers = {
  Board,
  Paracraft
}

const transfer = (md, cmd, targetCmd) => {
  const parser = parsers[targetCmd]
  if (parser) return parser.transfer(md, cmd)
}

export default { transfer }
