import React, { useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";
const Search = ({ navigation }) => {
    const { setUserUid } = React.useContext(AuthContext);

    const [data, setData] = React.useState([]);

    const { theme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;

    const search = (input) => {
        db.collection("users")
            .where("displayName", ">=", input)
            .get()
            .then((snapshot) => {
                let data = snapshot.docs.map((doc) => {
                    let id = doc.id;
                    let document = doc.data();
                    return { id, ...document };
                });
                setData(data);
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    };
    return (
        <View style={{ flex: 1, backgroundColor: backgroundColor }}>
            <View
                style={{
                    flexDirection: "row",
                    marginHorizontal: 15,
                    alignItems: "center",
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>
                <TextInput
                    style={{
                        height: 40,
                        width: "80%",
                        borderRadius: 15,
                        padding: 10,
                        marginLeft: 20,
                        backgroundColor: isLightTheme ? "#efefef" : "#262626",
                        fontWeight: "bold",
                        color: textColor,
                    }}
                    placeholder="Tìm kiếm..."
                    placeholderTextColor={isLightTheme ? "#ccc" : "#494949"}
                    onChangeText={(value) => search(value)}
                />
            </View>

            <FlatList
                style={{ flex: 1 }}
                data={data}
                renderItem={({ item }) => {
                    return (
                        <View>
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginVertical: 10,
                                    padding: 10,
                                    marginHorizontal: 15,
                                }}
                                onPress={() => {
                                    setUserUid(item.id);
                                    navigation.navigate("OtherProfile");
                                }}
                            >
                                <Image
                                    source={{ uri: item.photoURL }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 50 / 2,
                                        borderWidth: 0.5,
                                        borderColor: "#ccc",
                                    }}
                                />

                                <View>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            marginLeft: 10,
                                            fontWeight: "bold",
                                            color: textColor,
                                        }}
                                    >
                                        {item.displayName}
                                    </Text>
                                    {item.fullname ? (
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                marginLeft: 10,
                                                fontWeight: "bold",
                                                color: "#ababab",
                                            }}
                                        >
                                            {item.fullname}
                                        </Text>
                                    ) : (
                                        <></>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                }}
                keyExtractor={() => Math.random().toString()}
            />
        </View>
    );
};

export default Search;

const styles = StyleSheet.create({});
