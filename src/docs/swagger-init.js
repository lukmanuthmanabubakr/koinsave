window.onload = function () {
  SwaggerUIBundle({
    url: "/docs/swagger.yaml",
    dom_id: "#swagger-ui",
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: "BaseLayout",
  });
};
