const openBrowser = require('react-dev-utils/openBrowser')

const PORT = 8888

const open = ({instance}) => {
  const URL = `${instance.URL}:${PORT}`
  openBrowser(URL)
  console.log(`\nJupyter Notebook opened at: http://${URL}\n`)
}

module.exports = open
