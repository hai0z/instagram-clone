import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeProvider";

const SelectTheme = ({ navigation }) => {
  const { theme, setTheme } = useContext(ThemeContext);

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
        <Text style={{ ...styles.setting, color: textColor }}>Đặt chủ đề</Text>
      </View>
      <View style={styles.main}>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={1}
          onPress={() =>
            setTheme((prev) => {
              return { ...prev, isLightTheme: true };
            })
          }
        >
          <Text style={{ color: textColor, fontSize: 16, fontWeight: "500" }}>
            Sáng
          </Text>
          <TouchableOpacity
            onPress={() =>
              setTheme((prev) => {
                return { ...prev, isLightTheme: true };
              })
            }
            style={{
              height: 25,
              width: 25,
              backgroundColor: "gray",
              borderRadius: 25 / 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isLightTheme ? (
              <View
                style={{
                  height: 25,
                  width: 25,
                  backgroundColor: "#0097f6",
                  borderRadius: 25 / 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="checkmark" color={backgroundColor} size={20} />
              </View>
            ) : (
              <View
                style={{
                  height: 22,
                  width: 22,
                  backgroundColor: backgroundColor,
                  borderRadius: 22 / 2,
                }}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={1}
          onPress={() =>
            setTheme((prev) => {
              return { ...prev, isLightTheme: false };
            })
          }
        >
          <Text style={{ color: textColor, fontSize: 16, fontWeight: "500" }}>
            Tối
          </Text>
          <TouchableOpacity
            onPress={() =>
              setTheme((prev) => {
                return { ...prev, isLightTheme: false };
              })
            }
            style={{
              height: 25,
              width: 25,
              backgroundColor: "gray",
              borderRadius: 25 / 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!isLightTheme ? (
              <View
                style={{
                  height: 25,
                  width: 25,
                  backgroundColor: "#0097f6",
                  borderRadius: 25 / 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="checkmark" color={backgroundColor} size={20} />
              </View>
            ) : (
              <View
                style={{
                  height: 22,
                  width: 22,
                  backgroundColor: backgroundColor,
                  borderRadius: 22 / 2,
                }}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectTheme;

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
    marginTop: 20,
    marginHorizontal: 10,
  },
  btn: {
    flexDirection: "row",
    marginVertical: 15,
    marginHorizontal: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
