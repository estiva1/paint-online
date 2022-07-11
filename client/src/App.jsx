import React from "react";
import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import "./styles/app.scss";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/:id"
            element={
              <>
                <Toolbar />
                <SettingBar />
                <Canvas />
              </>
            }
          ></Route>
          <Route
            path="*"
            element={<Navigate to={`f${(+new Date()).toString(16)}`} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
