import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, View, LogBox, Image } from "react-native";
import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";
const Splash = ({ navigation }) => {
  const { setLoading } = React.useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);

  const { isLightTheme, light, dark } = theme;

  const backgroundColor = isLightTheme
    ? light.backgroundColor
    : dark.backgroundColor;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  LogBox.ignoreLogs(["Setting a timer"]);
  return (
    <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/instalogo.png")}
          style={styles.logo}
          resizeMode="center"
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.from}>from</Text>
        <Image
          source={require("../assets/facebookTextLogo.png")}
          resizeMode="center"
          style={styles.facebook}
        />
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    transform: [{ scale: 0.3 }],
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.8,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.2,
  },
  facebook: {
    transform: [{ scale: 0.4 }],
  },
  from: {
    color: "gray",
    fontSize: 16,
    marginBottom: -30,
  },
});
