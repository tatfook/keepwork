export const transfer = (md, cmd) => {
  let newData = {
    board: {
      data: ''
    }
  }

  if (md[0]) {
    newData.board.data = md[0]
    return newData
  } else {
    return {}
  }
}

export default { transfer }
