using {{ServiceTechnicalName}}Service from '../../srv/{{ServiceTechnicalNameLower}}-service';

annotate {{ServiceTechnicalName}}Service.{{#to_Entity}}{{#EntityIsRoot}}{{EntityTechnicalName}}{{/EntityIsRoot}}{{/to_Entity}} with @odata.draft.enabled;