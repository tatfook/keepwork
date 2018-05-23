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

  if (cmd === 'paracraft') {
    if (md[0] && md.length === 1) {
      try {
        oldData = JSON.parse(md[0])
      } catch (e) {}

      newData.worldName.name = String(oldData.link_world_name || '')
      newData.version.text = String(oldData.link_version || '')
      newData.updateTime.text = String(oldData.link_update_date || '')
      newData.author.text = String(oldData.link_username || '')
      newData.size.text = String(oldData.link_files_totals || '')
      newData.download.link = String(oldData.link_world_url || '')
      newData.enter.link = String(oldData.link_world_url || '')
      newData.preview.src = String(oldData.media_logo || '')
      newData.paracraftInfo.desc_info = String(
        (oldData.paracraft_info && oldData.paracraft_info.desc_info) || ''
      )
      newData.paracraftInfo.download_info = String(
        (oldData.paracraft_info && oldData.paracraft_info.desc_download) || ''
      )

      return newData
    } else if (md.length > 1) {
      let mdString = md.join('\n')

      oldData = mdParse.mdToJson(mdString)

      newData.worldName.name = String(oldData.link_world_name.text || '')
      newData.version.text = String(oldData.link_version.text || '')
      newData.updateTime.text = String(oldData.link_update_date.text || '')
      newData.author.text = String(oldData.link_username.text || '')
      newData.size.text = String(oldData.link_files_totals.text || '')
      newData.download.link = String(oldData.link_world_url.text || '')
      newData.enter.link = String(oldData.link_world_url.text || '')
      newData.preview.src = String(oldData.media_logo.text || '')
      newData.paracraftInfo.desc_info = String(
        (oldData.paracraft_info && oldData.paracraft_info.desc_info) || ''
      )
      newData.paracraftInfo.download_info = String(
        (oldData.paracraft_info && oldData.paracraft_info.desc_download) || ''
      )

      return newData
    } else {
      return {}
    }
  } else if (cmd === 'wiki/js/world3D') {
    if (md[0]) {
      let previewUrl = ''

      try {
        oldData = JSON.parse(md[0])
        previewUrl = JSON.parse(oldData.logoUrl)[0]
      } catch (error) {}

      if (oldData) {
        newData.worldName.name = String(oldData.worldName)
        newData.updateTime.text = String(oldData.updateDate)
        newData.version.text = String(oldData.version)
        newData.author.text = String(oldData.username)
        newData.size.text = String(oldData.filesTotals)
        newData.download.link = String(oldData.worldUrl)
        newData.preview.src = previewUrl['previewUrl']
      }
    }

    return newData
  } else {
    return {}
  }
}

export default { transfer }
