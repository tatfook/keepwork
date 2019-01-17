const transfer = (md, cmd) => {
  let mdString = md.join('\n')
  let data

  try {
    data = JSON.parse(mdString)
  } catch (error) {
    console.error(error)
  }

  if (data) {
    return { bigFile: data }
  } else {
    return {}
  }
}

module.exports = { transfer }
