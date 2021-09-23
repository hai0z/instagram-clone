import React, {useState, useContext} from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    LogBox,
    Image,
} from "react-native";
import logo from "../assets/logo.png";
import {auth} from "../firebase";
import {AntDesign} from "@expo/vector-icons";
import {FontAwesome5} from "@expo/vector-icons";
import {Feather} from "@expo/vector-icons";
import {ThemeContext} from "../context/ThemeProvider";
import logoWhite from "../assets/logo-white.png";

const Login = ({navigation}) => {
    LogBox.ignoreLogs(["Setting a timer"]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const loginHandle = (user, pass) => {
        auth.signInWithEmailAndPassword(user, pass)
            .catch((error) => {
                alert("sai mat khau");
                console.log(error);
            });
    };
    const {theme} = useContext(ThemeContext);

    const {isLightTheme, light, dark} = theme;

    const textColor = isLightTheme ? light.textColor : dark.textColor;

    const backgroundColor = isLightTheme
        ? light.backgroundColor
        : dark.backgroundColor;

    return (
        <View style={{...styles.container, backgroundColor: backgroundColor}}>
            <Text style={styles.txtLanguage}>
                Tiếng Việt (Việt Nam)
                <AntDesign name="down" size={15} color="#ababab"/>
            </Text>
            <View style={styles.body}>
                <Image source={isLightTheme ? logo : logoWhite}/>
                <TextInput
                    style={{
                        ...styles.input,
                        backgroundColor: isLightTheme ? "#fafafa" : "#262626",
                        color: textColor,
                    }}
                    keyboardType="email-address"
                    placeholder="Số điện thoại, email hoặc tên người dùng"
                    value={username}
                    onChangeText={(e) => setUsername(e)}
                    placeholderTextColor="gray"
                />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        position: "relative",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setHidePassword(!hidePassword)}
                        style={{position: "absolute", zIndex: 2, top: 30, right: 10}}
                    >
                        {!hidePassword ? (
                            <Feather name="eye" size={20} color="#0097f6"/>
                        ) : (
                            <Feather name="eye-off" size={20} color="gray"/>
                        )}
                    </TouchableOpacity>
                    <TextInput
                        style={{
                            ...styles.input,
                            backgroundColor: isLightTheme ? "#fafafa" : "#262626",
                            color: textColor,
                        }}
                        secureTextEntry={hidePassword}
                        placeholder="mật khẩu"
                        placeholderTextColor="gray"
                        value={password}
                        onChangeText={(e) => setPassword(e)}
                    />
                </View>

                <TouchableOpacity
                    disabled={!username.trim().length || !password.trim().length}
                    onPress={() => loginHandle(username, password)}
                    style={{
                        ...styles.loginBtn,
                        opacity:
                            !username.trim().length || !password.trim().length ? 0.4 : 1,
                    }}
                >
                    <Text style={styles.loginTxt}>Đăng nhập</Text>
                </TouchableOpacity>

                <View style={{width: "90%", marginTop: 10}}>
                    <Text style={{textAlign: "center"}}>
                        <Text
                            style={{fontSize: 13, color: isLightTheme ? "#000" : "gray"}}
                        >
                            Bạn quên thông tin đăng nhập ư?
                        </Text>{" "}
                        <Text
                            style={{
                                fontSize: 12,
                                color: "#0097f6",
                                fontWeight: "bold",
                                opacity: 0.4,
                            }}
                        >
                            Nhận trợ giúp đăng nhập ngay
                        </Text>
                    </Text>
                </View>
                <View
                    style={{
                        marginTop: 15,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: 30,
                        width: "90%",
                    }}
                >
                    <View
                        style={{
                            borderBottomColor: "#efefef",
                            borderBottomWidth: 1,
                            width: "40%",
                        }}
                    />
                    <Text style={{color: "gray", fontWeight: "bold"}}>HOẶC</Text>
                    <View
                        style={{
                            borderBottomColor: "#efefef",
                            borderBottomWidth: 1,
                            width: "40%",
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={{
                        ...styles.loginBtn,
                        justifyContent: "center",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <FontAwesome5 name="facebook" size={24} color="#fff"/>
                    <Text style={{color: "#fff", fontWeight: "bold", marginLeft: 10}}>
                        Đăng nhập bằng Facebook
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <View>
                    <View style={styles.txtFoodter}>
                        <Text style={{color: isLightTheme ? "#000" : "gray"}}>
                            {" "}
                            Bạn chưa có tài khoản ư?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                            <Text
                                style={{
                                    color: "#0097f6",
                                    fontWeight: "bold",
                                    opacity: 0.4,
                                }}
                            >
                                Đăng kí
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    txtLanguage: {
        textAlign: "center",
        color: "#ababab",
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
        alignItems: "center",
        fontSize: 12,
        flexDirection: "row",
        justifyContent: "center",
    },
    input: {
        height: 50,
        width: "90%",
        backgroundColor: "#fafafa",
        padding: 10,
        marginTop: 15,

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
