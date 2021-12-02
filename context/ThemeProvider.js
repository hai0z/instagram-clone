import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = React.createContext(undefined);

const ThemeProvider = ({ children }) => {
    const [isLoadingTheme, setIsLoadingTheme] = React.useState(true);

    const [theme, setTheme] = React.useState({
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

    const findOldTheme = async () => {
        const themes = await AsyncStorage.getItem("theme");
        if (themes != null) {
            console.log(themes);
            setIsLoadingTheme(false);
            setTheme(JSON.parse(themes));
        } else {
            console.log("k co theme");
            setIsLoadingTheme(false);
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
