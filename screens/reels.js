import * as React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";

let { width, height } = Dimensions.get("window");

export default function App() {
  const [status, setStatus] = React.useState({});
  const video = React.useRef(null);
  const videos = [
    {
      id: 4,
      src: require("../assets/video4.mp4"),
    },
    {
      id: 2,
      src: require("../assets/video2.mp4"),
    },
    {
      id: 3,
      src: require("../assets/video3.mp4"),
    },
    {
      id: 1,
      src: require("../assets/video1.mp4"),
    },
  ];

  return (
    <ScrollView pagingEnabled showsVerticalScrollIndicator={false}>
      {videos.map((item) => {
        return (
          <TouchableOpacity
            style={styles.container}
            key={item.id}
            activeOpacity={1}
            onPress={() =>
              status.isPlaying
                ? video.current.pauseAsync()
                : video.current.playAsync()
            }
          >
            <Video
              ref={video}
              style={styles.video}
              source={item.src}
              resizeMode="cover"
              isLooping
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width,
    height: height - 35,
  },
  video: {
    width,
    height,
  },
});
