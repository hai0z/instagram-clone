import React, { useContext, useEffect, useState } from "react";

import { Image, View, Text } from "react-native";

import Home from "../screens/home";
import Activity from "../screens/activity";
import Profile from "./profile";
import Reels from "../screens/reels";
import Search from "../screens/search";
import OtherProfile from "../screens/ortherProfile";
import OtherPost from "../screens/otherPost";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import LikeScreen from "../screens/likeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { auth, db } from "../firebase";
import {
    createStackNavigator,
    CardStyleInterpolators,
} from "@react-navigation/stack";

import ViewFollower from "../screens/viewFollower";

import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";
import Setting from "../screens/setting";
import SelectTheme from "../screens/selectTheme";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const options = {
    gestureEnabled: true,
    gestureDirection: "horizontal",
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};
const SearchScreens = () => {
    return (
        <Stack.Navigator headerMode={false}>
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen
                name="OtherProfile"
                component={OtherProfile}
                options={options}
            />
            <Stack.Screen
                name="OtherPost"
                component={OtherPost}
                options={options}
            />
            <Stack.Screen
                name="ViewFollower"
                component={ViewFollower}
                options={options}
            />
        </Stack.Navigator>
    );
};
const HomeScreens = () => {
    return (
        <Stack.Navigator headerMode={false}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen
                name="Like"
                component={LikeScreen}
                options={options}
            />
            <Stack.Screen
                name="OtherProfile"
                component={OtherProfile}
                options={options}
            />
            <Stack.Screen
                name="OtherPost"
                component={OtherPost}
                options={options}
            />
            <Stack.Screen name="ViewFollower" component={ViewFollower} />
        </Stack.Navigator>
    );
};

let a= 1;
const ProfileScreens = () => {
    return (
        <Stack.Navigator headerMode={false}>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen
                name="ViewFollower"
                component={ViewFollower}
                options={options}
            />
            <Stack.Screen
                name="OtherProfile"
                component={OtherProfile}
                options={options}
            />
            <Stack.Screen
                name="Setting"
                component={Setting}
                options={options}
            />
            <Stack.Screen
                name="SelectTheme"
                component={SelectTheme}
                options={options}
            />
        </Stack.Navigator>
    );
};
export default function HomeNavigator() {
    const { user } = useContext(AuthContext);

    const { theme } = useContext(ThemeContext);

    const { isLightTheme, light, dark } = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;
    const [nofication, setNofication] = useState([]);
    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;

    useEffect(() => {
        const getNofication = () => {
            db.collection("nofication")
                .doc(auth.currentUser.uid)
                .collection("userNofication")
                .where("seen", "==", false)
                .onSnapshot((snapShot) => {
                    const nofi = snapShot.docs.map((doc) => {
                        const id = doc.id;
                        return { id, ...doc.data() };
                    });
                    setNofication(nofi);
                });
        };
        getNofication();
    }, []);
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Search") {
                        iconName = focused ? "search" : "search-outline";
                    }
                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
            })}
            tabBarOptions={{
                activeTintColor: textColor,
                inactiveTintColor: textColor,
                showLabel: false,
                style: {
                    backgroundColor: backgroundColor,
                    borderTopWidth: 1,
                    borderTopColor: isLightTheme ? "#fff" : "#151515",
                    paddingBottom: 7,
                },
            }}
        >
            <Tab.Screen name="Home" component={HomeScreens} />
            <Tab.Screen name="Search" component={SearchScreens} />
            <Tab.Screen
                name="Rells"
                component={Reels}
                options={{
                    tabBarIcon: ({ focused, color }) =>
                        focused ? (
                            <Ionicons name="videocam" color={color} size={28} />
                        ) : (
                            <Ionicons
                                name="videocam-outline"
                                color={color}
                                size={28}
                            />
                        ),
                }}
            />
            <Tab.Screen
                name="Activity"
                component={Activity}
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <View>
                                <AntDesign
                                    name="heart"
                                    color={textColor}
                                    size={24}
                                />
                            </View>
                        ) : (
                            <View>
                                <AntDesign
                                    name="hearto"
                                    size={24}
                                    color={textColor}
                                    style={{ position: "relative" }}
                                />

                                {nofication.length > 0 && (
                                    <Text
                                        style={{
                                            color: "coral",
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            position: "absolute",
                                            zIndex: 2,
                                            bottom: -10,
                                            left: 9,
                                        }}
                                    >
                                        .
                                    </Text>
                                )}
                            </View>
                        ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreens}
                options={{
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Image
                                style={{
                                    height: 28,
                                    width: 28,
                                    borderRadius: 28 / 2,
                                    borderWidth: 1.5,
                                    borderColor: textColor,
                                }}
                                source={{
                                    uri: user.photoURL,
                                }}
                            />
                        ) : (
                            <Image
                                style={{
                                    height: 26,
                                    width: 26,
                                    borderRadius: 26 / 2,
                                    borderWidth: 0.5,
                                    borderColor: "#ccc",
                                }}
                                source={{
                                    uri: user.photoURL,
                                }}
                            />
                        ),
                }}
            />
        </Tab.Navigator>
    );
}
