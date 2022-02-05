import React, { createContext, useState } from "react";
import { auth, db } from "../firebase";

export const AuthContext = createContext(undefined);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});

    const [userUid, setUserUid] = useState(null);

    const [userPost, setUserPost] = useState([]);

    const [isLogin, setIsLogin] = useState(false);

    const [followingPost, setFollowingPost] = useState([]);

    const [loading, setLoading] = useState(true);

    const fetchUser = () => {
        db.collection("users")
            .doc(auth.currentUser.uid)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setUser(doc.data());
                } else {
                    console.log("No such document!");
                }
            });
    };
    const fetchPost = () => {
        db.collection("posts")
            .where("own.uid", "==", auth.currentUser.uid)
            .orderBy("createdAt", "desc")
            .onSnapshot((querySnapshot) => {
                const post = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data };
                });
                setUserPost(post);
            });
    };
    const fetchFollowingPost = () => {
        db.collection("follow")
            .doc(auth.currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((querySnapshot) => {
                const following = querySnapshot.docs.map((doc) => {
                    return doc.id;
                });
                following.length >= 1 &&
                    db
                        .collection("posts")
                        .where("own.uid", "in", following)
                        .orderBy("createdAt", "desc")
                        .onSnapshot((querySnapshot) => {
                            const post = querySnapshot.docs.map((doc) => {
                                const data = doc.data();
                                const id = doc.id;
                                return { id, ...data };
                            });

                            setFollowingPost(post);
                        });
            });
    };
    React.useEffect(() => {
        const unsubscibed = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLogin(true);
                setLoading(false);
                fetchUser();
                fetchPost();
                fetchFollowingPost();
            } else {
                setLoading(false);
                setIsLogin(false);
                setUser({});
                setUserPost([]);
                setFollowingPost([]);
                setUserUid(null);
            }
        });
        return () => {
            unsubscibed();
        };
    }, []);
    return (
        <AuthContext.Provider
            value={{
                user,
                isLogin,
                userPost,
                userUid,
                followingPost,
                loading,
                setFollowingPost,
                setUserUid,
                setLoading,
                fetchPost,
                fetchUser,
                fetchFollowingPost,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
