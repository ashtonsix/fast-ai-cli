const ssh = ({instance}) => {
  console.log('\nNot implemented, run:\n')
  console.log(`  ssh -i ${instance.key} ubuntu@${instance.URL}\n`)
}

module.exports = ssh
