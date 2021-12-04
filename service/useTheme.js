import React from "react";

import { ThemeContext } from "../context/ThemeProvider";

export default function useTheme() {
    const { theme } = React.useContext(ThemeContext);
    const { isLightTheme, light, dark } = theme;
    const textColor = isLightTheme ? light.textColor : dark.textColor;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;
    return {
        textColor,
        backgroundColor,
        isLightTheme,
    };
}
