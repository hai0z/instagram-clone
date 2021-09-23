import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Animated,
  TouchableOpacity,
} from "react-native";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;

import { Feather } from "@expo/vector-icons";
const Story = ({ route }) => {
  const { avatar, name, story, time } = route.params;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: width - 11,
      duration: 5000,
      useNativeDriver: false,
    }).start();
  };

  React.useEffect(() => {
    fadeIn();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ position: "relative", marginTop: 20 }}>
        <View
          style={{
            position: "absolute",
            zIndex: 2,
            top: 5,
            left: 5,
            height: 4,
            borderColor: "#fff",
            width: width - 10,
            borderWidth: 1,
          }}
        >
          <Animated.View
            style={{ width: fadeAnim, height: 2, backgroundColor: "#fff" }}
          ></Animated.View>
        </View>
        <View
          style={{
            position: "absolute",
            zIndex: 2,
            flexDirection: "row",
            top: 20,
            left: 20,
            alignItems: "center",
          }}
        >
          <Image
            source={avatar}
            style={{
              width: 35,
              height: 35,
              borderRadius: 35 / 2,
            }}
          />
          <Text style={{ fontWeight: "bold", color: "#fff", marginLeft: 5 }}>
            {name}
          </Text>
          <Text style={{ fontSize: 12, color: "#fff", marginLeft: 30 }}>
            {time < 60
              ? `${time} phút trước`
              : `${Math.ceil(time / 60)} giờ trước`}
          </Text>
        </View>
        <TouchableOpacity
          delayLongPress={100}
          onPressOut={() => {
            Animated.timing(fadeAnim, {
              toValue: width - 11,
              duration: 5000,
              useNativeDriver: false,
            }).start();
          }}
          activeOpacity={1}
          onLongPress={() => {
            Animated.timing(fadeAnim).stop();
          }}
        >
          <Image
            source={{ uri: story }}
            resizeMode="cover"
            style={{
              width: width,
              height: height - height / 5,
              borderRadius: 5,
            }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            marginTop: 20,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginHorizontal: 15,
          }}
        >
          <TextInput
            style={{
              backgroundColor: "transparent",
              padding: 10,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 30,
              width: width * 0.8,
            }}
            placeholder="Gửi tin nhắn"
            placeholderTextColor="#fff"
          />
          <Feather name="send" size={24} color="#fff" />
        </View>
      </View>
    </View>
  );
};

export default Story;

const styles = StyleSheet.create({});
