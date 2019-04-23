const IEVersion = userAgent => {
  let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1
  let isEdge = userAgent.indexOf('Edge') > -1 && !isIE
  let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    let fIEVersion = Number(parseFloat(RegExp['$1']))
    if (fIEVersion === 7) {
      return 7
    } else if (fIEVersion === 8) {
      return 8
    } else if (fIEVersion === 9) {
      return 9
    } else if (fIEVersion === 10) {
      return 10
    } else {
      return 6// IE版本<=7
    }
  } else if (isEdge) {
    return -1
  } else if (isIE11) {
    return 11 // IE11
  } else {
    return -1// 不是ie浏览器
  }
}

module.exports = options => async (ctx, next) => {
  const userAgent = ctx.request.header['user-agent']
  const version = IEVersion(userAgent)
  if (version !== -1 && version < 10) {
    return await ctx.render('ie/index.js')
  }
  await next()
}
