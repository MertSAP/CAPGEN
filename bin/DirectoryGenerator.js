const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

module.exports = class DirectoryGenerator {
  constructor (ServiceName, filesOnly) {
    this.ServiceName = ServiceName
    this.FilesOnly = filesOnly
  }

  generate () {
    if (this.FilesOnly) return
    if (this.createDirectory('app')) return
    if (this.createProject()) return
    if (this.createDirectory('app/' + this.ServiceName + '/')) return
    if (this.createDirectory('_i18n')) return
    if (this.createDirectory('app/' + this.ServiceName + '/webapp')) return
    if (this.createDirectory('db/data')) return
  }

  createProject () {
    execSync('cds init', (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return false
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return false
      }
      return true
    })
  }

  createDirectory (directory) {
    fs.mkdir(path.join(path.resolve('./'), directory), (err) => {
      if (err) {
        console.log(err)
        return false
      }
      return true
    })
  }
}
