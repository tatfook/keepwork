/**
 * 生产环境配置
 *
 * 最终生效的配置为 prod + default（前者覆盖后者）
 */

module.exports = app => {
  const exports = {}

  exports.cluster = {
    listen: {
      port: 8080,
      hostname: '0.0.0.0',
    }
  }

  return exports
}
