import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import firebase from "firebase";

const { width, height } = Dimensions.get("window");

import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";

export default function MyPost({ navigation, route }) {
  const { index } = route.params;

  const { userUid } = React.useContext(AuthContext);

  const postIndex = React.createRef();

  const [PostData, setPostData] = React.useState([]);

  const { theme } = useContext(ThemeContext);

  const { isLightTheme, light, dark } = theme;

  const textColor = isLightTheme ? light.textColor : dark.textColor;

  const backgroundColor = isLightTheme
    ? light.backgroundColor
    : dark.backgroundColor;

  const likePost = (postId) => {
    const postRef = db.collection("posts").doc(postId);

    postRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const { like } = doc.data();
          postRef
            .update({
              like: like.includes(auth.currentUser.uid)
                ? firebase.firestore.FieldValue.arrayRemove(
                    auth.currentUser.uid
                  )
                : firebase.firestore.FieldValue.arrayUnion(
                    auth.currentUser.uid
                  ),
            })
            .then(() => console.log("thanh cong"));
        }
      })
      .catch((err) => console.log(err));
  };

  const getData = (docId) => {
    db.collection("posts")
      .where("own.uid", "==", docId)
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        let post = querySnapshot.docs.map((doc) => {
          let data = doc.data();
          let id = doc.id;
          return { id, ...data };
        });
        setPostData(post);
      });
  };
  const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

  React.useEffect(() => {
    getData(userUid);
    wait(1)
      .then(() => postIndex.current.scrollTo({ y: index * width * 1.25 }))
      .catch((err) => console.log(err));
  }, [userUid]);

  return (
    <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={{ ...styles.textHeader, color: textColor }}>Bài viết</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} ref={postIndex}>
        {PostData.map((item, index) => {
          return (
            <View key={index}>
              <View>
                <View style={styles.postHeader}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: item.own.photoURL }}
                  />
                  <Text
                    style={{
                      marginHorizontal: 10,
                      fontWeight: "bold",
                      color: textColor,
                    }}
                  >
                    {item.own.displayName}
                  </Text>
                  <Feather
                    name="more-vertical"
                    size={20}
                    color={textColor}
                    style={{ marginLeft: "auto", marginRight: -5 }}
                  />
                </View>
                <View style={styles.postWrapper}>
                  <Image
                    source={{
                      uri: item.url,
                    }}
                    style={styles.postImg}
                  />
                  <View style={styles.icon}>
                    <TouchableOpacity
                      onPress={() => {
                        likePost(item.id);
                      }}
                    >
                      {item?.like.includes(auth?.currentUser?.uid) ? (
                        <AntDesign
                          name="heart"
                          size={24}
                          color="red"
                          style={{
                            ...styles.reactIcon,
                            transform: [{ scale: item.like > 0 ? 1.1 : 1 }],
                          }}
                        />
                      ) : (
                        <AntDesign
                          name="hearto"
                          size={24}
                          color={textColor}
                          style={styles.reactIcon}
                        />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.reactIcon}
                      onPress={() =>
                        navigation.navigate("Comment", { data: item })
                      }
                    >
                      <Feather
                        name="message-circle"
                        size={24}
                        color={textColor}
                      />
                    </TouchableOpacity>

                    <Feather
                      name="send"
                      size={24}
                      color={textColor}
                      style={styles.reactIcon}
                    />

                    <FontAwesome
                      name="bookmark-o"
                      size={24}
                      color={textColor}
                      style={{ ...styles.reactIcon, marginLeft: "auto" }}
                    />
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View
        style={{
          height: 15,
          backgroundColor: backgroundColor,
          width,
          borderTopWidth: 0.5,
          borderTopColor: isLightTheme ? "#ccc" : "#494949",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
  },
  textHeader: {
    fontSize: 22,
    fontWeight: "bold",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 15,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
  },
  postImg: {
    width,
    height,
  },
  postWrapper: {
    marginTop: 10,
  },
  icon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },
  reactIcon: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  backBtn: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -20,
  },
});
