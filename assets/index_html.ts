<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ServiceName}} </title>
    <style>
        html, body, body > div, #container, #container-uiarea {
            height: 100%;
        }
    </style>
    <script
        id="sap-ui-bootstrap"
        src="https://sapui5.hana.ondemand.com/1.114.0/resources/sap-ui-core.js"
        data-sap-ui-theme="sap_horizon"
        data-sap-ui-resourceroots='{
            "{{ServiceNamespace}}.ui.{{ServiceTechnicalName}}App": "./"
        }'
        data-sap-ui-oninit="module:sap/ui/core/ComponentSupport"
        data-sap-ui-compatVersion="edge"
        data-sap-ui-async="true"
        data-sap-ui-frameOptions="trusted"
    ></script>
</head>
<body class="sapUiBody sapUiSizeCompact" id="content">
    <div
        data-sap-ui-component
        data-name="{{ServiceNamespace}}.ui.{{ServiceTechnicalName}}App"
        data-id="container"
        data-settings='{"id" : "{{ServiceNamespace}}.ui.{{ServiceTechnicalName}}App"}'
        data-handle-validation="true"
    ></div>
</body>
</html>