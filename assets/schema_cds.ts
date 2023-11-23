using {  {{#HasCurrencyType}}Currency,{{/HasCurrencyType}}{{#HasCountryType}}Country,{{/HasCountryType}} custom.managed, sap.common.CodeList } from './common';

namespace {{ServiceNamespace}};

{{#HasMasterData}}
using { 
{{#to_Entity}}{{^EntityVirtual}}{{#EntityMasterData}}
  {{ServiceNamespace}}.{{EntityTechnicalName}}{{^isLast}},{{/isLast}}
  {{/EntityMasterData}}{{/EntityVirtual}}{{/to_Entity}} } from './master-data';

{{/HasMasterData}}

{{#to_Entity}}{{^EntityVirtual}}{{^EntityMasterData}}
entity {{EntityTechnicalName}} : managed {
    {{#to_Field}}{{#FieldisKey}}
    key {{FieldTechnicalName}} : {{FieldType}}{{#FieldLength}}({{FieldLength}}){{/FieldLength}} @readonly;
     {{/FieldisKey}}
      {{^FieldisKey}}{{#FieldType}}
    {{#FieldVirtual}}virtual {{/FieldVirtual}}{{FieldTechnicalName}} : {{FieldType}}{{#FieldLength}}({{FieldLength}}){{/FieldLength}}{{#FieldMandatory}} @mandatory{{/FieldMandatory}}{{#FieldReadOnly}} @readonly{{/FieldReadOnly}}{{#FieldAutoIncrement}}@readonly default 0{{/FieldAutoIncrement}};
      {{/FieldType}}{{/FieldisKey}}
    {{/to_Field}}
    {{#to_ValueHelp}}
    {{ValueHelpTechnicalName}} : Association to  {{ValueHelpEntity.EntityTechnicalName}};
    {{/to_ValueHelp}}
    {{#EntityParentRelationships}}
    to_{{ParentEntityTechnicalName}}:  Association to {{ParentEntityTechnicalName}};
    {{/EntityParentRelationships}}
     {{#EntityChildRelationships}}
    to_{{ChildEntityTechnicalName}}:  Composition of many {{ChildEntityTechnicalName}} on  to_{{ChildEntityTechnicalName}}.to_{{EntityTechnicalName}} = $self;
    {{/EntityChildRelationships}}
}
{{/EntityMasterData}}{{/EntityVirtual}}{{/to_Entity}}
