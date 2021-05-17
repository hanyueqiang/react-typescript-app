import React from "react";
import ReactDOM from "react-dom";
import CssDemo from '@/pages/cssDemo'

const App = () => <>
<h1>My React and TypeScript App!asdfghjkl;</h1>
<CssDemo/>
</>;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
