import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ExpressionConverter from "./components/ExpressionConverter";
function App() {
  const [count, setCount] = useState(0);

  return <ExpressionConverter />;
}

export default App;
