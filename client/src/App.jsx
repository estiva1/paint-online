import React from "react";
import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import "./styles/app.scss";

const App = () => {
  return (
    <div className="app">
      <Toolbar />
      <SettingBar />
      <Canvas />
    </div>
  );
};

export default App;
