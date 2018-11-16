'use strict'
module.exports = function(source) {
  this.cacheable()
  return `
    import 'babel-polyfill';
    import render from 'client';
    import Page from '${this.resourcePath.replace(/\\/g, '\\\\')}';
    export default render({ ...Page });
  `
}
