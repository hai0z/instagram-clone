import React, { useContext } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const width = Dimensions.get("window").width;
import { ThemeContext } from "../context/ThemeProvider";
import { BlurView } from "expo-blur";

const SettingModal = ({ modalVisible, onClose, goSetting }) => {
  const { theme } = useContext(ThemeContext);

  const { isLightTheme, light, dark } = theme;

  const textColor = isLightTheme ? light.textColor : dark.textColor;

  return (
    <View style={{ ...styles.centeredView }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
      >
        <BlurView
          style={{ ...styles.centeredView }}
          tint={isLightTheme ? "light" : "dark"}
          intensity={50}
        >
          <View
            style={{
              ...styles.modalView,
              backgroundColor: isLightTheme ? "#fff" : "#151515",
            }}
          >
            <TouchableOpacity onPress={goSetting}>
              <Text style={{ ...styles.modalText, color: textColor }}>
                Cài đặt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: textColor }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
    width,
    opacity: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalText: {
    marginBottom: 15,
  },
});

export default SettingModal;
