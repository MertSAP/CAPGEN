{
  "_version": "1.49.0",
  "sap.app": {
    "id": "{{ServiceNamespace}}.ui.{{ServiceTechnicalName}}App",
    "type": "application",
    "i18n": "i18n/i18n.properties",
    "applicationVersion": {
      "version": "0.0.1"
    },
    "title": "{{appTitle}}",
    "description": "{{appDescription}}",
    "resources": "resources.json",
    "dataSources": {
      "mainService": {
        "uri": "processor/",
        "type": "OData",
        "settings": {
          "annotations": [],
          "localUri": "localService/metadata.xml",
          "odataVersion": "4.0"
        }
      }
    }
  },
  "sap.ui": {
    "technology": "UI5",
    "icons": {
      "icon": "",
      "favIcon": "",
      "phone": "",
      "phone@2": "",
      "tablet": "",
      "tablet@2": ""
    },
    "deviceTypes": {
      "desktop": true,
      "tablet": true,
      "phone": true
    }
  },
  "sap.ui5": {
    "flexEnabled": true,
    "dependencies": {
      "minUI5Version": "1.114.0",
      "libs": {
        "sap.m": {},
        "sap.ui.core": {},
        "sap.ushell": {},
        "sap.fe.templates": {}
      }
    },
    "contentDensities": {
      "compact": true,
      "cozy": true
    },
    "models": {
      "i18n": {
        "type": "sap.ui.model.resource.ResourceModel",
        "settings": {
          "bundleName": "{{ServiceNamespace}}.ui.{{ServiceTechnicalName}}App.i18n.i18n"
        }
      },
      "": {
        "dataSource": "mainService",
        "preload": true,
        "settings": {
          "synchronizationMode": "None",
          "operationMode": "Server",
          "autoExpandSelect": true,
          "earlyRequests": true
        }
      },
      "@i18n": {
        "type": "sap.ui.model.resource.ResourceModel",
        "uri": "i18n/i18n.properties"
      }
    },
    "resources": {
      "css": []
    },
    "routing": {
      "config": {},
      "routes": [

        {{#ListPages}}
        {
          "pattern": "{{{pattern}}}",
          "name": "{{name}}",
          "target": "{{target}}"
        }{{^isLast}},{{/isLast}}
        {{/ListPages}}
        {{#ObjectPages}}
        {
        "pattern": "{{{pattern}}}",
        "name": "{{name}}",
        "target": "{{target}}"
        }{{^isLast}},{{/isLast}}
        {{/ObjectPages}}
      ],
      "targets": {
        {{#ListPages}}
        "{{name}}": {
          "type": "Component",
          "id": "{{name}}",
          "name": "sap.fe.templates.ListReport",
          "options": {
            "settings": {
              "entitySet": "{{entity}}",
              "variantManagement": "Page",
              "navigation": {
                {{#navigation}}
                "{{EntityNavigation}}": {
                  "detail": {
                    "route": "{{route}}"
                  }
                  {{/navigation}}
                }
              }
            }
          }
        }
        {{^isLast}},{{/isLast}}
        {{/ListPages}}
        {{#ObjectPages}}
        "{{name}}": {
          "type": "Component",
          "id": "{{name}}",
          "name": "sap.fe.templates.ObjectPage",
          "options": {
            "settings": {
              "editableHeaderContent": false,
              "entitySet": "{{entity}}",
              "navigation": {
                {{#navigation}}
                "{{assoication}}": {
                  "detail": {
                    "route": "{{route}}"
                  }}
                  {{^isLast}},{{/isLast}}
                  {{/navigation}}
                
              }
            }
          }
        }{{^isLast}},{{/isLast}}
        {{/ObjectPages}}
      }
    }
  },
  "sap.fiori": {
    "registrationIds": [],
    "archeType": "transactional"
  }
}
