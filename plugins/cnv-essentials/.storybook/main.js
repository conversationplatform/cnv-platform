module.exports = {
  "stories": [
    "../widgets/**/*.stories.mdx",
    "../widgets/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    'storybook-addon-sass-postcss',
    '@storybook/addon-actions'
  ],
  "framework": "@storybook/react",
  "staticDirs": [
    '../animations',
    '../img',
    '../svg'
  ]
}
