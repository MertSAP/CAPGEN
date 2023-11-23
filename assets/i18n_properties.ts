appTitle=zzzzApp Title

#YDES: Application description
appDescription=zzzzA Fiori application.

{{#to_Entity}}
    {{#to_Field}}
{{EntityTechnicalName}}-{{FieldTechnicalName}} = {{FieldLabel}}
    {{/to_Field}}
     {{#to_Action}}
{{EntityTechnicalName}}-{{ActionTechnicalName}} = {{ActionLabel}}
    {{/to_Action}}
    {{#to_Facet}}
facet-{{FacetTechnicalName}} = {{FacetLabel}}
    {{/to_Facet}}
{{#to_valueHelp}}
{{EntityTechnicalName}}-{{ValueHelpTechnicalName}} = {{ValueHelpLabel}}
{{/to_valueHelp}}
{{/to_Entity}}