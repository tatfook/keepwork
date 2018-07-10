/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 *
 * Class: MxUrlConverter
 *
 * Converts relative and absolute URLs to absolute URLs with protocol and domain.
 */
export default class MxUrlConverter {
  // Empty constructor
}

/**
 * Variable: enabled
 *
 * Specifies if the converter is enabled. Default is true.
 */
MxUrlConverter.prototype.enabled = true

/**
 * Variable: baseUrl
 *
 * Specifies the base URL to be used as a prefix for relative URLs.
 */
MxUrlConverter.prototype.baseUrl = null

/**
 * Variable: baseDomain
 *
 * Specifies the base domain to be used as a prefix for absolute URLs.
 */
MxUrlConverter.prototype.baseDomain = null

/**
 * Function: updateBaseUrl
 *
 * Private helper function to update the base URL.
 */
MxUrlConverter.prototype.updateBaseUrl = function() {
  this.baseDomain = location.protocol + '//' + location.host
  this.baseUrl = this.baseDomain + location.pathname
  let tmp = this.baseUrl.lastIndexOf('/')

  // Strips filename etc
  if (tmp > 0) {
    this.baseUrl = this.baseUrl.substring(0, tmp + 1)
  }
}

/**
 * Function: isEnabled
 *
 * Returns <enabled>.
 */
MxUrlConverter.prototype.isEnabled = function() {
  return this.enabled
}

/**
 * Function: setEnabled
 *
 * Sets <enabled>.
 */
MxUrlConverter.prototype.setEnabled = function(value) {
  this.enabled = value
}

/**
 * Function: getBaseUrl
 *
 * Returns <baseUrl>.
 */
MxUrlConverter.prototype.getBaseUrl = function() {
  return this.baseUrl
}

/**
 * Function: setBaseUrl
 *
 * Sets <baseUrl>.
 */
MxUrlConverter.prototype.setBaseUrl = function(value) {
  this.baseUrl = value
}

/**
 * Function: getBaseDomain
 *
 * Returns <baseDomain>.
 */
MxUrlConverter.prototype.getBaseDomain = function() {
  return this.baseDomain
}

/**
 * Function: setBaseDomain
 *
 * Sets <baseDomain>.
 */
MxUrlConverter.prototype.setBaseDomain = function(value) {
  this.baseDomain = value
}

/**
 * Function: isRelativeUrl
 *
 * Returns true if the given URL is relative.
 */
MxUrlConverter.prototype.isRelativeUrl = function(url) {
  return (
    url.substring(0, 2) !== '//' &&
    url.substring(0, 7) !== 'http://' &&
    url.substring(0, 8) !== 'https://' &&
    url.substring(0, 10) !== 'data:image' &&
    url.substring(0, 7) !== 'file://'
  )
}

/**
 * Function: convert
 *
 * Converts the given URL to an absolute URL with protol and domain.
 * Relative URLs are first converted to absolute URLs.
 */
MxUrlConverter.prototype.convert = function(url) {
  if (this.isEnabled() && this.isRelativeUrl(url)) {
    if (this.getBaseUrl() === null) {
      this.updateBaseUrl()
    }

    if (url.charAt(0) === '/') {
      url = this.getBaseDomain() + url
    } else {
      url = this.getBaseUrl() + url
    }
  }

  return url
}
