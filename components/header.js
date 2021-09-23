/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import logo from "../assets/logo.png";
import logoWhite from "../assets/logo-white.png";
import { Octicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeProvider";
const Header = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  const { isLightTheme, light, dark } = theme;

  const textColor = isLightTheme ? light.textColor : dark.textColor;

  const backgroundColor = isLightTheme
    ? light.backgroundColor
    : dark.backgroundColor;
  return (
    <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
      <Image source={isLightTheme ? logo : logoWhite} style={styles.logo} />
      <TouchableOpacity
        onPress={() => navigation.navigate("AddPost")}
        style={styles.addIcon}
      >
        <Octicons name="diff-added" size={24} color={textColor} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sendIcon}
        onPress={() => navigation.navigate("Chat")}
      >
        <Feather name="send" size={24} color={textColor} />
      </TouchableOpacity>
    </View>
  );
};
export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    resizeMode: "center",
    marginLeft: -30,
    transform: [{ scale: 1.3 }],
  },
  addIcon: {
    marginHorizontal: 10,
    marginLeft: "auto",
  },
  sendIcon: {
    marginHorizontal: 15,
  },
});
