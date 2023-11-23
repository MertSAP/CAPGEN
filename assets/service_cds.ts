using { {{ServiceNamespace}} as my } from '../db/schema';

{{#Hasto_ServiceRole}}
using { {{ServiceNamespace}} } from './{{ServiceTechnicalNameLower}}-service-auth';
{{/Hasto_ServiceRole}}

service {{ServiceTechnicalName}}Service @(path:'/processor') {

{{#to_Entity}}
  {{#DisplayService}}
  entity {{EntityTechnicalName}} as projection on my.{{EntityTechnicalName}} {{#Hasto_Action}} actions {
    {{#to_Action}}
    action {{ActionTechnicalName}}({{#to_ActionParameter}}{{ActionParameterTechnicalName}} : {{FieldType}}{{^isLast}},{{/isLast}}{{/to_ActionParameter}});
    {{/to_Action}}

  }{{/Hasto_Action}};
  {{/DisplayService}}
{{/to_Entity}}
{{#to_Entity}}{{#Entityvirtual}}
  entity {{EntityTechnicalName}} {
    {{#to_Field}}{{#FieldisKey}}
    key {{FieldTechnicalName}} : {{FieldType}}{{#FieldLength}}({{FieldLength}}){{/FieldLength}} @readonly;
     {{/FieldisKey}}
      {{^FieldisKey}}{{#FieldType}}
    {{FieldTechnicalName}} : {{FieldType}}{{#FieldLength}}({{FieldLength}}){{/FieldLength}}
      {{/FieldType}}{{/FieldisKey}}
    {{/to_Field}}
    {{#to_ValueHelp}}
    {{ValueHelpTechnicalName}} : Association to  {{ValueHelpEntity.EntityTechnicalName}};
    {{/to_ValueHelp}}
  } {{#Hasto_Action}} actions {
    {{#to_Action}}
    action {{ActionTechnicalName}}({{#to_ActionParameter}}{{ActionParameterTechnicalName}} : {{FieldType}}{{^isLast}},{{/isLast}}{{/to_ActionParameter}});
    {{/to_Action}}
  }{{/Hasto_Action}};{{/Entityvirtual}}{{/to_Entity}}
}
