import React, { useContext, useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from "react-native";

import ImageModal from "../../components/imagePreview";
import useTheme from "../../service/useTheme";
import { ModalContext } from "../../context/ModalProvider";
import { AuthContext } from "../../context/AuthProvider";

import { MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

let { width } = Dimensions.get("window");
let imgWidth = width / 3.05;

export default ProfileTab = () => {
    const { textColor, backgroundColor } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    let iconName;
                    if (route.name === "Lib") {
                        iconName = "collections";
                    } else if ((route.name = "Tag")) {
                        iconName = "tag";
                    }
                    return (
                        <MaterialIcons
                            name={iconName}
                            size={24}
                            color={color}
                        />
                    );
                },
            })}
            tabBarOptions={{
                showIcon: true,
                showLabel: false,
                indicatorStyle: {
                    height: 1.5,
                    backgroundColor: textColor,
                },
                style: { backgroundColor: backgroundColor },
                inactiveTintColor: "#606060",
                activeTintColor: textColor,
            }}
        >
            <Tab.Screen name="Lib" component={Library} />
            <Tab.Screen name="Tag" component={Tag} />
        </Tab.Navigator>
    );
};

const Library = ({ navigation }) => {
    const { userPost } = useContext(AuthContext);
    const { showModal, setShowModal } = useContext(ModalContext);
    const [imgView, setImgView] = useState(null);
    const [owner, setOwner] = useState(null);

    const { backgroundColor } = useTheme();

    function onOpen(url, owner) {
        setShowModal(true);
        setImgView(() => url);
        setOwner(() => owner);
    }

    return (
        <ScrollView>
            {userPost.length <= 0 ? (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: backgroundColor,
                        justifyContent: "center",
                        alignItems: "center",
                        width,
                        height: width,
                    }}
                >
                    <Text
                        style={{
                            color: "gray",
                            fontSize: 16,
                            fontWeight: "bold",
                        }}
                    >
                        Chưa có bài viết nào
                    </Text>
                </View>
            ) : (
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        backgroundColor: backgroundColor,
                        flex: 1,
                    }}
                >
                    {userPost.map((item, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                onPressOut={() => {
                                    setShowModal(false);
                                    setOwner(null);
                                    setImgView(null);
                                }}
                                onLongPress={() => onOpen(item.url, item.own)}
                                delayLongPress={200}
                                activeOpacity={1}
                                onPress={() =>
                                    navigation.navigate("MyPost", { index })
                                }
                            >
                                <Image
                                    style={{
                                        width: imgWidth,
                                        height: imgWidth,
                                        marginHorizontal: 1,
                                        marginVertical: 1,
                                    }}
                                    source={{
                                        uri: item.url,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}


            <ImageModal
                modalVisible={showModal}
                onClose={() => setShowModal(false)}
                img={imgView}
                owner={owner}
            />
        </ScrollView>
    );
};
const Tag = () => {
    const { textColor, backgroundColor } = useTheme();
    return (
        <View
            style={{
                flex: 1,
                backgroundColor,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text
                style={{ color: textColor, fontWeight: "bold", fontSize: 16 }}
            >
                Chưa có bài viết
            </Text>
        </View>
    );
};
