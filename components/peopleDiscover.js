import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import avatart from "../assets/myavatar.jpg";
const PeopleDiscover = () => {
  const [data, setData] = React.useState([
    {
      id: 1,
      name: "Onichan",
      des: "Gợi ý cho bạn",
      img: require("../assets/4.jpg"),

      follow: false,
    },
    {
      id: 2,
      name: "Hepta",
      des: "Gợi ý cho bạn",
      img: require("../assets/5.jpg"),
      follow: false,
    },
    {
      id: 3,
      name: "Deca",
      des: "Gợi ý cho bạn",
      img: require("../assets/6.jpg"),
      follow: false,
    },
    {
      id: 4,
      name: "Octa",
      des: "Gợi ý cho bạn",
      img: require("../assets/7.jpg"),
      follow: false,
    },
    {
      id: 5,
      name: "Penta",
      des: "Gợi ý cho bạn",
      img: require("../assets/8.jpg"),
      follow: false,
    },
    {
      id: 6,
      name: "Mono",
      des: "Gợi ý cho bạn",
      img: require("../assets/9x.jpg"),
      follow: false,
    },
  ]);

  const close = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const follow = (userId) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === userId ? { ...item, follow: !item.follow } : item
      )
    );
  };
  return (
    <View style={{ marginTop: 20 }}>
      <View style={styles.container}>
        <Text style={{ fontWeight: "bold" }}>Khám phá mọi người</Text>
        <Text style={{ fontWeight: "bold", color: "#0084fb" }}>Xem tât cả</Text>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollView}
        showsHorizontalScrollIndicator={false}
      >
        {data.map((item, index) => {
          return (
            <View key={index}>
              <View style={styles.followContainer}>
                <Image source={item.img} style={styles.avatart} />
                <TouchableOpacity
                  onPress={() => close(item.id)}
                  style={styles.closeBtn}
                >
                  <AntDesign name="close" size={18} color="grey" />
                </TouchableOpacity>
                <View
                  style={{
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.followTxt}>{item.name}</Text>
                  <Text style={{ color: "#bbb" }}>{item.des}</Text>
                  <TouchableOpacity
                    onPress={() => follow(item.id)}
                    activeOpacity={0.7}
                    style={{
                      height: 30,
                      backgroundColor: item.follow ? "#fff" : "#0098db",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 120,
                      borderRadius: 5,
                      marginTop: 20,
                      borderColor: item.follow ? "#bbb" : "none",
                      borderWidth: item.follow ? 1 : 0,
                    }}
                  >
                    <Text
                      style={{
                        color: item.follow ? "#000" : "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {item.follow ? "Đang theo dõi" : "Theo dõi"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
        <View style={styles.followContainer}>
          <Image source={avatart} style={styles.imgSecond} />
          <Image source={require("../assets/1.jpg")} style={styles.imgMain} />
          <View style={styles.followView}>
            <Text style={styles.followTxt}>Tìm thêm người để theo dõi</Text>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followTxt}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PeopleDiscover;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  followContainer: {
    height: 210,
    width: 150,
    alignItems: "center",
    borderRadius: 7,
    borderColor: "#bbb",
    borderWidth: 0.5,
    marginHorizontal: 2,
  },
  followBtn: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#bbb",
  },
  followTxt: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  imgMain: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 10,
    position: "absolute",
    top: 10,
    right: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  imgSecond: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 10,
    position: "relative",
  },
  followView: {
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 33,
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    right: 5,
    top: 5,
  },
  scrollView: {
    marginTop: 10,
    padding: 10,
  },
  avatart: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 10,
  },
});
