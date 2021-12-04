import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useTheme from "../service/useTheme";

const CustomCheckBox = ({ active, onPress }) => {
    const { backgroundColor } = useTheme();

    return (
        <TouchableOpacity onPress={onPress} style={styles.circle}>
            {active ? (
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
    );
};
const SelectTheme = ({ navigation }) => {
    const { theme, setTheme } = useContext(ThemeContext);

    const { textColor, backgroundColor, isLightTheme } = useTheme();

    const changeTheme = async (themeMode) => {
        setTheme({
            ...theme,
            isLightTheme: themeMode === "light" ? true : false,
        });
        await AsyncStorage.setItem(
            "theme",
            JSON.stringify({
                ...theme,
                isLightTheme: themeMode === "light" ? true : false,
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
                    onPress={() => changeTheme("light")}
                >
                    <Text style={{ color: textColor, ...styles.themeName }}>
                        Sáng
                    </Text>
                    <CustomCheckBox
                        active={isLightTheme}
                        onPress={() => changeTheme("light")}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={1}
                    onPress={() => changeTheme("dark")}
                >
                    <Text style={{ color: textColor, ...styles.themeName }}>
                        Tối
                    </Text>
                    <CustomCheckBox
                        active={!isLightTheme}
                        onPress={() => changeTheme("dark")}
                    />
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
