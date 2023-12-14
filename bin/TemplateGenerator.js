const fs = require('fs')
const path = require('path')
const ContentEnricher = require('./ContentEnricher.js')
const Template = require('./Template.js')
const Mustache = require('mustache')
module.exports = class TemplateGenerator {
  templates = 'templates.json'
  constructor (loadFileName, filesOnly, RootEntityTechnicalName, updateMode) {
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
    this.updateMode = updateMode
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
    const message = this.checkDirectoryContents();
    if(message !== '') {
      messages.push(message)
    }
    return messages
  }

  checkDirectoryContents() {
    const dbDir = path.join(path.resolve('.'), 'db');
    const packageFile = path.join(path.resolve('.'), 'package.json');
    const schemaCDSFile = path.join(path.resolve('.'), 'schema.cds');
    const dbDirExists =  fs.existsSync(dbDir);
    const packageFileExists = fs.existsSync(packageFile);
    const schemaCDSFileExists = fs.existsSync(schemaCDSFile);
   
    let message = '';

    if(!this.updateMode && schemaCDSFileExists) {
      //Trying to run create when files exist already.
      message = 'Please run in update mode -u';
      return message;
    }
    if(!this.filesOnly && !packageFileExists && this.updateMode) {
      //Project Mode and Package.json doesn't exist. This means we shouldn't be using update Mode
      message = 'Project not detected. Please run without -u first';
      return message;
    }

    if(!this.filesOnly && packageFileExists && !this.updateMode) {
      //Project mode and Package File exists, yet not running in update mode. We should be running in update mode
      message = 'A project already exists please run in update mode(-u)'
      return message;
    }

    if(this.filesOnly && (packageFileExists || dbDirExists)) {
      if(this.updateMode) {
        //Running in files only mode but a project exists. Throw an error. Should run in project mode
        message = 'Project detected. Please run without -p'
        return message;
      } else {
        //should be running in project update mode
        message = 'Project detected. Please run with -p and in update mode -u'
        return message;
      }
    }
    return message;
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
      if(entity.EntityGenerateDataFile) {
        templateRow.OutputFileName =
          this.templateData.Services[0].ServiceNamespace +
          '-' +
          entity.EntityTechnicalName +
          '.csv'
        this.generateHelper(templateRow, entity)
      }
    }
  }
}
