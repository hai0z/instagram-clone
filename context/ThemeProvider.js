import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = React.createContext();

const defaultTheme = {
    isLightTheme: true,
    light: {
        textColor: "#000",
        backgroundColor: "#fff",
    },
    dark: {
        textColor: "#fff",
        backgroundColor: "#000",
    },
};
const ThemeProvider = ({ children }) => {
    const [isLoadingTheme, setIsLoadingTheme] = React.useState(true);

    const [theme, setTheme] = React.useState(defaultTheme);

    const findOldTheme = async () => {
        const themes = await AsyncStorage.getItem("theme");
        if (themes != null) {
            setIsLoadingTheme(false);
            setTheme(JSON.parse(themes));
        } else {
            setIsLoadingTheme(false);
            setTheme(defaultTheme);
        }
    };
    React.useEffect(() => {
        findOldTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isLoadingTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
