import { Audio } from "expo-av";

export const soundHandler = async (soundUri: string) => {
  // 🔊 sound files
  const sounds = {
    bell: require("../assets/sounds/bell.mp3"),
    chime: require("../assets/sounds/chime.mp3"),
    mijn: require("../assets/sounds/mijn.mp3"),
  };

  // 🔊 play preview
  const playSound = async (key: "bell" | "chime" | "mijn") => {
    try {
      const { sound } = await Audio.Sound.createAsync(sounds[key]);
      await sound.playAsync();
    } catch (e) {
      console.log("Sound error:", e);
    }
  };
};
