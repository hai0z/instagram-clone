import React from "react";

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ActivityIndicator,
    ScrollView,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthProvider";

let width = Dimensions.get("window").width;

const Comment = ({ navigation, route }) => {
    const { data } = route.params;
    const { user } = React.useContext(AuthContext);

    const [listComment, setListComment] = React.useState([]);
    const [commentValue, setCommentValue] = React.useState("");

    const [loading, setLoading] = React.useState(true);

    const postRef = db.collection("posts").doc(data.id);

    const { textColor, backgroundColor, isLightTheme } = useTheme();

    const getComment = () => {
        postRef.onSnapshot((doc) => {
            const { comment } = doc.data();
            setListComment(comment);
            setLoading(false);
        });
    };
    React.useEffect(() => {
        getComment();
    }, []);

    const changeText = React.useCallback((e) => {
        setCommentValue(e);
    }, []);

    const postComment = () => {
        postRef.get().then((doc) => {
            const { comment } = doc.data();
            postRef
                .update({
                    comment: [
                        ...comment,
                        {
                            displayName: user.displayName,
                            comment: commentValue,
                            photoURL: user.photoURL,
                        },
                    ],
                })
                .then(() => console.log("ok"));
        });
        setCommentValue("");
    };
    return (
        <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
            <View style={styles.headerWrapper}>
                <TouchableOpacity
                    style={styles.icon}
                    onPress={() => {
                        navigation.goBack();
                        setListComment([]);
                    }}
                >
                    <Ionicons name="arrow-back" size={28} color={textColor} />
                </TouchableOpacity>
                <Text style={{ ...styles.comment, color: textColor }}>
                    Bình luận
                </Text>
                <Feather
                    name="send"
                    color={textColor}
                    size={22}
                    style={{ ...styles.icon, marginLeft: "auto" }}
                />
            </View>
            <ScrollView>
                <View
                    style={{
                        ...styles.content,
                        borderBottomColor: isLightTheme ? "#bbb" : "#494949",
                    }}
                >
                    <Image
                        source={{ uri: data.own.photoURL }}
                        style={{
                            marginHorizontal: 10,
                            height: 35,
                            width: 35,
                            borderRadius: 35 / 2,
                        }}
                    />
                    <View style={{ justifyContent: "center" }}>
                        <Text style={{ width: width * 0.75 }}>
                            <Text
                                style={{ fontWeight: "bold", color: textColor }}
                            >
                                {" "}
                                {data.own.displayName}
                            </Text>
                            <Text style={{ color: textColor }}>
                                {" "}
                                {data.caption}
                            </Text>
                        </Text>
                    </View>
                </View>
                {loading ? (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <ActivityIndicator size="large" color="gray" />
                    </View>
                ) : (
                    <View>
                        {listComment?.map((item, index) => {
                            return (
                                <View key={index}>
                                    <View
                                        style={{
                                            alignItems: "center",
                                            flexDirection: "row",
                                            marginTop: 10,
                                            marginBottom: 20,
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Image
                                            source={{ uri: item?.photoURL }}
                                            style={styles.avatar}
                                        />
                                        <View>
                                            <Text
                                                style={{ width: width * 0.75 }}
                                            >
                                                <Text
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: textColor,
                                                    }}
                                                >
                                                    {item?.displayName}
                                                </Text>
                                                <Text
                                                    style={{ color: textColor }}
                                                >
                                                    {" "}
                                                    {item?.comment}
                                                </Text>
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    marginTop: 5,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontWeight: "500",
                                                        color: "gray",
                                                        marginRight: 10,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    vừa xong
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontWeight: "500",
                                                        color: "gray",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    Trả lời
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                marginLeft: "auto",
                                                marginRight: 10,
                                            }}
                                        >
                                            <TouchableOpacity>
                                                <AntDesign
                                                    name="hearto"
                                                    size={14}
                                                    color="gray"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
            <View
                style={{
                    justifyContent: "flex-end",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTopColor: isLightTheme ? "#bbb" : "#494949",
                        borderTopWidth: 0.5,
                        padding: 15,
                    }}
                >
                    <Image
                        source={{ uri: user.photoURL }}
                        style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                    />
                    <TextInput
                        placeholder="Thêm bình luận "
                        style={{
                            marginLeft: 5,
                            color: isLightTheme ? "#000" : "#fff",
                        }}
                        value={commentValue}
                        onChangeText={changeText}
                        placeholderTextColor={isLightTheme ? "#ccc" : "#bbb"}
                    />
                    <TouchableOpacity
                        disabled={commentValue.trim().length <= 0}
                        style={{ marginLeft: "auto" }}
                        onPress={() => postComment()}
                    >
                        <Text
                            style={{
                                color: "#0084fb",
                                opacity:
                                    commentValue.trim().length <= 0 ? 0.5 : 1,
                            }}
                        >
                            Đăng
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Comment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    comment: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
    },
    icon: {
        marginHorizontal: 15,
    },
    avatar: {
        height: 35,
        width: 35,
        borderRadius: 35 / 2,
        marginHorizontal: 15,
        borderWidth: 0.5,
        borderColor: "#ccc",
    },
    content: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        padding: 5,
    },
});
