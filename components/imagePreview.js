import React, { useContext } from "react";

import { Modal, StyleSheet, Text, View, Image, Dimensions } from "react-native";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;
import * as Animatable from "react-native-animatable";

import { BlurView } from "expo-blur";

import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeProvider";

const ImgaeModal = ({ modalVisible, img, owner }) => {
    const { theme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <BlurView
                    intensity={100}
                    tint={isLightTheme ? "light" : "dark"}
                    style={styles.centeredView}
                >
                    <Animatable.View
                        style={{
                            ...styles.modalView,
                            backgroundColor: isLightTheme
                                ? "#efefef"
                                : "#262626",
                            shadowColor: textColor,
                        }}
                        animation="zoomIn"
                        duration={250}
                        easing="linear"
                    >
                        <View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginHorizontal: 10,
                                    marginBottom: 10,
                                }}
                            >
                                <Image
                                    source={{ uri: owner?.photoURL }}
                                    style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: 35 / 2,
                                        marginRight: 5,
                                    }}
                                />
                                <Text style={{ color: textColor }}>
                                    {owner?.displayName}
                                </Text>
                            </View>
                            <Image
                                resizeMode="cover"
                                source={{ uri: img }}
                                style={{
                                    width: width - 15,
                                    height: height / 2.25,
                                    marginTop: 5,
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "100%",
                                marginTop: 10,
                            }}
                        >
                            <AntDesign
                                name="hearto"
                                size={24}
                                color={textColor}
                            />
                            <Feather
                                name="message-circle"
                                size={28}
                                color={textColor}
                            />
                            <Feather name="send" size={24} color={textColor} />
                        </View>
                    </Animatable.View>
                </BlurView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: width - 10,

        borderRadius: 20,
        alignItems: "center",

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 20,
        position: "relative",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default ImgaeModal;
