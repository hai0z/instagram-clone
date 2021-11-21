import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = React.createContext(undefined);

const ThemeProvider = ({ children }) => {
    const [isLoadingTheme, setIsLoadingTheme] = React.useState(true);

    const [theme, setTheme] = React.useState(async () => {
        const data = await AsyncStorage.getItem("theme");
        if (data) {
            setTheme(JSON.parse(data));
            console.log(typeof data);
            setIsLoadingTheme(false);
        } else {
            setTheme({
                isLightTheme: true,
                light: {
                    textColor: "#000",
                    backgroundColor: "#fff",
                },
                dark: {
                    textColor: "#fff",
                    backgroundColor: "#000",
                },
            });
            setIsLoadingTheme(false);
        }
    });

    React.useEffect(() => {
        const saveTheme = () => {
            AsyncStorage.setItem("theme", JSON.stringify(theme));
        };
        saveTheme();
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isLoadingTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
