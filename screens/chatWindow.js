import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";

import { AuthContext } from "../context/AuthProvider";
import firebase from "firebase";

const ChatWindow = ({ navigation, route }) => {
  const { data } = route.params;

  const [message, setMessage] = React.useState("");

  const { setUserUid, user } = React.useContext(AuthContext);

  const [follower, setFollower] = React.useState([]);

  const [post, setPost] = React.useState([]);

  const listRef = React.useRef(null);

  const [listMessage, setListMessage] = React.useState([]);
  const getFollower = () => {
    db.collection("follow")
      .doc(data.uid)
      .collection("userFollower")
      .get()
      .then((res) => {
        const follower = res.docs.map((doc) => {
          return doc.id;
        });
        setFollower(follower);
      });
  };

  const getPost = () => {
    db.collection("posts")
      .where("own.uid", "==", data.uid)
      .onSnapshot((querySnapshot) => {
        let postId = querySnapshot.docs.map((doc) => {
          return doc.id;
        });
        setPost(postId);
      });
  };

  const getMessage = () => {
    db.collection("messages")
      .doc(auth.currentUser.uid)
      .collection(data.uid)
      .onSnapshot((res) => {
        const data = res.docs.map((doc) => {
          return doc.data();
        });
        setListMessage(data.sort((a, b) => a.createdAt > b.createdAt));
      });
  };

  const changeText = React.useCallback((e) => {
    setMessage(e);
  }, []);

  const send = () => {
    db.collection("messages")
      .doc(auth.currentUser.uid)
      .collection(data.uid)
      .add({
        user,
        message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    db.collection("messages")
      .doc(data.uid)
      .collection(auth.currentUser.uid)
      .add({
        user,
        message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((r) => console.log(r));
    setMessage("");
  };

  React.useEffect(() => {
    getFollower();
    getPost();
    getMessage();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Image source={{ uri: data.photoURL }} style={styles.avatar} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.displayName}>{data.displayName}</Text>
          {data.fullname ? (
            <Text style={styles.fullname}>{data.fullname}</Text>
          ) : (
            <></>
          )}
        </View>
        <Ionicons
          name="call-outline"
          size={28}
          color="black"
          style={{
            ...styles.icon,
            marginLeft: "auto",
            transform: [{ rotate: "270deg" }],
          }}
        />
        <Ionicons
          name="videocam-outline"
          size={28}
          color="black"
          style={styles.icon}
        />
      </View>
      <FlatList
        ref={listRef}
        ListHeaderComponent={() => {
          return (
            <View style={styles.listHeader}>
              <Image
                source={{ uri: data.photoURL }}
                style={styles.headerAvatar}
              />
              {data.fullname ? (
                <Text
                  style={{ ...styles.displayName, fontSize: 18, marginTop: 10 }}
                >
                  {data.fullname}
                </Text>
              ) : (
                <Text
                  style={{ ...styles.displayName, fontSize: 14, marginTop: 10 }}
                >
                  {data.displayName}
                </Text>
              )}
              <Text
                style={{
                  ...styles.displayName,
                  fontSize: 18,
                  fontWeight: "normal",
                }}
              >
                {data.displayName} • Instagram{" "}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.txt}>
                  {follower.length} người theo dõi •
                </Text>
                <Text style={styles.txt}> {post.length} bài viết</Text>
              </View>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  setUserUid(data.uid);
                  navigation.navigate("OtherProfile");
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Xem trang cá nhân</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        data={listMessage}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                flex: 1,
                alignItems:
                  item.user.uid === auth.currentUser.uid
                    ? "flex-end"
                    : "flex-start",
                marginHorizontal: 10,
                marginVertical: 5,
                justifyContent: "flex-end",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {item.user.uid !== auth.currentUser.uid && (
                  <Image
                    source={{ uri: item.user.photoURL }}
                    style={{
                      width: 40,
                      height: 40,
                      borderColor: "#ccc",
                      borderWidth: 0.5,
                      borderRadius: 40 / 2,
                    }}
                  />
                )}
                <View
                  style={{
                    backgroundColor: "#efefef",
                    minHeight: 35,
                    borderRadius: 35 / 2,
                    justifyContent: "center",
                    maxWidth: 250,
                    minWidth: 30,
                    marginLeft: 5,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      padding: 10,
                    }}
                  >
                    {item.message}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
      <View style={styles.foodter}>
        <TextInput
          style={styles.input}
          placeholder="Nhắn tin..."
          placeholderTextColor="#ababab"
          value={message}
          onChangeText={changeText}
        />
        <TouchableOpacity
          style={{ position: "absolute", right: 30 }}
          disabled={!message.trim().length}
          onPress={send}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#0097f6",
              fontWeight: "bold",
              opacity: !message.trim().length ? 0.4 : 1,
            }}
          >
            Gửi
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatWindow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
  },
  displayName: {
    fontWeight: "bold",
  },
  fullname: {
    color: "gray",
    fontSize: 11,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    borderColor: "#ccc",
    borderWidth: 0.5,
    marginLeft: 10,
  },
  icon: {
    marginLeft: 10,
    padding: 5,
  },
  listHeader: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  headerAvatar: {
    height: 120,
    width: 120,
    borderRadius: 120 / 2,
    borderColor: "#ccc",
    borderWidth: 0.5,
  },
  txt: {
    fontSize: 16,
    color: "gray",
  },
  btn: {
    height: 30,
    width: 140,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    marginTop: 7,
  },
  input: {
    width: "90%",
    height: 50,
    borderRadius: 25,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    position: "relative",
  },
  foodter: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
