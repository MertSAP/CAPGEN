sap.ui.define(
    ["sap/fe/core/AppComponent"],
    function (Component) {
        "use strict";

        return Component.extend("{{ServiceNamespace}}.ui.{{ServiceTechnicalNameApp}}.Component", {
            metadata: {
                manifest: "json"
            }
        });
    }
);