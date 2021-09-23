import React, { useState, useContext, useEffect } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";
import { db } from "../firebase";

const Tab = createMaterialTopTabNavigator();

import { Ionicons } from "@expo/vector-icons";

const MyTabs = ({ data }) => {
  const { theme } = useContext(ThemeContext);

  const { isLightTheme, light, dark } = theme;

  const textColor = isLightTheme ? light.textColor : dark.textColor;

  const backgroundColor = isLightTheme
    ? light.backgroundColor
    : dark.backgroundColor;
  return (
    <Tab.Navigator
      initialRouteName={data.routeName}
      tabBarOptions={{
        showLabel: true,
        indicatorStyle: {
          backgroundColor: textColor,
          height: 1.5,
        },
        inactiveTintColor: "#ccc",
        activeTintColor: textColor,
        labelStyle: {
          textTransform: "capitalize",
          fontWeight: "bold",
        },
        style: {
          backgroundColor: backgroundColor,
        },
      }}
    >
      <Tab.Screen
        name="Follower"
        component={Follower}
        options={{ title: `Người theo dõi: ${data.follower}` }}
      />
      <Tab.Screen
        name="Following"
        component={Following}
        options={{ title: `Đang theo dõi: ${data.following}` }}
      />
    </Tab.Navigator>
  );
};

const Follower = ({ navigation }) => {
  const { userUid, setUserUid } = useContext(AuthContext);
  const [listFollower, setListFollower] = useState([]);
  const { theme } = useContext(ThemeContext);

  const { isLightTheme, light, dark } = theme;

  const textColor = isLightTheme ? light.textColor : dark.textColor;

  const backgroundColor = isLightTheme
    ? light.backgroundColor
    : dark.backgroundColor;
  useEffect(() => {
    db.collection("follow")
      .doc(userUid)
      .collection("userFollower")
      .onSnapshot((querySnapshot) => {
        let follower = querySnapshot.docs.map((doc) => {
          let id = doc.id;
          return id;
        });
        follower = follower.filter((uid) => uid !== userUid);
        follower.length >= 1 &&
          db
            .collection("users")
            .where("uid", "in", follower)
            .onSnapshot((querySnapshot) => {
              const post = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data };
              });
              setListFollower(post);
            });
      });
  }, [userUid]);

  return (
    <ScrollView style={{ backgroundColor: backgroundColor, flex: 1 }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "bold",
          marginHorizontal: 15,
          marginTop: 10,
          color: textColor,
        }}
      >
        Tất cả người theo dõi
      </Text>
      {listFollower.map((item) => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setUserUid(item.uid);
              navigation.navigate("OtherProfile");
            }}
            key={item.uid}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 15,
              marginVertical: 10,
            }}
          >
            <Image
              source={{ uri: item.photoURL }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50 / 2,
                borderColor: "#ccc",
                borderWidth: 0.5,
              }}
            />
            <View>
              <Text
                style={{ fontWeight: "bold", marginLeft: 10, color: textColor }}
              >
                {item.displayName}
              </Text>
              <Text
                style={{ fontWeight: "bold", marginLeft: 10, color: "gray" }}
              >
                {item.fullname}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const Following = () => {
  const { userUid } = useContext(AuthContext);
  const [listFollowing, setListFollowing] = useState([]);
  const { theme } = useContext(ThemeContext);

  const { isLightTheme, light, dark } = theme;

  const textColor = isLightTheme ? light.textColor : dark.textColor;

  const backgroundColor = isLightTheme
    ? light.backgroundColor
    : dark.backgroundColor;
  useEffect(() => {
    db.collection("follow")
      .doc(userUid)
      .collection("userFollowing")
      .onSnapshot((querySnapshot) => {
        let following = querySnapshot.docs.map((doc) => {
          let id = doc.id;
          return id;
        });
        following = following.filter((uid) => uid !== userUid);
        following.length >= 1 &&
          db
            .collection("users")
            .where("uid", "in", following)
            .onSnapshot((querySnapshot) => {
              const post = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data };
              });
              setListFollowing(post);
            });
      });
  }, [userUid]);
  return (
    <ScrollView style={{ backgroundColor: backgroundColor, flex: 1 }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "bold",
          marginHorizontal: 15,
          marginTop: 10,
          color: textColor,
        }}
      >
        Đang theo dõi
      </Text>
      {listFollowing.map((item) => {
        return (
          <View
            key={item.uid}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 15,
              marginVertical: 10,
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
                style={{ fontWeight: "bold", marginLeft: 10, color: textColor }}
              >
                {item.displayName}
              </Text>
              <Text
                style={{ fontWeight: "bold", marginLeft: 10, color: "gray" }}
              >
                {item.fullname}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const ViewFollower = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);

  const { isLightTheme, light, dark } = theme;

  const textColor = isLightTheme ? light.textColor : dark.textColor;

  const backgroundColor = isLightTheme
    ? light.backgroundColor
    : dark.backgroundColor;

  const { data } = route.params;
  return (
    <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={textColor} />
        </TouchableOpacity>
        <Text style={{ ...styles.txtHeader, color: textColor }}>
          {data.displayName}
        </Text>
      </View>
      <MyTabs data={data} />
    </View>
  );
};

export default ViewFollower;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: 15,
    flexDirection: "row",
    marginBottom: 15,
  },
  txtHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
