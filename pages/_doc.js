import React from "react";

export default ({ children }) => (
  <html>
    <script>window.__hydrate=true</script>
    <body>
      <div id="app">{children}</div>
      <script src="./index.js" />
    </body>
  </html>
);
