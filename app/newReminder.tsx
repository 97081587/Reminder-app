import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Linking,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { addReminder } from "@/src/storage/reminders";

// ✅ Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NewReminder() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  const [sound, setSound] = useState<"bell" | "chime" | "mijn">("bell");
  const [soundPickerVisible, setSoundPickerVisible] = useState(false);

  const [location, setLocation] = useState<string | null>(null);

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

  // 📍 open maps
  const handleAddLocation = () => {
    setLocation("Opened Maps");
    Linking.openURL("https://www.google.com/maps");
  };

  // ✅ Android notification channel
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  }, []);

  const showMode = (currentMode: "date" | "time") => {
    setMode(currentMode);
    setShowPicker(true);
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = new Date(date);

      if (mode === "date") {
        currentDate.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
        setDate(currentDate);

        if (Platform.OS === "android") {
          showMode("time");
          return;
        }
      } else {
        currentDate.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes()
        );
        setDate(currentDate);
      }
    }
    setShowPicker(false);
  };

  // ✅ ADD REMINDER
  const handleAddReminder = async () => {
    if (!title) {
      alert("Enter a title");
      return;
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const res = await Notifications.requestPermissionsAsync();
      if (res.status !== "granted") {
        alert("Permission required");
        return;
      }
    }

    const trigger: Notifications.NotificationTriggerInput = {
      type: "timeInterval",
      seconds: 5,
      repeats: false,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: description || "Reminder",
        sound: "default",
      },
      trigger,
    });

    await addReminder({
      text: title,
      description,
      date: new Date().toISOString(),
    });

    router.replace("/");
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <LinearGradient colors={["#2a8c82", "#d1913c"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>New Reminder</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Enter description"
            />

            <Text style={styles.label}>Date & Time</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => showMode("date")}
            >
              <Text>
                {date.toLocaleDateString()}{" "}
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={date}
                mode={mode}
                display="default"
                onChange={onChangeDate}
              />
            )}

            {/* ✅ PILLS UNDER DATE */}
            <View style={styles.pillRow}>
              {/* 🔊 SOUND */}
              <TouchableOpacity
                style={styles.pill}
                onPress={() => setSoundPickerVisible(true)}
              >
                <Text>🔔 Add Sound</Text>
              </TouchableOpacity>

              {/* 📍 LOCATION */}
              <TouchableOpacity
                style={styles.pill}
                onPress={handleAddLocation}
              >
                <Text>
                  {location ? `📍 ${location}` : "📍 Add Location"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 🔊 SOUND MODAL */}
            <Modal
              transparent
              visible={soundPickerVisible}
              animationType="fade"
              onRequestClose={() => setSoundPickerVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => setSoundPickerVisible(false)}
              >
                <View style={styles.modalContent}>
                  {(["bell", "chime", "mijn"] as const).map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.option,
                        item === sound && styles.activeOption,
                      ]}
                      onPress={() => {
                        setSound(item);
                        playSound(item);
                        setSoundPickerVisible(false);
                      }}
                    >
                      <Text
                        style={{
                          color: item === sound ? "white" : "black",
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            {/* BUTTONS */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => router.replace("/")}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleAddReminder}
              >
                <Text style={{ color: "white" }}>Add Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    fontSize: 34,
    color: "white",
    marginBottom: 30,
    fontWeight: "600",
  },
  card: {
    width: "88%",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 30,
    padding: 22,
  },
  label: {
    marginTop: 12,
    marginBottom: 5,
    color: "#222",
  },
  input: {
    height: 50,
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  textArea: {
    height: 90,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    padding: 15,
  },
  pillRow: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },
  pill: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  cancelBtn: {
    width: "45%",
    height: 50,
    backgroundColor: "#ccc",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    width: "45%",
    height: 50,
    backgroundColor: "#2f9e6f",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 220,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
  },
  option: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  activeOption: {
    backgroundColor: "#2f9e6f",
  },
});