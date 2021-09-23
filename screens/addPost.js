import React, { useState, useEffect, useContext } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
const width = Dimensions.get("window").width;
import { ThemeContext } from "../context/ThemeProvider";

const AddPost = ({ navigation }) => {
  const [camera, setCamera] = useState(null);

  const [image, setImage] = useState(null);

  const [hasPermission, setHasPermission] = useState(null);

  const [type, setType] = useState(Camera.Constants.Type.back);

  const { theme } = useContext(ThemeContext);

  const { isLightTheme, light, dark } = theme;

  const textColor = isLightTheme ? light.textColor : dark.textColor;

  const backgroundColor = isLightTheme
    ? light.backgroundColor
    : dark.backgroundColor;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");

      const galleyStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleyStatus.status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.4, skipProcessing: true };
      const data = await camera.takePictureAsync(options);

      setImage(data.uri);
    }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.4,
    });
    setImage(result.uri);
  };
  return (
    <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 10,
          height: 40,
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
      </View>
      {image ? (
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 30 }}>
            <Image source={{ uri: image }} style={{ width, height: width }} />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "70%",
              }}
            >
              <TouchableOpacity onPress={() => setImage(null)}>
                <AntDesign name="closecircleo" size={40} color="red" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("SavePost", { image: image })
                }
              >
                <AntDesign name="checkcircleo" size={40} color="green" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Camera
            style={styles.camera}
            type={type}
            ratio={"4:3"}
            ref={(ref) => setCamera(ref)}
          />
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "70%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Ionicons
                  name="ios-camera-reverse-outline"
                  size={40}
                  color={textColor}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => takePicture()}>
                <View
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: isLightTheme ? "gray" : textColor,
                    borderRadius: 100 / 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 90,
                      height: 90,
                      backgroundColor: isLightTheme ? "gray" : textColor,
                      borderRadius: 90 / 2,
                      borderWidth: 5,
                      borderColor: backgroundColor,
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickImage()}>
                <MaterialIcons
                  name="add-photo-alternate"
                  size={40}
                  color={textColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  camera: {
    flex: 2,
  },

  text: {
    fontSize: 18,
    color: "white",
  },
});

export default AddPost;
