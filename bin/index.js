#!/usr/bin/env node
const yargs = require('yargs')
const TemplateGenerator = require('./TemplateGenerator.js')
const DirectoryGenerator = require('./DirectoryGenerator.js')
const options = yargs
  .usage('Usage: -f <loadfile>')
  .option('f', { alias: 'loadfile', describe: 'Load File', type: 'string', demandOption: false })
  .option('p', { alias: 'project', describe: 'Files Only', type: 'boolean', demandOption: false, default: false })
  .option('r', { alias: 'rootEntity', describe: 'Root Entity(Fiori)', type: 'string', demandOption: false, default: false })
  .argv

const templateGenerator = new TemplateGenerator(options.loadfile, options.project, options.rootEntity)
const directoryGenerator = new DirectoryGenerator(templateGenerator.getServiceName(), options.project)
directoryGenerator.generate()
templateGenerator.generate()