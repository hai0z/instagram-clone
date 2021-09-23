import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthProvider";

import { auth, db } from "../firebase";
import { FlatList } from "react-native";
const Chat = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [listUser, setListUser] = useState([]);

  useEffect(() => {
    db.collection("users")
      .where("uid", "!=", auth.currentUser.uid)
      .get()
      .then((res) => {
        const user = res.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setListUser(user);
      });
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={1}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>{user.displayName}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 15,
          marginTop: 10,
        }}
      >
        <AntDesign
          name="search1"
          size={20}
          color="#ababab"
          style={{ position: "absolute", zIndex: 2, top: 20, left: 10 }}
        />
        <TextInput
          placeholder="Tìm kiếm"
          style={styles.searchInput}
          placeholderTextColor="#ababab"
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.txt}>Gợi ý</Text>
        <FlatList
          data={listUser}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.info}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("ChatWindow", {
                    data: item,
                  })
                }
              >
                <Image source={{ uri: item.photoURL }} style={styles.avatar} />
                <View style={styles.name}>
                  <Text style={styles.username}>{item.displayName}</Text>
                  {item.fullname ? (
                    <Text style={styles.fullname}>{item.fullname}</Text>
                  ) : (
                    <></>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.uid}
        />
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    marginHorizontal: 15,
  },
  txtHeader: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 30,
  },
  searchInput: {
    height: 40,
    backgroundColor: "#efefef",
    marginTop: 10,
    borderRadius: 15,
    paddingLeft: 50,
    flex: 1,
    position: "relative",
  },
  body: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  txt: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    borderColor: "#ccc",
    borderWidth: 0.5,
  },
  username: {},
  fullname: {
    color: "gray",
    fontWeight: "300",
  },
  info: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  name: {
    marginLeft: 10,
  },
});
