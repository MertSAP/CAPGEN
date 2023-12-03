using {{ServiceTechnicalName}}Service from '../../srv/{{ServiceTechnicalNameLower}}-service';
{{=<% %>=}}
//
// annotatios that control the fiori layout
//
<%#to_Entity%>
annotate <%ServiceTechnicalName%>Service.<%EntityTechnicalName%> with @UI : {

  Identification : [
    <%#to_Action%>
    { $Type  : 'UI.DataFieldForAction', Action : '<%ServiceTechnicalName%>Service.<%ActionTechnicalName%>',   Label  : '{i18n><%EntityTechnicalName%>-<%ActionTechnicalName%>}'   },
    <%/to_Action%>
  ],
  HeaderInfo : {
    TypeName       : '{i18n><%EntityTechnicalName%>-EntityName}',
    TypeNamePlural : '{i18n><%EntityTechnicalName%>-EntityNamePlural}',
   <%#EntityTitleDisplay%>
    Title          : {
      $Type : 'UI.DataField',
      Value : <%EntityTitleDisplay.FieldTechnicalName%>
    },
    <%/EntityTitleDisplay%>
     <%#EntityDescriptionDisplay%>
    Description    : {
      $Type : 'UI.DataField',
      Value : <%EntityDescriptionDisplay.FieldTechnicalName%>
    }
     <%/EntityDescriptionDisplay%>
  },
  PresentationVariant : {
    Text           : 'Default',
    Visualizations : ['@UI.LineItem']<%#EntityTitleDisplay%>,

    SortOrder      : [{
      $Type      : 'Common.SortOrderType',
      Property   : <%EntityTitleDisplay.FieldTechnicalName%>,
      Descending : true
    }]<%/EntityTitleDisplay%>
  },
  SelectionFields : [
    <%#to_Field%><%#FieldisSelectionField%><%FieldTechnicalName%><%#FieldAssocationField%>_<%FieldAssocationField%><%/FieldAssocationField%>,
    <%/FieldisSelectionField%><%/to_Field%>
  ],
  LineItem : [
    <%#to_Action%>
    { $Type  : 'UI.DataFieldForAction', Action : '<%ServiceTechnicalName%>Service.<%ActionTechnicalName%>',   Label  : '{i18n><%EntityTechnicalName%>-<%ActionTechnicalName%>}'   },
    <%/to_Action%>
   <%#to_Field%><%#FieldLineDisplay%> {Value: <%FieldTechnicalName%><%#FieldAssocationField%>_<%FieldAssocationField%><%/FieldAssocationField%>},
    <%/FieldLineDisplay%><%/to_Field%>
  ],
  <%#EntityRequriesFacets%>

  Facets : [{
    $Type  : 'UI.CollectionFacet',
    Label  : '{i18n>GeneralInformation}',
    ID     : '<%EntityTechnicalName%>',
    Facets : [
      <%#to_Facet%>
      {  // facet <%FacetTechnicalName%>
        $Type  : 'UI.ReferenceFacet',
        ID     : '<%FacetTechnicalName%>',
        Target : '@UI.FieldGroup#<%FacetTechnicalName%>',
        Label  : '{i18n>facet-<%FacetTechnicalName%>}'
      },
       <%/to_Facet%>
      ]
  }<%#HasEntityChildRelationships%><%#EntityChildRelationships%>
  , 
  {  // <%ChildEntityTechnicalName%> list
  
    
    $Type  : 'UI.ReferenceFacet',
    ID     : '<%ChildEntityTechnicalName%>',
    Target : 'to_<%ChildEntityTechnicalName%>/@UI.PresentationVariant',
    Label  : '{i18n><%ChildEntityTechnicalName%>-EntityName}'
   
  } <%/EntityChildRelationships%><%/HasEntityChildRelationships%>],
  <%#to_Facet%>
  FieldGroup #<%FacetTechnicalName%> : {Data : [
     <%#FacetFields%>
    { $Type : 'UI.DataField', Value : <%FieldTechnicalName%><%#FieldAssocationField%>_<%FieldAssocationField%><%/FieldAssocationField%>  },
    <%/FacetFields%>
  ]},
  <%/to_Facet%>
   <%/EntityRequriesFacets%>
};
<%#FieldAssocationField%>
<%/FieldAssocationField%>
<%/to_Entity%>

<%={{ }}=%>