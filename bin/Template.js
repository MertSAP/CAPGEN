var fs = require('fs');
path = require('path');
const Mustache = require('mustache');
module.exports = class Template{
    templateLocation = '../assets/';
    constructor(templateName, templateData, templateOutput) {
        this.relPathTemplate = this.templateLocation + templateName;
        this.templateOutput = templateOutput;
        try {
            this.templateData = templateData.Services[0];
        } catch(Exception) {
            this.templateData = templateData;
        }
    }
 
    deleteFile(deleteFile) {
        fs.unlink(path.join(path.resolve("./"), deleteFile), (err) => {
            if (err) {
              //  throw err;
            }
        
        });
    }
    renderTemplate() {

    let template = fs.readFileSync(path.join(__dirname, this.relPathTemplate),'utf-8');
    const rendered = Mustache.render(template, this.templateData);
    fs.writeFile(this.templateOutput,rendered, function(err) {
        if(err) {
            console.log(err);
            throw err;
        }
    }); 
    }
}