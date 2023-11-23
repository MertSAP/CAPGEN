{{=<% %>=}}
{
  "[development]": {
      "auth": {
          "passport": {
              "strategy": "mock",
              "users": {
                <%#to_ServiceRole%>
                  "<%RoleLocalUser%>": {
                      "password": "<%RoleLocalPassword%>",
                      "ID": "<%RoleLocalUser%>",
                      "roles": [
                          "<%RoleTechnicalName%>"
                      ]
                  }<%^isLast%>,<%/isLast%>
                  <%/to_ServiceRole%>
              }
          }
      }
  }
}
<%={{ }}=%>