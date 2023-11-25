const fs = require('fs')
const path = require('path')
const ContentEnricher = require('./ContentEnricher.js')
const Template = require('./Template.js')
const Mustache = require('mustache')
module.exports = class TemplateGenerator {
  templates = 'templates.json'
  constructor (loadFileName, filesOnly, RootEntityTechnicalName) {
    // load the config file with all the templates to render
    this.templateConfig = fs.readFileSync(
      path.join(__dirname, this.templates),
      'utf-8'
    )

    // load the input json file
    this.templateData = JSON.parse(
      fs.readFileSync(path.join(path.resolve('./'), loadFileName), 'utf-8')
    )

    this.RootEntityTechnicalName = RootEntityTechnicalName

    this.filesOnly = filesOnly
    // enahnce the input json
  }

  enhance () {
    this.enrichInput(this.RootEntityTechnicalName)
    this.templateConfig = Mustache.render(
      this.templateConfig,
      this.templateData.Services[0]
    )
    this.templateConfig = JSON.parse(this.templateConfig)
  }

  validate () {
    const messages = []
    const roots = []
    let foundRoot = false
    if (this.RootEntityTechnicalName !== '') {
      for (const entity of this.templateData.Services[0].to_Entity) {
        if (entity.EntityParentRelationships.length === 0) {
          roots.push(entity.EntityTechnicalName)
          if (entity.EntityTechnicalName === this.RootEntityTechnicalName) {
            foundRoot = true
          }
        }
      }

      if (!foundRoot) {
        messages.push('Please enter a valid root. Options: ' + roots.toString())
      }
    }
    return messages
  }

  getServiceName () {
    return this.templateData.Services[0].ServiceTechnicalName
  }

  enrichInput (RootEntityTechnicalName) {
    const conEnricher = new ContentEnricher(this.templateData, RootEntityTechnicalName)
    this.templateData = conEnricher.getEnrichedTemplateData()
  }

  generateHelper (templateRow, data) {
    let outputPath = this.templateConfig.DefaultOutputPath

    if (
      templateRow.OutputPath !== undefined &&
    templateRow.OutputPath !== '' &&
    this.filesOnly === false
    ) {
      outputPath = templateRow.OutputPath
    }

    outputPath = path.join(
      path.resolve('./'),
      outputPath + templateRow.OutputFileName
    )
    const template = new Template(
      templateRow.InputTemplate,
      data,
      outputPath
    )

    if (
      templateRow.DeleteFile !== undefined &&
    templateRow.DeleteFile !== ''
    ) {
      template.deleteFile(templateRow.DeleteFile)
    }

    template.renderTemplate()
  }

  generate () {
    this.templateConfig.Templates.forEach((templateRow) => {
      if (templateRow.CustomHandler !== undefined) {
        this.customHandler(templateRow)
        return
      }
      this.generateHelper(templateRow, this.templateData)
    })
  }

  customHandler (templateRow) {
    switch (templateRow.CustomHandler) {
      case 'DataFiles':
        this.generateDataFiles(templateRow)
        break
      case 'xs-security':
        if (this.templateData.Services[0].Hasto_ServiceRole) {
          this.generateHelper(templateRow, this.templateData)
        }
        break
      case 'MasterData':
        if (this.templateData.Services[0].HasMasterData) {
          this.generateHelper(templateRow, this.templateData)
        }
        break
      case 'CurrencyType':
        if (this.templateData.Services[0].HasCurrencyType) {
          this.generateHelper(templateRow, this.templateData)
        }
        break
      case 'CountryType':
        if (this.templateData.Services[0].HasCountryType) {
          this.generateHelper(templateRow, this.templateData)
        }
        break
      default:
        break
    }
  }

  generateDataFiles (templateRow) {
    for (const entity of this.templateData.Services[0].to_Entity) {
      templateRow.OutputFileName =
        this.templateData.Services[0].ServiceNamespace +
        '-' +
        entity.EntityTechnicalName +
        '.csv'
      this.generateHelper(templateRow, entity)
    }
  }
}
