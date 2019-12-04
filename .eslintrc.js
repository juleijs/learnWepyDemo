module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  settings: {
    'html/html-extensions': ['.html', '.wpy']
  },
  globals: {
    wx: true
  },
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'semi': [
      'error',
      'always'
    ],
    'comma-dangle': ['error', 'only-multiline'],
    'padded-blocks': 0,
    'one-var': 0,
    'no-return-assign': 0,
    'indent': ['error', 4],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': 0
  }
}