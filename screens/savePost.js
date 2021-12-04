import React, { useState, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Keyboard,
} from "react-native";

import firebase from "firebase";
import { storage, auth, db } from "../firebase";
import { AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthProvider";
import useTheme from "../service/useTheme";

const SavePost = ({ navigation, route }) => {
    const { user } = React.useContext(AuthContext);

    const [caption, setCaption] = useState("");

    const { image } = route.params;

    const [loading, setLoading] = React.useState(false);

    const { textColor, backgroundColor, isLightTheme } = useTheme();

    const uploadImage = async () => {
        setLoading(true);
        Keyboard.dismiss();
        const response = await fetch(image);
        const blob = await response.blob();
        const childPath = `posts/${
            auth.currentUser.uid
        }/${Math.random().toString(36)}`;

        const task = storage.ref().child(childPath).put(blob);

        const taskComple = () => {
            task.snapshot.ref
                .getDownloadURL()
                .then((link) => {
                    savePostData(link);
                    setLoading(false);
                    navigation.popToTop();
                })
                .catch((err) => console.log(err));
        };
        const taskErr = (snapshot) => {
            console.log(snapshot);
        };
        const taskProgress = () => {
            console.log("ok");
        };
        task.on("state_changed", taskProgress, taskErr, taskComple);
    };

    const savePostData = (url) => {
        db.collection("posts")
            .add({
                url,
                caption,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                own: user,
                like: [],
                comment: [],
            })
            .then(() => console.log("ok"));
    };
    const changeText = React.useCallback((caption) => {
        setCaption(caption);
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: backgroundColor }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 10,
                    height: 40,
                    justifyContent: "space-between",
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="close" size={28} color={textColor} />
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginLeft: 20,
                        color: textColor,
                    }}
                >
                    Bài viết mới
                </Text>
                <TouchableOpacity
                    onPress={() => uploadImage()}
                    style={{ marginLeft: "auto" }}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#0097f6" />
                    ) : (
                        <AntDesign name="check" size={28} color="#0097f6" />
                    )}
                </TouchableOpacity>
            </View>
            <View
                style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    marginHorizontal: 10,
                    marginTop: 30,
                    borderBottomColor: isLightTheme ? "#efefef" : "#262626",
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                }}
            >
                {image && (
                    <Image
                        source={{ uri: image }}
                        style={{ width: 100, height: 100 }}
                    />
                )}
                <TextInput
                    placeholder="nhập nội dung"
                    style={{ ...styles.input, color: textColor }}
                    value={caption}
                    onChangeText={changeText}
                    placeholderTextColor="gray"
                />
            </View>
        </View>
    );
};

export default SavePost;

const styles = StyleSheet.create({
    input: {
        height: 30,
        width: "90%",
        marginLeft: 10,
    },
});
