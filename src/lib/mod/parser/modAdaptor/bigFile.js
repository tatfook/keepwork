export const transfer = (md, cmd) => {
  let mdString = md.join('\n')
  let data

  try {
    data = JSON.parse(mdString)
  } catch (error) {}

  if (data) {
    return {bigFile: data}
  } else {
    return {}
  }
}

export default { transfer }
