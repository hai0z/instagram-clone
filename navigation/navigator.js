import React, { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";

import HomeNavigator from "./home";
import Story from "../screens/story";
import Comment from "../screens/comment";
import Login from "../screens/login";

import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";
import AddPost from "../screens/addPost";
import SavePost from "../screens/savePost";
import Splash from "../screens/splash";
import Signup from "../screens/signup";
import UserEditor from "../screens/userEditor";
import Chat from "../screens/chat";
import ChatWindow from "../screens/chatWindow";
import OtherProfile from "../screens/ortherProfile";
import { StatusBar } from "react-native";

const Stack = createStackNavigator();

export default function Navigation() {
  const { isLogin, loading } = useContext(AuthContext);

  const storyOption = {
    gestureEnabled: true,
    gestureDirection: "vertical",
    cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
  };

  const options = {
    gestureEnabled: true,
    gestureDirection: "horizontal",
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  };

  const { theme } = useContext(ThemeContext);

  const { isLightTheme, light, dark } = theme;

  const backgroundColor = isLightTheme
    ? light.backgroundColor
    : dark.backgroundColor;

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isLightTheme ? "dark-content" : "light-content"}
      />
      <Stack.Navigator headerMode={false}>
        {loading && <Stack.Screen name="Splash" component={Splash} />}

        {!isLogin ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeNavigator} />
            <Stack.Screen
              name="Story"
              component={Story}
              options={storyOption}
            />
            <Stack.Screen
              name="Comment"
              component={Comment}
              options={options}
            />
            <Stack.Screen name="AddPost" component={AddPost} />
            <Stack.Screen
              name="SavePost"
              component={SavePost}
              options={options}
            />
            <Stack.Screen
              name="EditProfile"
              component={UserEditor}
              options={storyOption}
            />
            <Stack.Screen name="Chat" component={Chat} options={options} />
            <Stack.Screen
              name="ChatWindow"
              component={ChatWindow}
              options={options}
            />
            <Stack.Screen
              name="OtherProfile"
              component={OtherProfile}
              options={options}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
