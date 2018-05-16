import mdParse from '../mdParser/md'

export const transfer = (md, cmd) => {
  let newData = {
    styleID: 0,
    author: {
      desc: '',
      link: '',
      target: '_self',
      text: ''
    },
    desc: {
      data: ''
    },
    download: {
      link: '',
      name: '',
      target: '_self'
    },
    enter: {
      link: '',
      name: '',
      target: '_self'
    },
    innerModal: {},
    paracraftInfo: {
      link: '',
      target: '_self',
      text: ''
    },
    preview: {
      link: '',
      src: '',
      target: '_self'
    },
    size: {
      desc: '',
      link: '',
      target: '_self',
      text: ''
    },
    updateTime: {
      link: '',
      target: '_self',
      text: ''
    },
    version: {
      desc: '',
      link: '',
      target: '_self',
      text: ''
    },
    viewTimes: {
      desc: '',
      link: '',
      target: '_self',
      text: ''
    },
    viewTimesImg: {
      link: '',
      src: '',
      target: '_self'
    },
    worldName: {
      link: '',
      name: '',
      target: '_self'
    }
  }

  let oldData = {}

  if (md[0] && md.length === 1) {
    try { oldData = JSON.parse(md[0]) } catch (e) {}

    newData.worldName.name = String(oldData.link_world_name)
    newData.version.text = String(oldData.link_version)
    newData.updateTime.text = String(oldData.link_update_date)
    newData.author.text = String(oldData.link_username)
    newData.size.text = String(oldData.link_files_totals)

    return newData
  } else if (md.length > 1) {
    let mdString = md.join('\n')

    oldData = mdParse.mdToJson(mdString)

    newData.worldName.name = String(oldData.link_world_name.text)
    newData.version.text = String(oldData.link_version.text)
    newData.updateTime.text = String(oldData.link_update_date.text)
    newData.author.text = String(oldData.link_username.text)
    newData.size.text = String(oldData.link_files_totals.text)

    return newData
  } else {
    return {}
  }
}

export default { transfer }
