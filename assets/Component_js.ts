sap.ui.define(
    ["sap/fe/core/AppComponent"],
    function (Component) {
        "use strict";

        return Component.extend("{{ServiceNamespace}}.ui.{{ServiceTechnicalName}}App.Component", {
            metadata: {
                manifest: "json"
            }
        });
    }
);