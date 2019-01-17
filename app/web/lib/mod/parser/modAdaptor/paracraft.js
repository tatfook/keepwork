const mdParse = require('../mdParser/md')

const transfer = (md, cmd) => {
  let newData = {
    styleID: 0,
    author: {
      desc: '',
      link: '',
      target: '',
      text: ''
    },
    desc: {
      data: ''
    },
    download: {
      link: '',
      name: '',
      target: ''
    },
    enter: {
      link: '',
      name: '',
      target: ''
    },
    innerModal: {},
    paracraftInfo: {
      link: '',
      target: '',
      text: ''
    },
    preview: {
      link: '',
      src: '',
      target: ''
    },
    size: {
      desc: '',
      link: '',
      target: '',
      text: ''
    },
    updateTime: {
      link: '',
      target: '',
      text: ''
    },
    version: {
      desc: '',
      link: '',
      target: '',
      text: ''
    },
    viewTimes: {
      desc: '',
      link: '',
      target: '',
      text: ''
    },
    viewTimesImg: {
      link: '',
      src: '',
      target: ''
    },
    worldName: {
      link: '',
      name: '',
      target: ''
    }
  }

  let oldData = {}

  if (cmd === 'paracraft') {
    if (md[0] && md.length === 1) {
      try {
        oldData = JSON.parse(md[0])
      } catch (e) {
        console.error(e)
      }

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
      } catch (error) {
        console.error(error)
      }

      if (oldData) {
        newData.worldName.name = String(oldData.worldName)
        newData.updateTime.text = String(oldData.updateDate)
        newData.version.text = String(oldData.version)
        newData.author.text = String(oldData.username)
        newData.size.text = String(oldData.filesTotals)
        newData.download.link = String(oldData.worldUrl)
        newData.preview.src = previewUrl.previewUrl
      }
    }

    return newData
  } else {
    return {}
  }
}

module.exports = { transfer }
