{{=<% %>=}}
{
    "xsappname": "cpapp",
    "tenant-mode": "dedicated",
    "scopes": [
      <%#to_ServiceRole%>
      {
        "name": "$XSAPPNAME.<%RoleTechnicalName%>",
        "description": "<%RoleTechnicalName%>"
      }<%^isLast%>,<%/isLast%>
      <%/to_ServiceRole%>
    ],
    "attributes": [],
    "role-templates": [
      <%#to_ServiceRole%>
      {
        "name": "<%RoleTechnicalName%>",
        "description": "generated",
        "scope-references": [
          "$XSAPPNAME.<%RoleTechnicalName%>"
        ],
        "attribute-references": []
      }<%^isLast%>,<%/isLast%>
      <%/to_ServiceRole%>
    ]
  }
  <%={{ }}=%>