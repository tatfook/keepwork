// add global variables here

const gClasses = {
  compActive: 'comp-active',
  compHover: 'comp-hover',
  modActive: 'mod-active',
  modHover: 'mod-hover'
}

const gThemeData = {
  'mod-full-width': '1080px',
  'mod-full-max-width': '100%',
  'mod-space-computer': '60px',
  'mod-space-mobile': '45px'
}

const gTheme = {
  '@media only screen and (min-width: 1080px)': {
    'mod-full-width': {
      maxWidth: gThemeData['mod-full-max-width'],
      width: gThemeData['mod-full-width'],
      margin: 'auto'
    },
    'mod-space': {
      'padding-top': gThemeData['mod-space-computer'],
      'padding-bottom': gThemeData['mod-space-computer']
    }
  },
  '@media only screen and (max-width: 1079px)': {
    'mod-full-width': {
      padding: '0 20px'
    },
    'mod-space': {
      'padding-top': gThemeData['mod-space-mobile'],
      'padding-bottom': gThemeData['mod-space-mobile']
    }
  }
}

const gConst = {
  GIT_FILE_UPLOAD_MAX_SIZE: 1024 * 1024 * 10, // 10M
  POSITION_BEFORE: 'before',
  POSITION_AFTER: 'after',
  ADDING_AREA_ADI: 'ADI',
  ADDING_AREA_MARKDOWN: 'Markdown'
}

module.exports = {
  gClasses,
  gThemeData,
  gTheme,
  gConst
}
