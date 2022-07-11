import React from "react";
import toolState from "../store/toolState";

const SettingBar = () => {
  return (
    <div className="setting-bar">
      <label htmlFor="line-width">Line Width</label>
      <input
        type="number"
        id="line-width"
        style={{ margin: "0 10px" }}
        defaultValue={1}
        min={1}
        max={20}
        onChange={(e) => toolState.setLineWidth(e.target.value)}
      />
      <label htmlFor="stroke-color">Stroke Color </label>
      <input
        type="color"
        id="stroke-color"
        onChange={(e) => toolState.setStrokeColor(e.target.value)}
      />
    </div>
  );
};

export default SettingBar;
