const path = require('path')
let prod = process.env.NODE_ENV === 'production'

module.exports = {
  eslint: true,
  wpyExt: '.wpy',
  build: {
    web: {
      htmlTemplate: path.join('src', 'index.template.html'),
      htmlOutput: path.join('web', 'index.html'),
      jsOutput: path.join('web', 'index.js')
    }
  },
  compilers: {
    saas: {
      outputStyle: 'compressed'
    },
    babel: {
      sourceMap: true,
      presets: [
        'es2015',
        'stage-1'
      ],
      plugins: [
        'transform-export-extensions',
        'syntax-export-extensions'
      ]
    }
  }
}

if (prod) {
  delete module.exports.compilers.babel.sourceMap

  // 压缩less
  module.exports.compilers['less'] = {compress: true}

  // 压缩js
  module.exports.plugins = {
    uglifyjs: {
      filter: /\.js$/,
      config: {}
    }
  }
}