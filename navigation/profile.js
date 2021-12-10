import React from "react";
import Profile from "../screens/profiles/profile";
import MyPost from "../screens/myPost";
import {
    createStackNavigator,
    CardStyleInterpolators,
} from "@react-navigation/stack";
const Stack = createStackNavigator();
const options = {
    gestureEnabled: true,
    gestureDirection: "horizontal",
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};
export default function ProfileScreens() {
    return (
        <Stack.Navigator headerMode={false}>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="MyPost" component={MyPost} options={options} />
        </Stack.Navigator>
    );
}
