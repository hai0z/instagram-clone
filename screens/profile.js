import React, { useContext, useState } from "react";
import PeopleDiscover from "../components/peopleDiscover";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    LogBox,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";
import { auth, db } from "../firebase";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { ModalContext } from "../context/ModalProvider";

import ImageModal from "../components/imagePreview";

import SettingModal from "../components/settingModal";

const Tab = createMaterialTopTabNavigator();

let width = Dimensions.get("window").width;
let imgWidth = width / 3.05;

const MyTabs = () => {
    const { theme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;
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
            <Tab.Screen name="Lib" component={Library} options={{}} />
            <Tab.Screen name="Tag" component={My} />
        </Tab.Navigator>
    );
};

const Library = ({ navigation }) => {
    const { userPost } = useContext(AuthContext);
    const { showModal, setShowModal } = useContext(ModalContext);
    const [imgView, setImgView] = useState(null);
    const [owner, setOwner] = useState(null);

    const { theme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;

    function onOpen(url, owner) {
        setShowModal(true);
        setImgView(url);
        setOwner(owner);
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
                                onPressOut={() => setShowModal(false)}
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
const My = () => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>
                Chưa có bài viết
            </Text>
        </View>
    );
};

const Profile = ({ navigation }) => {
    LogBox.ignoreLogs(["Setting a timer"]);

    const [showDiscover, setShowDiscover] = useState(false);

    const { theme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;

    const { user, setUserUid } = useContext(AuthContext);
    const [totalPost, setTotalPost] = React.useState([]);
    const [follower, setFollower] = React.useState([]);
    const [following, setFollowing] = React.useState([]);

    const [modalVisible, setModalVisible] = React.useState(false);

    React.useEffect(() => {
        db.collection("posts")
            .where("own.uid", "==", auth.currentUser.uid)
            .onSnapshot((querySnapshot) => {
                let postId = querySnapshot.docs.map((doc) => {
                    let id = doc.id;
                    return id;
                });
                setTotalPost(postId);
            });
        db.collection("follow")
            .doc(auth.currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((querySnapshot) => {
                const following = querySnapshot.docs.map((doc) => {
                    let id = doc.id;
                    return id;
                });
                setFollowing(
                    following.filter((uid) => uid !== auth.currentUser.uid)
                );
            });
        db.collection("follow")
            .doc(auth.currentUser.uid)
            .collection("userFollower")
            .onSnapshot((querySnapshot) => {
                const follower = querySnapshot.docs.map((doc) => {
                    let id = doc.id;
                    return id;
                });
                setFollower(follower);
            });
    }, []);
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: backgroundColor,
            }}
        >
            <View style={styles.header}>
                <Text style={{ ...styles.txtusername, color: textColor }}>
                    {user?.displayName}
                </Text>
                <AntDesign
                    name="down"
                    color={textColor}
                    size={15}
                    style={styles.downBtn}
                />
                <TouchableOpacity
                    onPress={() => navigation.navigate("AddPost")}
                    style={{ ...styles.icon, marginLeft: "auto" }}
                >
                    <Octicons name="diff-added" size={24} color={textColor} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ ...styles.icon }}
                    onPress={() => setModalVisible(true)}
                >
                    <Feather name="menu" size={24} color={textColor} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.top}>
                    <Image
                        source={{ uri: user.photoURL }}
                        style={styles.avatart}
                    />
                    <View>
                        <Text style={{ ...styles.txtTop, color: textColor }}>
                            {totalPost.length}
                        </Text>
                        <Text style={{ ...styles.txtdes, color: textColor }}>
                            Bài viết
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setUserUid(auth.currentUser.uid);
                            navigation.navigate("ViewFollower", {
                                data: {
                                    displayName: user.displayName,
                                    follower: follower.length,
                                    following: following.length,
                                    routeName: "Follower",
                                },
                            });
                        }}
                    >
                        <Text style={{ ...styles.txtTop, color: textColor }}>
                            {follower.length}
                        </Text>
                        <Text style={{ ...styles.txtdes, color: textColor }}>
                            Người theo...
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setUserUid(auth.currentUser.uid);
                            navigation.navigate("ViewFollower", {
                                data: {
                                    displayName: user.displayName,
                                    follower: follower.length,
                                    following: following.length,
                                    routeName: "Following",
                                },
                            });
                        }}
                    >
                        <Text style={{ ...styles.txtTop, color: textColor }}>
                            {following.length}
                        </Text>
                        <Text style={{ ...styles.txtdes, color: textColor }}>
                            Đang theo...
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.info}>
                    <Text style={{ fontWeight: "bold", color: textColor }}>
                        {user?.fullname}
                    </Text>
                    <Text style={{ color: textColor }}>{user?.signature}</Text>
                </View>
                <View style={styles.btnGroup}>
                    <TouchableOpacity
                        style={styles.editProfileBtn}
                        onPress={() => navigation.navigate("EditProfile")}
                    >
                        <Text style={{ fontWeight: "bold", color: textColor }}>
                            Chỉnh sửa trang cá nhân
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnMore}
                        onPress={() => setShowDiscover(!showDiscover)}
                    >
                        <AntDesign name="down" size={20} color={textColor} />
                    </TouchableOpacity>
                </View>
                {showDiscover && <PeopleDiscover />}
                <View style={{ marginTop: 20 }}>
                    <MyTabs navigation={navigation} />
                </View>
                <SettingModal
                    onClose={() => setModalVisible(false)}
                    goSetting={() => {
                        setModalVisible(false);
                        navigation.navigate("Setting");
                    }}
                    modalVisible={modalVisible}
                />
            </ScrollView>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 15,
    },
    txtusername: {
        fontSize: 22,
        fontWeight: "bold",
    },
    icon: {
        marginHorizontal: 10,
    },
    avatart: {
        height: 90,
        width: 90,
        borderRadius: 90 / 2,
        borderWidth: 0.5,
        borderColor: "#ccc",
    },
    top: {
        marginHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
    },
    txtTop: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
    },
    txtdes: {
        fontSize: 13,
        color: "#404040",
    },
    info: {
        marginHorizontal: 15,
        marginTop: 10,
    },
    btnGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 15,
        marginTop: 20,
    },
    editProfileBtn: {
        flexGrow: 1.2,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7,
        borderColor: "#ddd",
        borderWidth: 1.3,
    },
    btnMore: {
        flexGrow: 0.1,
        padding: 2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7,
        borderColor: "#ddd",
        borderWidth: 1.3,
        marginLeft: 10,
    },
    downBtn: {
        marginTop: 7,
        marginLeft: 4,
    },
});
