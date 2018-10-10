module.exports = {
  extends: [
    "eslint-config-egg",
    'plugin:vue/essential'
  ],
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 8,
    sourceType: "module"
  },
  rules: {
    "prefer-const": "off",
    "arrow-parens": "off",
    "valid-jsdoc": "off",
    "eol-last": "off",
    "array-bracket-spacing": "off",
    "no-unused-vars": "off",
    "no-else-return": "off",
    "no-alert": "off",
    "dot-notation": "off",
    strict: "off",
    "linebreak-style": "off",
    "no-irregular-whitespace": [
      "error",
      {
        skipComments: true
      }
    ],
    "comma-dangle": [
      "error",
      {
        arrays: "only-multiline",
        objects: "only-multiline"
      }
    ],
    "space-before-function-paren": [
      1,
      {
        anonymous: "never",
        named: "never",
        asyncArrow: "always"
      }
    ],
    "spaced-comment": [2, "always", {
      exceptions: ["doc"]
    }],
    "brace-style": 2,
    // allow async-await
    "generator-star-spacing": "off",
    semi: ["error", "never"],
    "quote-props": ["error", "as-needed", { "keywords": false, "unnecessary": false }],
    "one-var-declaration-per-line": ["error", "initializations"]
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  globals: {
    EASY_ENV_IS_PROD: true,
    EASY_ENV_IS_NODE: true,
    EASY_ENV_IS_BROWSER: true
  },
  plugins: [
    "html",
    "vue"
  ]
}
