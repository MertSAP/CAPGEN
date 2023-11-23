const cds = require("@sap/cds");

class {{ServiceTechnicalName}}Service extends cds.ApplicationService {
  init() {

    const {
     {{#to_Entity}}
      {{EntityTechnicalName}},
     {{/to_Entity}}
     } = this.entities

{{#to_Entity}}
 {{#EntityHasValidations}}
  this.before('SAVE', '{{EntityTechnicalName}}', async req => {


  });
   {{/EntityHasValidations}}
  {{/to_Entity}}
{{#to_Entity}}
 {{#to_Action}}
  this.on('{{ActionTechnicalName}}', async req => {

  });
   {{/to_Action}}
{{/to_Entity}}

{{#to_Entity}}
 {{#EntityHasDeterminations}}
 this.before ('CREATE', '{{EntityTechnicalName}}', async req => {
    
  })
   {{/EntityHasDeterminations}}
  {{/to_Entity}}

  {{#to_Entity}}
  {{#HasAutoIncrement}}
  {{#to_Field}}
  {{#FieldAutoIncrement}}
  this.before ('CREATE', '{{EntityTechnicalName}}', async (req) => {
    const { maxID } = await SELECT.one `max({{FieldTechnicalName}}) as maxID` .from ({{EntityTechnicalName}});
    req.data.{{FieldTechnicalName}} = maxID + 1
  })
  {{/FieldAutoIncrement}}
  {{/to_Field}}
  {{/HasAutoIncrement}}
  {{/to_Entity}}
return super.init()
} }{{=<% %>=}}module.exports = {<%ServiceTechnicalName%>Service} <%={{ }}=%>
