#!/usr/bin/env node
const yargs = require('yargs')
const TemplateGenerator = require('./TemplateGenerator.js')
const DirectoryGenerator = require('./DirectoryGenerator.js')
const options = yargs
  .usage('Usage: -f <loadfile>')
  .option('f', { alias: 'loadfile', describe: 'Load File', type: 'string', demandOption: true })
  .option('p', { alias: 'project', describe: 'Files Only', type: 'boolean', demandOption: false, default: false })
  .option('r', { alias: 'rootEntity', describe: 'Root Entity(Fiori)', type: 'string', demandOption: false, default: false })
  .option('u', { alias: 'update', describe: 'Update Mode', type: 'boolean', demandOption: false, default: false })
  .argv

const templateGenerator = new TemplateGenerator(options.loadfile, options.project, options.rootEntity, options.update)
let messages = templateGenerator.validate();
if(messages.length > 0) {
  console.log(messages[0]);
  return;
}
try {
  templateGenerator.enhance();
} catch({ name, message })  {
  console.log(message);
  return;
}

if(!options.update) {
  const directoryGenerator = new DirectoryGenerator(templateGenerator.getServiceName(), options.project, options.update)
  directoryGenerator.generate()
}
templateGenerator.generate()
