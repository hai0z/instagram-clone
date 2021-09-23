import React, { useState, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Dimensions,
} from "react-native";
const width = Dimensions.get("window").width;

import { AntDesign } from "@expo/vector-icons";

import { auth, db, storage } from "../firebase";

import * as ImagePicker from "expo-image-picker";
import { ThemeContext } from "../context/ThemeProvider";

const UserEditor = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState({});

    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");

    const [signature, setSignature] = useState("");

    const [loading, setLoading] = useState(true);

    const [saveLoading, setSaveLoading] = useState(false);

    const [image, setImage] = useState(null);

    const { theme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;

    React.useEffect(() => {
        db.collection("users")
            .doc(auth.currentUser.uid)
            .get()
            .then((res) => {
                const { displayName, fullname, signature } = res.data();
                setName(fullname);
                setUserName(displayName);
                setSignature(signature);
                setUserInfo(res.data());
                setLoading(false);
            });
    }, []);
    const onOk = () => {
        setSaveLoading(true);
        db.collection("users")
            .doc(auth.currentUser.uid)
            .update({
                displayName: userName,
                fullname: name,
                signature,
            })
            .then(() => {
                db.collection("users")
                    .doc(auth.currentUser.uid)
                    .get()
                    .then((res) => {
                        db.collection("posts")
                            .where("own.uid", "==", auth.currentUser.uid)
                            .get()
                            .then((doc) => {
                                const post = doc.docs.map((doc) => {
                                    const id = doc.id;
                                    return id;
                                });
                                post.length >= 1
                                    ? post.forEach((el) => {
                                          db.collection("posts")
                                              .doc(el)
                                              .update({
                                                  own: res.data(),
                                              })
                                              .then(() => {
                                                  setSaveLoading(false);
                                                  navigation.navigate(
                                                      "Profile"
                                                  );
                                              });
                                      })
                                    : setSaveLoading(false);
                                navigation.navigate("Profile");
                            });
                    });
            });
    };
    React.useEffect(() => {
        (async () => {
            const galleyStatus =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (galleyStatus.status !== "granted") {
                alert(
                    "Sorry, we need camera roll permissions to make this work!"
                );
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.4,
        });
        setImage(result.uri);
    };

    const changeAvatar = async () => {
        setSaveLoading(true);
        const response = await fetch(image);
        const blob = await response.blob();
        const childPath = `avatar/${
            auth.currentUser.uid
        }/${Math.random().toString(36)}`;
        const task = storage.ref().child(childPath).put(blob);

        const taskComple = () => {
            task.snapshot.ref
                .getDownloadURL()
                .then((link) => {
                    db.collection("users").doc(auth.currentUser.uid).update({
                        photoURL: link,
                    });
                    db.collection("users")
                        .doc(auth.currentUser.uid)
                        .get()
                        .then((res) => {
                            db.collection("posts")
                                .where("own.uid", "==", auth.currentUser.uid)
                                .get()
                                .then((doc) => {
                                    const post = doc.docs.map((doc) => {
                                        const id = doc.id;
                                        return id;
                                    });
                                    post.length >= 1
                                        ? post.forEach((el) => {
                                              db.collection("posts")
                                                  .doc(el)
                                                  .update({
                                                      own: res.data(),
                                                  })
                                                  .then(() => {
                                                      setSaveLoading(false);
                                                      navigation.navigate(
                                                          "Profile"
                                                      );
                                                  });
                                          })
                                        : setSaveLoading(false);
                                    navigation.navigate("Profile");
                                });
                        });
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

    return (
        <View style={styles.container}>
            {image ? (
                <View style={{ flex: 1, backgroundColor: backgroundColor }}>
                    <View
                        style={{
                            ...styles.headerWrapper,
                            backgroundColor: backgroundColor,
                        }}
                    >
                        <TouchableOpacity onPress={() => setImage(null)}>
                            <AntDesign
                                name="close"
                                size={28}
                                color={textColor}
                            />
                        </TouchableOpacity>
                        <Text style={styles.textHeader}>Đổi ảnh đại diện</Text>
                        <TouchableOpacity
                            style={{ marginLeft: "auto" }}
                            onPress={changeAvatar}
                        >
                            {saveLoading ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#0097f6"
                                />
                            ) : (
                                <AntDesign
                                    name="check"
                                    size={28}
                                    color="#0084fb"
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Image
                            source={{ uri: image }}
                            style={{ width, height: width }}
                        />
                    </View>
                </View>
            ) : (
                <>
                    <View
                        style={{
                            ...styles.headerWrapper,
                            backgroundColor: backgroundColor,
                        }}
                    >
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign
                                name="close"
                                size={28}
                                color={textColor}
                            />
                        </TouchableOpacity>
                        <Text style={styles.textHeader}>
                            Chỉnh sửa trang cá nhân
                        </Text>
                        <TouchableOpacity
                            style={{ marginLeft: "auto" }}
                            onPress={onOk}
                        >
                            {saveLoading ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#0097f6"
                                />
                            ) : (
                                <AntDesign
                                    name="check"
                                    size={28}
                                    color="#0084fb"
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: backgroundColor,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <ActivityIndicator size="large" color="gray" />
                        </View>
                    ) : (
                        <View
                            style={{
                                ...styles.container,
                                backgroundColor: backgroundColor,
                            }}
                        >
                            <View style={styles.ImgWrapper}>
                                <Image
                                    source={{ uri: userInfo.photoURL }}
                                    style={styles.avatar}
                                />
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={pickImage}
                                >
                                    <Text style={styles.changeAvatar}>
                                        Đổi ảnh đại diện
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.profile}>
                                <View style={styles.hr}>
                                    <Text style={styles.txt}>Tên</Text>
                                    <TextInput
                                        style={{ color: textColor }}
                                        placeholderTextColor="#000"
                                        value={name}
                                        onChangeText={(e) => setName(e)}
                                    />
                                </View>
                                <View style={styles.hr}>
                                    <Text style={styles.txt}>
                                        Tên người dùng
                                    </Text>
                                    <TextInput
                                        style={{ color: textColor }}
                                        placeholderTextColor="#000"
                                        value={userName}
                                        onChangeText={(e) => setUserName(e)}
                                    />
                                </View>

                                <View style={styles.hr}>
                                    <Text style={styles.txt}>Tiểu sử</Text>
                                    <TextInput
                                        style={{ color: textColor }}
                                        value={signature}
                                        placeholderTextColor="gray"
                                        onChangeText={(e) => setSignature(e)}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.btnTxt}>
                                    Chuyển sang tài khoản công việc
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.btnTxt}>
                                    Cài đặt thông tin cá nhân
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centeredView: {
        flex: 1,
    },
    headerWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    textHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 20,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 110 / 2,
        borderColor: "#ccc",
        borderWidth: 0.5,
    },
    ImgWrapper: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    changeAvatar: {
        fontSize: 16,
        color: "#0084fb",
        marginTop: 10,
    },
    profile: {
        marginTop: 20,
        marginHorizontal: 15,
    },
    txt: {
        color: "gray",
        fontSize: 13,
        marginBottom: 10,
    },
    hr: {
        borderBottomWidth: 1,
        borderBottomColor: "#bbb",
        marginVertical: 10,
    },
    btn: {
        borderTopColor: "#bbb",
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderBottomColor: "#bbb",
        padding: 15,
        marginVertical: 10,
    },
    btnTxt: {
        color: "#0084fb",
    },
});

export default UserEditor;
