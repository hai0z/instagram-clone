import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  LogBox,
  Image,
  Alert,
} from "react-native";
import logo from "../assets/logo.png";
import { auth, db } from "../firebase";
import { AntDesign } from "@expo/vector-icons";

const emailVaild = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const usernameValid = (username) => {
  const re = /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  return re.test(String(username.toLowerCase()));
};

const Signup = ({ navigation }) => {
  LogBox.ignoreLogs(["Setting a timer"]);

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [rePassword, setRepassword] = useState("");

  const [email, setEmail] = useState("");

  const signupHandle = (email, user, pass, rePass) => {
    if (!emailVaild(email)) {
      Alert.alert("Lỗi", "Địa chỉ email không hợp lệ");
    } else if (pass.trim().length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải tối thiểu 6 kí tự");
    } else if (password !== rePass) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không trùng khớp");
    } else if (!usernameValid(user)) {
      Alert.alert("Lỗi", "Tên người dùng không hợp lệ");
    } else {
      auth
        .createUserWithEmailAndPassword(email, pass)
        .then(() => {
          Alert.alert("Thông báo", "đăng ki thành công");
          const uid = auth.currentUser.uid;
          db.collection("users")
            .doc(uid)
            .set({
              displayName: user,
              email,
              fullname: "",
              photoURL: "https://start-up.vn/upload/photos/avatar.jpg",
              uid,
              signature: "",
            })
            .then(() => console.log("ok"))
            .catch((err) => console.log(err));

          db.collection("follow")
            .doc(uid)
            .collection("userFollowing")
            .doc(uid)
            .set({});
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error);
          // ..
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txtLanguage}>
        Tiếng Việt (Việt Nam)
        <AntDesign name="down" size={15} color="#ababab" />
      </Text>
      <View style={styles.body}>
        <Image source={logo} />
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="Địa chỉ email"
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tên người dùng"
          value={username}
          onChangeText={(e) => setUsername(e)}
        />

        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="mật khẩu"
          value={password}
          onChangeText={(e) => setPassword(e)}
        />

        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Nhập lai mật khẩu"
          value={rePassword}
          onChangeText={(e) => setRepassword(e)}
        />

        <TouchableOpacity
          disabled={
            !username.trim().length ||
            !password.trim().length ||
            !rePassword.trim().length
          }
          onPress={() => signupHandle(email, username, password, rePassword)}
          style={{
            ...styles.loginBtn,
            opacity:
              !username.trim().length ||
              !password.trim().length ||
              !rePassword.trim().length
                ? 0.4
                : 1,
          }}
        >
          <Text style={styles.loginTxt}>Đăng kí</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <View>
          <View style={styles.txtFoodter}>
            <Text>Bạn có tài khoản rồi? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{
                  color: "#0097f6",
                  fontWeight: "bold",
                  opacity: 0.4,
                }}
              >
                Đăng nhập
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  txtLanguage: {
    textAlign: "center",
    color: "#ababab",
    marginTop: 35,
  },
  body: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  footer: {
    justifyContent: "center",
    alignContent: "center",
    borderTopColor: "#efefef",
    borderTopWidth: 1,
    height: 50,
  },
  txtFoodter: {
    textAlign: "center",
    fontSize: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 50,
    width: "90%",
    backgroundColor: "#fafafa",
    padding: 10,
    marginTop: 15,
    borderColor: "#efefef",
    borderWidth: 1,
    borderRadius: 5,
  },
  loginBtn: {
    height: 50,
    width: "90%",
    backgroundColor: "#0097f6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 15,
  },
  loginTxt: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
