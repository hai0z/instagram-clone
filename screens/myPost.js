/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import firebase from "firebase";

const width = Dimensions.get("window").width;

import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";
import BottomSheet from "../components/bottomSheet";

export default function MyPost({ navigation, route }) {
    const { theme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;
    const { index } = route?.params || 0;

    const { userPost } = React.useContext(AuthContext);

    const postIndex = React.useRef();

    const [isVisible, setIsVisible] = React.useState(false);

    const [postId, setPostId] = React.useState("");

    const deletePost = () => {
        Alert.alert(
            "Thông báo",
            "Bạn có muốn xóa không",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => {
                        db.collection("posts").doc(postId).delete({});
                        setIsVisible(false);
                    },
                },
            ],
            {
                cancelable: true,
            }
        );
    };

    const likePost = (postId) => {
        const postRef = db.collection("posts").doc(postId);

        postRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const { like } = doc.data();
                    postRef.update({
                        like: like.includes(auth.currentUser.uid)
                            ? firebase.firestore.FieldValue.arrayRemove(
                                  auth.currentUser.uid
                              )
                            : firebase.firestore.FieldValue.arrayUnion(
                                  auth.currentUser.uid
                              ),
                    });
                }
            })
            .catch((err) => console.log(err));
    };

    React.useEffect(() => {
        postIndex.current.scrollTo({
            x: 0,
            y: index * width * 1.25,
            animated: true,
        });
    }, []);

    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: backgroundColor,
            }}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                >
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>
                <Text style={{ ...styles.textHeader, color: textColor }}>
                    Bài viết
                </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} ref={postIndex}>
                {userPost.map((item, index) => {
                    return (
                        <View key={index}>
                            <View>
                                <View style={styles.postHeader}>
                                    <Image
                                        style={styles.avatar}
                                        source={{ uri: item.own.photoURL }}
                                    />
                                    <Text
                                        style={{
                                            marginHorizontal: 10,
                                            fontWeight: "bold",
                                            color: textColor,
                                        }}
                                    >
                                        {item.own.displayName}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setIsVisible(true);
                                            setPostId(item.id);
                                        }}
                                        style={{
                                            marginLeft: "auto",
                                            marginRight: -5,
                                        }}
                                    >
                                        <Feather
                                            name="more-vertical"
                                            size={20}
                                            color={textColor}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.postWrapper}>
                                    <Image
                                        source={{
                                            uri: item.url,
                                        }}
                                        style={styles.postImg}
                                    />
                                    <View style={styles.icon}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                likePost(item.id);
                                            }}
                                        >
                                            {item?.like.includes(
                                                auth?.currentUser?.uid
                                            ) ? (
                                                <AntDesign
                                                    name="heart"
                                                    size={24}
                                                    color="red"
                                                    style={{
                                                        ...styles.reactIcon,
                                                        transform: [
                                                            {
                                                                scale:
                                                                    item.like >
                                                                    0
                                                                        ? 1.1
                                                                        : 1,
                                                            },
                                                        ],
                                                    }}
                                                />
                                            ) : (
                                                <AntDesign
                                                    name="hearto"
                                                    size={24}
                                                    color={textColor}
                                                    style={styles.reactIcon}
                                                />
                                            )}
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.reactIcon}
                                            onPress={() =>
                                                navigation.navigate("Comment", {
                                                    data: item,
                                                })
                                            }
                                        >
                                            <Feather
                                                name="message-circle"
                                                size={24}
                                                color={textColor}
                                            />
                                        </TouchableOpacity>

                                        <Feather
                                            name="send"
                                            size={24}
                                            color={textColor}
                                            style={styles.reactIcon}
                                        />

                                        <FontAwesome
                                            name="bookmark-o"
                                            size={24}
                                            color={textColor}
                                            style={{
                                                ...styles.reactIcon,
                                                marginLeft: "auto",
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
            <BottomSheet
                modalVisible={isVisible}
                onClose={() => setIsVisible(false)}
                onDelete={deletePost}
            />
            <View
                style={{
                    height: 15,
                    backgroundColor: backgroundColor,
                    width,
                    borderTopWidth: 0.5,
                    borderTopColor: isLightTheme ? "#ccc" : "#494949",
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 15,
    },
    textHeader: {
        fontSize: 22,
        fontWeight: "bold",
    },
    postHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 15,
        marginTop: 15,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 35 / 2,
    },
    postImg: {
        width,
        height: width,
    },
    postWrapper: {
        marginTop: 10,
    },
    icon: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 10,
        marginTop: 10,
    },
    reactIcon: {
        marginHorizontal: 10,
        fontWeight: "bold",
    },
    backBtn: {
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: -20,
    },
});
