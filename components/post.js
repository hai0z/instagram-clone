import React, { useContext } from "react";
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    Dimensions,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { formatDistance } from "date-fns";
import vi from "date-fns/locale/vi";

import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;

import { db, auth } from "../firebase";
import firebase from "firebase";

const Post = ({ navigation }) => {
    const { followingPost, setUserUid } = useContext(AuthContext);

    const [listPost, setListPost] = React.useState([]);

    const { theme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;

    React.useEffect(() => {
        setListPost(followingPost);
    }, [followingPost]);

    const likePost = (postId, userId) => {
        let postRef = db.collection("posts").doc(postId);

        let nofiRef = null;

        if (userId !== auth.currentUser.uid) {
            nofiRef = db
                .collection("nofication")
                .doc(userId)
                .collection("userNofication");
        }

        postRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const { like } = doc.data();
                    if (like.includes(auth.currentUser.uid)) {
                        postRef.update({
                            like: firebase.firestore.FieldValue.arrayRemove(
                                auth.currentUser.uid
                            ),
                        });
                    } else {
                        postRef.update({
                            like: firebase.firestore.FieldValue.arrayUnion(
                                auth.currentUser.uid
                            ),
                        });
                    }
                }
            })
            .catch((err) => console.log(err));
    };

    function formatDate(seconds) {
        let formattedDate = "";

        if (seconds) {
            formattedDate = formatDistance(
                new Date(seconds * 1000),
                new Date(),
                {
                    locale: vi,
                }
            );

            formattedDate =
                formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }

        return formattedDate;
    }
    return (
        <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
            {listPost.length <= 0 ? (
                <View
                    style={{
                        height: height - 250,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            width: "75%",
                            textAlign: "center",
                            fontSize: 18,
                            color: textColor,
                            fontWeight: "bold",
                        }}
                    >
                        Chưa có bài viết nào theo dõi để xem thêm bài viết
                    </Text>
                </View>
            ) : (
                <View>
                    {listPost.map((item) => {
                        return (
                            <View style={{ marginBottom: 10 }} key={item.id}>
                                <View style={styles.postHeader}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            setUserUid(item.own.uid);
                                            navigation.navigate("OtherProfile");
                                        }}
                                    >
                                        <Image
                                            source={{ uri: item?.own.photoURL }}
                                            style={styles.avatar}
                                        />
                                    </TouchableOpacity>
                                    <View style={styles.info}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => {
                                                setUserUid(item.own.uid);
                                                navigation.navigate(
                                                    "OtherProfile"
                                                );
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    ...styles.txtName,
                                                    color: textColor,
                                                }}
                                            >
                                                {item?.own.displayName}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Feather
                                        name="more-vertical"
                                        size={24}
                                        color={textColor}
                                        style={{ marginLeft: "auto" }}
                                    />
                                </View>

                                <Image
                                    source={{ uri: item.url }}
                                    style={styles.postImage}
                                />

                                <View style={styles.react}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            likePost(item.id, item.own.uid);
                                        }}
                                    >
                                        {item?.like.includes(
                                            auth?.currentUser?.uid
                                        ) ? (
                                            <AntDesign
                                                name="heart"
                                                size={26}
                                                color="red"
                                                style={{
                                                    ...styles.reactIcon,
                                                    transform: [
                                                        {
                                                            scale:
                                                                item.like > 0
                                                                    ? 1.1
                                                                    : 1,
                                                        },
                                                    ],
                                                }}
                                            />
                                        ) : (
                                            <AntDesign
                                                name="hearto"
                                                size={26}
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
                                            size={26}
                                            color={textColor}
                                        />
                                    </TouchableOpacity>

                                    <Feather
                                        name="send"
                                        size={26}
                                        color={textColor}
                                        style={styles.reactIcon}
                                    />

                                    <TouchableOpacity
                                        style={{
                                            ...styles.reactIcon,
                                            marginLeft: "auto",
                                        }}
                                    >
                                        <FontAwesome
                                            name="bookmark-o"
                                            size={24}
                                            color={textColor}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.content}>
                                    {item.like.length > 0 ? (
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() =>
                                                navigation.navigate("Like", {
                                                    data: item.like,
                                                })
                                            }
                                        >
                                            <Text
                                                style={{
                                                    ...styles.txtLike,
                                                    color: textColor,
                                                }}
                                            >
                                                {item.like.length} lượt thích
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <></>
                                    )}
                                    {item.caption.trim().length > 0 ? (
                                        <View style={{ flexDirection: "row" }}>
                                            <Text
                                                style={{
                                                    fontWeight: "bold",
                                                    color: textColor,
                                                }}
                                            >
                                                {item.own.displayName}
                                            </Text>
                                            <Text style={{ color: textColor }}>
                                                {" "}
                                                {item.caption}
                                            </Text>
                                        </View>
                                    ) : (
                                        <></>
                                    )}
                                    {item.comment.length > 0 ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                navigation.navigate("Comment", {
                                                    data: item,
                                                });
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "gray",
                                                    marginTop: 7,
                                                }}
                                            >
                                                Xem tất cả {item.comment.length}{" "}
                                                bình luận
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <></>
                                    )}
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: "gray",
                                            marginTop: 7,
                                        }}
                                    >
                                        {formatDate(item.createdAt?.seconds)}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

export default Post;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: "#ccc",
    },
    postHeader: {
        marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    txtName: {
        fontWeight: "bold",
    },
    info: {
        marginHorizontal: 10,
        justifyContent: "center",
    },
    des: {
        fontSize: 12,
        textAlign: "left",
        color: "grey",
    },
    postImage: {
        resizeMode: "cover",
        marginTop: 5,
        flex: 1,
        height: width,
    },
    react: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 7,
        marginHorizontal: 5,
    },
    reactIcon: {
        marginHorizontal: 10,
        fontWeight: "bold",
    },
    content: {
        marginHorizontal: 15,
        marginTop: 7,
    },
    txtLike: {
        fontWeight: "bold",
    },
    addToCollection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        width,
        bottom: 0,
        backgroundColor: "#f9f9f9",
    },
    collectionImg: {
        width: 40,
        height: 40,
        marginHorizontal: 10,
        marginVertical: 5,
    },
});
