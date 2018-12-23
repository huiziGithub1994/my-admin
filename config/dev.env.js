'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://localhost:9999"' // mock服务
  BASE_API: '"http://47.107.255.128:8089"'
})
