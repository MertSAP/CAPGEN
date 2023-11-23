using {{ServiceTechnicalName}}Service from '../srv/{{ServiceTechnicalNameLower}}-service';
{{=<% %>=}}
<%#to_Entity%>
<%#to_ValueHelp%>
annotate  <%ServiceTechnicalName%>Service.<%EntityTechnicalName%> {
     <%ValueHelpTechnicalName%> @(Common : {
        Text            : <%ValueHelpTechnicalName%>.<%ValueHelpTextField.FieldTechnicalName%>,
        TextArrangement : #TextOnly,
        ValueList       : {
            Label          : '{i18n><%ValueHelpTechnicalName%>-ValueHelpName}', //Title of the value help dialog
            CollectionPath : '<%ValueHelpEntity.EntityTechnicalName%>', //Entities of the value help. Refers to an entity name from the CAP service
            Parameters     : [
                {
                    $Type               : 'Common.ValueListParameterInOut',
                    ValueListProperty   : '<%ValueHelpEntity.KeyField%>', //Binding between ID and contact_ID, that everything works
                    LocalDataProperty   : <%ValueHelpTechnicalName%>_<%ValueHelpEntity.KeyField%>
                }<%#ValueHelpDispayFields%>,
                {
                    $Type               : 'Common.ValueListParameterDisplayOnly', //Displays additional information from the entity set of the value help 
                    ValueListProperty   : '<%FieldTechnicalName%><%#FieldAssocationField%>_<%FieldAssocationField%><%/FieldAssocationField%>'
                }<%/ValueHelpDispayFields%>                  
            ]
        }
    });

}
<%/to_ValueHelp%>

<%/to_Entity%>


<%={{ }}=%>