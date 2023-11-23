using { {{ServiceNamespace}} as my } from './{{ServiceTechnicalNameLower}}-service';

{{#to_Entity}}{{#HasEntityRoles}}

  extend  my.{{EntityTechnicalName}} @(restrict : [ 
   {{#EntityRoles}}
        { 
          grant: ['{{AuthType}}'], 
          to: '{{RoleTechnicalName}}' 
        }{{^isLast}},{{/isLast}}
      {{/EntityRoles}}
    ]);
  {{/HasEntityRoles}}{{/to_Entity}}