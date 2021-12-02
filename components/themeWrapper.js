import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
const themeWrapper = ({ children }) => {
    const { isLoadingTheme } = useContext(ThemeContext);

    if (isLoadingTheme == true) return null;
    return children;
};

export default themeWrapper;
