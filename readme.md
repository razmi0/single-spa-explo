# Exploration Vite-Single-Spa-React-HMR-Webpack

[fully implemented without root webpack](https://github.com/razmi0/vite-singlespa-react-esm-poc)

<% if (PROD) { %>
        <script type="injector-importmap" src="/importmap.prod.json"></script>
            {
                "imports": {
                    "@Razmio/root-config": "<http://localhost:2999/Razmio-root-config.js>",
                    "@Razmio/rnd-2": "<http://localhost:3001/Razmio-rnd-2.js>",
                    "@Razmio/welcome": "<http://localhost:3003/src/Razmio-welcome.tsx>"
                }
            }
        </script>
        <% } else { %>
        <!-- Production import map: adjust URLs to where you host the built bundles -->
        <script type="injector-importmap" src="/importmap.json"></script>
        <% } %>
