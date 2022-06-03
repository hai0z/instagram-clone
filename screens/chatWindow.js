import React, { useCallback } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";

import { AuthContext } from "../context/AuthProvider";

import { GiftedChat, InputToolbar, Composer } from "react-native-gifted-chat";

import useTheme from "../service/useTheme";

const RenderInputToolbar = (props) => {
    const { isLightTheme } = useTheme();
    return (
        <InputToolbar
            {...props}
            containerStyle={{
                backgroundColor: isLightTheme ? "#fff" : "#000",
                paddingTop: 6,
            }}
            primaryStyle={{ alignItems: "center" }}
        />
    );
};

const RenderComposer = (props) => {
    const { isLightTheme } = useTheme();
    return (
        <Composer
            {...props}
            textInputStyle={{
                color: isLightTheme ? "#000" : "#fff",
                borderRadius: 5,
                borderColor: "#E4E9F2",
                paddingTop: 8.5,
                paddingHorizontal: 12,
                marginLeft: 0,
            }}
        />
    );
};

const ChatWindow = ({ navigation, route }) => {
    const { data } = route.params;

    const { user } = React.useContext(AuthContext);

    const { textColor, backgroundColor } = useTheme();

    const [messages, setMessages] = React.useState([]);

    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
        );
        const { _id, createdAt, text, user } = messages[0];

        db.collection("messages")
            .doc(auth.currentUser.uid)
            .collection(data.uid)
            .add({ _id, createdAt, text, user, sent: true });

        db.collection("messages")
            .doc(data.uid)
            .collection(auth.currentUser.uid)
            .add({ _id, createdAt, text, user, seen: false });
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
        return () => unsubcrible;
    }, []);

    return (
        <View style={{ ...styles.container, backgroundColor }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color={textColor} />
                </TouchableOpacity>
                <Image source={{ uri: data.photoURL }} style={styles.avatar} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ ...styles.displayName, color: textColor }}>
                        {data.displayName}
                    </Text>
                    {data.fullname ? (
                        <Text style={styles.fullname}>{data.fullname}</Text>
                    ) : (
                        <></>
                    )}
                </View>
                <Ionicons
                    name="call-outline"
                    size={28}
                    color={textColor}
                    style={{
                        ...styles.icon,
                        marginLeft: "auto",
                        transform: [{ rotate: "270deg" }],
                    }}
                />
                <Ionicons
                    name="videocam-outline"
                    size={28}
                    color={textColor}
                    style={styles.icon}
                />
            </View>

            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{ avatar: user?.photoURL, _id: user?.uid }}
                alwaysShowSend={true}
                renderInputToolbar={(props) => (
                    <RenderInputToolbar {...props} />
                )}
                renderComposer={(props) => <RenderComposer {...props} />}
                placeholder="Nhắn tin..."
                infiniteScroll
            />
        </View>
    );
};

export default ChatWindow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
