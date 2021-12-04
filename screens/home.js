import React from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Post from "../components/post";
import Header from "../components/header";

import { AuthContext } from "../context/AuthProvider";
import useTheme from "../service/useTheme";

export default function Home({ navigation }) {
    const data = [
        {
            img: require("../assets/1.jpg"),
            name: "Onichan",
            story: "https://2.bp.blogspot.com/-C8vnMOJVWRI/XIkaFbYfEcI/AAAAAAAAAgo/FIBvarQjNwwTVb5OPnpRhUjTU1lcnuQMwCKgBGAs/w1080-h1920-c/anime-scenery-sunset-uhdpaper.com-4K-112.jpg",
        },
        {
            img: require("../assets/3.jpg"),
            name: "Toshikeno",
            story: "https://i.pinimg.com/736x/01/81/21/018121559c03578445cb9f5db282cbd0.jpg",
        },
        {
            img: require("../assets/4.jpg"),
            name: "Utsuyumi",
            story: "https://i.pinimg.com/originals/a7/7d/b4/a77db4898bf782c48a3beb6a15edd159.jpg",
        },
        {
            img: require("../assets/5.jpg"),
            name: "Kurishida",
            story: "https://wallpapercave.com/wp/wp6427755.jpg",
        },
        {
            img: require("../assets/6.jpg"),
            name: "Minamino",
            story: "https://wallpapercave.com/wp/wp8380594.jpg",
        },
        {
            img: require("../assets/7.jpg"),
            name: "Mayonri",
            story: "https://i.pinimg.com/originals/45/d9/53/45d953528768ed713696bd490d83260c.jpg",
        },
        {
            img: require("../assets/8.jpg"),
            name: "Koyabe",
            story: "https://i.pinimg.com/736x/73/62/68/73626865140e0fc7db8e5f9579bf0c1d.jpg",
        },
        {
            img: require("../assets/9.jpg"),
            name: "Iwarano",
            story: "https://wallpaperaccess.com/full/1240307.jpg",
        },
    ];

    const { textColor, backgroundColor } = useTheme();

    const wait = (timeout) => {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    };

    const { user, fetchFollowingPost } = React.useContext(AuthContext);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchFollowingPost();
        wait(1000).then(() => setRefreshing(false));
    }, []);

    const [refreshing, setRefreshing] = React.useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: backgroundColor }}>
            <Header navigation={navigation} />
            <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <ScrollView
                    style={{
                        ...styles.storyContainer,
                        backgroundColor: backgroundColor,
                    }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{ alignItems: "center" }}>
                        <View style={styles.myStory}>
                            <Image
                                source={{ uri: user.photoURL }}
                                style={{
                                    ...styles.userAvatar,
                                    position: "relative",
                                }}
                            />
                        </View>
                        <Ionicons
                            name="add-circle-sharp"
                            size={24}
                            color="black"
                            style={{
                                position: "absolute",
                                right: 5,
                                top: "50%",
                                color: "#0098db",
                            }}
                        />
                        <Text style={{ ...styles.txt, color: textColor }}>
                            Tin của bạn
                        </Text>
                    </View>
                    {data.map((item, index) => (
                        <TouchableOpacity
                            activeOpacity={1}
                            key={index}
                            style={{ alignItems: "center" }}
                            onPress={() =>
                                navigation.navigate("Story", {
                                    name: item.name,
                                    avatar: item.img,
                                    story: item.story,
                                    time: Math.floor(Math.random() * 1440 + 1),
                                })
                            }
                        >
                            <LinearGradient
                                colors={["#bc2a8d", "#e95950", "#fccc63"]}
                                style={styles.story}
                            >
                                <View>
                                    <Image
                                        source={item.img}
                                        style={{
                                            ...styles.img,
                                            position: "relative",
                                            borderColor: backgroundColor,
                                        }}
                                    />
                                </View>
                            </LinearGradient>
                            <Text style={{ ...styles.txt, color: textColor }}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Post navigation={navigation} />
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    img: {
        width: 75,
        height: 75,
        borderRadius: 75 / 2,
        borderWidth: 5,
    },
    userAvatar: {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
    },
    story: {
        height: 81,
        width: 81,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },
    myStory: {
        height: 80,
        width: 80,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },
    txt: {
        fontSize: 12,
        marginBottom: 5,
        width: 70,
        textAlign: "center",
    },
    storyContainer: {
        flexDirection: "row",
        marginTop: 5,
        borderBottomColor: "#ccc",
        borderBottomWidth: 0.5,
        backgroundColor: "#fff",
    },
});
