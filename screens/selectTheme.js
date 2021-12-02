import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectTheme = ({ navigation }) => {
    const { theme, setTheme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;

    const setDarkTheme = async () => {
        await AsyncStorage.setItem(
            "theme",
            JSON.stringify({
                ...theme,
                isLightTheme: false,
            })
        );
    };

    const setLightTheme = async () => {
        setTheme({ ...theme, isLightTheme: true });
        await AsyncStorage.setItem(
            "theme",
            JSON.stringify({
                ...theme,
                isLightTheme: true,
            })
        );
    };

    return (
        <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color={textColor} />
                </TouchableOpacity>
                <Text style={{ ...styles.setting, color: textColor }}>
                    Đặt chủ đề
                </Text>
            </View>
            <View style={styles.main}>
                <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={1}
                    onPress={setLightTheme}
                >
                    <Text style={{ color: textColor, ...styles.themeName }}>
                        Sáng
                    </Text>
                    <TouchableOpacity
                        onPress={setLightTheme}
                        style={styles.circle}
                    >
                        {isLightTheme ? (
                            <View style={styles.circleChecked}>
                                <Ionicons
                                    name="checkmark"
                                    color={backgroundColor}
                                    size={20}
                                />
                            </View>
                        ) : (
                            <View
                                style={{
                                    ...styles.circleUnChecked,
                                    backgroundColor: backgroundColor,
                                }}
                            />
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={1}
                    onPress={setDarkTheme}
                >
                    <Text style={{ color: textColor, ...styles.themeName }}>
                        Tối
                    </Text>
                    <TouchableOpacity
                        onPress={setDarkTheme}
                        style={styles.circle}
                    >
                        {!isLightTheme ? (
                            <View style={styles.circleChecked}>
                                <Ionicons
                                    name="checkmark"
                                    color={backgroundColor}
                                    size={20}
                                />
                            </View>
                        ) : (
                            <View
                                style={{
                                    ...styles.circleUnChecked,
                                    backgroundColor: backgroundColor,
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
    circle: {
        height: 25,
        width: 25,
        backgroundColor: "gray",
        borderRadius: 25 / 2,
        justifyContent: "center",
        alignItems: "center",
    },
    circleChecked: {
        height: 25,
        width: 25,
        backgroundColor: "#0097f6",
        borderRadius: 25 / 2,
        justifyContent: "center",
        alignItems: "center",
    },
    circleUnChecked: {
        height: 22,
        width: 22,

        borderRadius: 22 / 2,
    },
    themeName: {
        fontWeight: "500",
        fontSize: 16,
    },
});
