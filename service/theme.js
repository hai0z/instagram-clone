import React from "react";

import { ThemeContext } from "../context/ThemeProvider";

export default function getTheme() {
  const { theme } = React.useContext(ThemeContext);
  const { isLightTheme, light, dark } = theme;

  return {
    isLightTheme,
    light,
    dark,
  };
}
