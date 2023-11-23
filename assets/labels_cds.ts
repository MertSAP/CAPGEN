using {  {{ServiceNamespace}} as schema } from '../db/schema';

namespace  {{ServiceNamespace}};
{{#to_Entity}}
annotate schema.{{EntityTechnicalName}}  {
 {{#to_Field}}
    {{FieldTechnicalName}}  @title:  {{=<% %>=}}'{i18n><% EntityTechnicalName %>-<% FieldTechnicalName %>}'<%={{ }}=%>;
 {{/to_Field}}
}
{{/to_Entity}}
