import React, { useState, useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import useTheme from "../service/useTheme";

import { auth, db } from "../firebase";

const Activity = () => {
    const { textColor, backgroundColor } = useTheme();
    const [nofication, setNofication] = useState([]);

    useEffect(() => {
        const getNofication = () => {
            db.collection("nofication")
                .doc(auth.currentUser.uid)
                .collection("userNofication")
                .onSnapshot((snapShot) => {
                    const nofi = snapShot.docs.map((doc) => {
                        const id = doc.id;
                        return { id, ...doc.data() };
                    });
                    setNofication(nofi);
                });
        };
        getNofication();
    }, []);

    useEffect(() => {
        let ref = db
            .collection("nofication")
            .doc(auth.currentUser.uid)
            .collection("userNofication");
        ref.where("seen", "==", false)
            .get()
            .then((snapshot) => {
                const data = snapshot.docs.map((doc) => {
                    return doc.id;
                });
                data.length > 0 &&
                    data.forEach((e) => {
                        db.collection("nofication")
                            .doc(auth.currentUser.uid)
                            .collection("userNofication")
                            .doc(e)
                            .update({
                                seen: true,
                            });
                    });
            });
    }, []);

    return (
        <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
            <View style={styles.header}>
                <Text style={{ ...styles.txtTitle, color: textColor }}>
                    Hoạt động
                </Text>
            </View>
            <ScrollView style={{ marginHorizontal: 10 }}>
                <Text style={{ fontWeight: "bold", color: textColor }}>
                    Hôm qua
                </Text>
                {nofication.map((item, index) => {
                    return (
                        <View style={styles.nofication} key={index}>
                            <Image
                                source={{ uri: item.user.photoURL }}
                                style={styles.avatar}
                            />
                            <Text
                                style={{
                                    textAlign: "left",
                                    overflow: "hidden",
                                    maxWidth: "50%",
                                    marginLeft: 10,
                                    color: textColor,
                                }}
                            >
                                {item.title}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default Activity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    txtTitle: {
        fontWeight: "bold",
        fontSize: 22,
    },
    header: {
        justifyContent: "center",
        marginHorizontal: 10,
        height: 60,
    },
    nofication: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 45 / 2,
    },
});
