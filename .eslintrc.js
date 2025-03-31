module.exports = {
  parser: "@babel-eslint/parser",
  plugins: ["@babel-eslint", "react"],
  extends: [
    "eslint:recommended",
    "plugin:@babel-eslint/recommended",
    "plugin:react/recommended",
  ],
  rules: {
    "react/prop-types": "off",
  },
  settings: {
    react: { version: "detect" },
  },
};