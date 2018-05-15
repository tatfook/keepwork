import board from './board'
import paracraft from './paracraft'

const parsers = {
  board,
  paracraft
}

const transfer = (md, cmd, targetCmd) => {
  const parser = parsers[targetCmd]
  if (parser) return parser.transfer(md, cmd)
}

export default transfer
