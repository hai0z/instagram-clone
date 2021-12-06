import React, { useCallback, useLayoutEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";

import { AuthContext } from "../context/AuthProvider";

import { GiftedChat } from "react-native-gifted-chat";

const ChatWindow = ({ navigation, route }) => {
    const { data } = route.params;

    const { user } = React.useContext(AuthContext);

    const [follower, setFollower] = React.useState([]);

    const [post, setPost] = React.useState([]);

    const listRef = React.useRef(null);

    const [messages, setMessages] = React.useState([]);
    const getFollower = () => {
        db.collection("follow")
            .doc(data.uid)
            .collection("userFollower")
            .get()
            .then((res) => {
                const follower = res.docs.map((doc) => {
                    return doc.id;
                });
                setFollower(follower);
            });
    };

    const getPost = () => {
        db.collection("posts")
            .where("own.uid", "==", data.uid)
            .onSnapshot((querySnapshot) => {
                let postId = querySnapshot.docs.map((doc) => {
                    return doc.id;
                });
                setPost(postId);
            });
    };

    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
        );
        const { _id, createdAt, text, user } = messages[0];

        db.collection("messages")
            .doc(auth.currentUser.uid)
            .collection(data.uid)
            .add({ _id, createdAt, text, user });

        db.collection("messages")
            .doc(data.uid)
            .collection(auth.currentUser.uid)
            .add({ _id, createdAt, text, user });
    }, []);

    React.useLayoutEffect(() => {
        const unsubcrible = db
            .collection("messages")
            .doc(auth.currentUser.uid)
            .collection(data.uid)
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) =>
                setMessages(
                    snapshot.docs.map((doc) => ({
                        _id: doc.data()._id,
                        createdAt: doc.data().createdAt.toDate(),
                        text: doc.data().text,
                        user: doc.data().user,
                    }))
                )
            );
        return () => {
            unsubcrible();
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <Image source={{ uri: data.photoURL }} style={styles.avatar} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.displayName}>{data.displayName}</Text>
                    {data.fullname ? (
                        <Text style={styles.fullname}>{data.fullname}</Text>
                    ) : (
                        <></>
                    )}
                </View>
                <Ionicons
                    name="call-outline"
                    size={28}
                    color="black"
                    style={{
                        ...styles.icon,
                        marginLeft: "auto",
                        transform: [{ rotate: "270deg" }],
                    }}
                />
                <Ionicons
                    name="videocam-outline"
                    size={28}
                    color="black"
                    style={styles.icon}
                />
            </View>

            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{ avatar: user?.photoURL, _id: user.uid }}
            />
        </View>
    );
};

export default ChatWindow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 15,
    },
    displayName: {
        fontWeight: "bold",
    },
    fullname: {
        color: "gray",
        fontSize: 11,
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        borderColor: "#ccc",
        borderWidth: 0.5,
        marginLeft: 10,
    },
    icon: {
        marginLeft: 10,
        padding: 5,
    },
    listHeader: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
    },
    headerAvatar: {
        height: 120,
        width: 120,
        borderRadius: 120 / 2,
        borderColor: "#ccc",
        borderWidth: 0.5,
    },
    txt: {
        fontSize: 16,
        color: "gray",
    },
    btn: {
        height: 30,
        width: 140,
        borderColor: "#ccc",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7,
        marginTop: 7,
    },
    input: {
        width: "90%",
        height: 50,
        borderRadius: 25,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        position: "relative",
    },
    foodter: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
});
