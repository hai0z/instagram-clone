import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../firebase";
const Setting = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  const { isLightTheme, light, dark } = theme;

  const textColor = isLightTheme ? light.textColor : dark.textColor;

  const backgroundColor = isLightTheme
    ? light.backgroundColor
    : dark.backgroundColor;

  return (
    <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={textColor} />
        </TouchableOpacity>
        <Text style={{ ...styles.setting, color: textColor }}>Cài đặt</Text>
      </View>
      <View style={styles.main}>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View style={{ position: "absolute", zIndex: 2, left: 10 }}>
            <Ionicons name="search" size={20} color="gray" />
          </View>
          <TextInput
            style={{
              height: 40,
              borderRadius: 15,
              padding: 10,
              paddingLeft: 40,
              backgroundColor: isLightTheme ? "#efefef" : "#262626",
              fontWeight: "bold",
              color: textColor,
              position: "relative",
              flex: 1,
            }}
            placeholder="Tìm kiếm..."
            placeholderTextColor={isLightTheme ? "#ccc" : "#494949"}
          />
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("SelectTheme")}
        >
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={24}
            color={textColor}
          />
          <Text style={{ color: textColor, marginLeft: 10 }}>Chủ đề</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => auth.signOut()}>
          <Text style={{ color: "#0097f6" }}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingLeft: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  setting: {
    fontWeight: "bold",
    marginLeft: 25,
    fontSize: 20,
  },
  main: {
    marginHorizontal: 10,
  },
  btn: {
    flexDirection: "row",
    marginVertical: 15,
    marginHorizontal: 15,
  },
});
