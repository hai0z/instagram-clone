import React from "react";

import Navigation from "./navigation/navigator";
import ModalProvider from "./context/ModalProvider";
import AuthProvider from "./context/AuthProvider";
import ThemeProvider from "./context/ThemeProvider";
import ThemeWrapper from "./components/themeWrapper";

export default function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ModalProvider>
                    <ThemeWrapper>
                        <Navigation />
                    </ThemeWrapper>
                </ModalProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
