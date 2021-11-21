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

import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthProvider";
import { auth, db } from "../firebase";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { ModalContext } from "../context/ModalProvider";
import { ThemeContext } from "../context/ThemeProvider";

import ImageModal from "../components/imagePreview";

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
            <Tab.Screen name="Lib" component={Library} />
            <Tab.Screen name="Tag" component={My} />
        </Tab.Navigator>
    );
};

const Library = ({ navigation }) => {
    const [userPostData, setUserPostData] = React.useState([]);

    const { showModal, setShowModal } = useContext(ModalContext);

    const [imgView, setImgView] = React.useState(null);

    const { userUid } = useContext(AuthContext);

    const [owner, setOwner] = useState(null);

    const { theme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;

    function onOpen(url, owner) {
        setShowModal(true);
        setImgView(url);
        setOwner(owner);
    }
    React.useEffect(() => {
        db.collection("posts")
            .where("own.uid", "==", userUid)
            .orderBy("createdAt", "desc")
            .onSnapshot((querySnapshot) => {
                let post = querySnapshot.docs.map((doc) => {
                    let data = doc.data();
                    let id = doc.id;
                    return { id, ...data };
                });
                setUserPostData(post);
            });
    }, []);
    return (
        <ScrollView>
            {userPostData.length <= 0 ? (
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
                            color: textColor,
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
                    {userPostData.map((item, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                onPressOut={() => setShowModal(false)}
                                onLongPress={() => onOpen(item.url, item.own)}
                                delayLongPress={200}
                                activeOpacity={1}
                                onPress={() =>
                                    navigation.navigate("OtherPost", { index })
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

    const [userProfile, setUserProfile] = useState({});
    const [showDiscover, setShowDiscover] = useState(false);

    const { showModal } = useContext(ModalContext);

    const { userUid, setUserUid } = useContext(AuthContext);

    const [isfollowing, setIsFollowing] = useState(false);

    const [totalPost, setTotalPost] = React.useState([]);
    const [follower, setFollower] = React.useState([]);
    const [following, setFollowing] = React.useState([]);

    const { theme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;

    const followHandler = () => {
        if (!isfollowing) {
            db.collection("follow")
                .doc(auth.currentUser.uid)
                .collection("userFollowing")
                .doc(userUid)
                .set({});
            db.collection("follow")
                .doc(userUid)
                .collection("userFollower")
                .doc(auth.currentUser.uid)
                .set({});
        } else {
            db.collection("follow")
                .doc(auth.currentUser.uid)
                .collection("userFollowing")
                .doc(userUid)
                .delete({});
            db.collection("follow")
                .doc(userUid)
                .collection("userFollower")
                .doc(auth.currentUser.uid)
                .delete({});
        }
    };

    React.useEffect(() => {
        db.collection("users")
            .doc(userUid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    setUserProfile(doc.data());
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
        db.collection("posts")
            .where("own.uid", "==", userUid)
            .onSnapshot((querySnapshot) => {
                let postId = querySnapshot.docs.map((doc) => {
                    let id = doc.id;
                    return id;
                });
                setTotalPost(postId);
            });
        db.collection("follow")
            .doc(userUid)
            .collection("userFollowing")
            .onSnapshot((querySnapshot) => {
                const following = querySnapshot.docs.map((doc) => {
                    let id = doc.id;
                    return id;
                });
                setFollowing(following.filter((uid) => uid !== userUid));
            });
        db.collection("follow")
            .doc(userUid)
            .collection("userFollower")
            .onSnapshot((querySnapshot) => {
                const follower = querySnapshot.docs.map((doc) => {
                    let id = doc.id;
                    return id;
                });
                setFollower(follower.filter((uid) => uid !== userUid));
            });
        check();
    }, []);
    const check = () => {
        db.collection("follow")
            .doc(auth.currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapShot) => {
                const result = snapShot.docs.map((doc) => {
                    return doc.id;
                });
                result.find((uid) => uid === userUid)
                    ? setIsFollowing(true)
                    : setIsFollowing(false);
            });
    };
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: backgroundColor,
            }}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color={textColor} />
                </TouchableOpacity>
                <Text style={{ ...styles.txtusername, color: textColor }}>
                    {userProfile?.displayName}
                </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.top}>
                    <Image
                        source={{ uri: userProfile.photoURL }}
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
                            setUserUid(userUid);
                            navigation.navigate("ViewFollower", {
                                data: {
                                    follower: follower.length,
                                    following: following.length,
                                    routeName: "Follower",
                                    displayName: userProfile.displayName,
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
                            setUserUid(userUid);
                            navigation.navigate("ViewFollower", {
                                data: {
                                    follower: follower.length,
                                    following: following.length,
                                    routeName: "Following",
                                    displayName: userProfile.displayName,
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
                        {userProfile?.fullname}
                    </Text>
                    <Text style={{ color: textColor }}>
                        {userProfile?.signature}
                    </Text>
                </View>
                <View style={styles.btnGroup}>
                    {userUid !== auth.currentUser.uid ? (
                        <TouchableOpacity
                            style={styles.editProfileBtn}
                            onPress={() => followHandler()}
                        >
                            <Text
                                style={{ fontWeight: "bold", color: textColor }}
                            >
                                {isfollowing ? "Đang theo dõi" : "Theo dõi"}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.editProfileBtn}>
                            <Text
                                style={{ fontWeight: "bold", color: textColor }}
                            >
                                Chỉnh sửa trang cá nhân
                            </Text>
                        </TouchableOpacity>
                    )}
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
            </ScrollView>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 15,
    },
    txtusername: {
        fontSize: 22,
        fontWeight: "bold",
        marginLeft: 20,
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
