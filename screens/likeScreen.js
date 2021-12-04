import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import useTheme from "../service/useTheme";

import { db } from "../firebase";
const LikeScreen = ({ navigation, route }) => {
    const [list, setList] = React.useState([]);

    const [loading, setLoading] = React.useState(true);

    const { data } = route.params;

    const { textColor, backgroundColor, isLightTheme } = useTheme();

    const getUserList = () => {
        db.collection("users")
            .where("uid", "in", data)
            .get()
            .then((snapshot) => {
                let data = snapshot.docs.map((doc) => {
                    let id = doc.id;
                    let user = doc.data();
                    return { id, ...user };
                });
                setList(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    };

    React.useEffect(() => {
        getUserList();
    }, []);

    return (
        <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
            <View style={{ ...styles.headerWrapper }}>
                <TouchableOpacity
                    style={styles.icon}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Ionicons name="arrow-back" size={28} color={textColor} />
                </TouchableOpacity>
                <Text style={{ ...styles.title, color: textColor }}>
                    Lượt thích
                </Text>
            </View>
            <View style={styles.scroll}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AntDesign
                        name="search1"
                        size={20}
                        color="#ababab"
                        style={{
                            position: "absolute",
                            zIndex: 2,
                            top: 10,
                            left: 10,
                        }}
                    />
                    <TextInput
                        placeholder="Tìm kiếm"
                        placeholderTextColor="#ababab"
                        style={{
                            height: 40,
                            width: "80%",
                            borderRadius: 15,
                            paddingLeft: 40,
                            backgroundColor: isLightTheme
                                ? "#efefef"
                                : "#262626",
                            fontWeight: "bold",
                            color: textColor,
                            position: "relative",
                            flex: 1,
                        }}
                        placeholder="Tìm kiếm..."
                        placeholderTextColor={isLightTheme ? "#ccc" : "#494949"}
                    />
                </View>
                {loading ? (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: "90%",
                        }}
                    >
                        <ActivityIndicator size="large" color="gray" />
                    </View>
                ) : (
                    <FlatList
                        data={list}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    marginTop: 15,
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    source={{ uri: item.photoURL }}
                                    style={{
                                        width: 55,
                                        height: 55,
                                        borderRadius: 70 / 2,
                                        borderWidth: 0.5,
                                        borderColor: "#ccc",
                                    }}
                                />
                                <View style={{ marginLeft: 15 }}>
                                    <Text style={{ color: textColor }}>
                                        {item.displayName}
                                    </Text>
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            color: "gray",
                                        }}
                                    >
                                        {item.fullname}
                                    </Text>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

export default LikeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        marginHorizontal: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    searchInput: {
        height: 40,
        backgroundColor: "#efefef",
        marginTop: 10,
        borderRadius: 15,
        paddingLeft: 50,
        flex: 1,
        position: "relative",
    },
    scroll: {
        marginHorizontal: 15,
        marginTop: 10,
    },
});
