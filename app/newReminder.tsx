import React, { useEffect, useState } from "react";
import {
  Platform,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Audio } from "expo-av";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NewReminder() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [repeat, setRepeat] = useState<"none" | "daily" | "weekly">("none");
  const [repeatPickerVisible, setRepeatPickerVisible] = useState(false);

  const repeatOptions: ("none" | "daily" | "weekly")[] = [
    "none",
    "daily",
    "weekly",
  ];

  // 🔊 MULTIPLE SOUNDS
  const [selectedSounds, setSelectedSounds] = useState<string[]>([]);
  const [soundPickerVisible, setSoundPickerVisible] = useState(false);
  const soundOptions = ["Bell", "Chime", "Alert", "Digital", "Echo"];

  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
      }).catch(() => {});
    }
  }, []);

  const toggleSound = (sound: string) => {
    setSelectedSounds((prev) =>
      prev.includes(sound) ? prev.filter((s) => s !== sound) : [...prev, sound],
    );
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // On Android, selectedDate may be undefined when dismissed
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      setDate(newDate);
    }
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      setShowTimePicker(true);
    }
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDate);
    }
    setShowTimePicker(false);
  };

  // ✅ ADD REMINDER
  const handleAddReminder = async () => {
    if (!title.trim()) {
      alert("Enter title");
      return;
    }

    let { status } = await Notifications.requestPermissionsAsync();
    let finalStatus = status;
    if (finalStatus !== "granted") {
      const res = await Notifications.requestPermissionsAsync();
      finalStatus = res.status;
    }

    if (finalStatus !== "granted") {
      alert("Permission not granted");
      return;
    }

    let trigger: any;
    if (repeat === "daily") {
      trigger = {
        type: "calendar",
        hour: date.getHours(),
        minute: date.getMinutes(),
        repeats: true,
      };
    } else if (repeat === "weekly") {
      trigger = {
        type: "calendar",
        weekday: date.getDay() + 1,
        hour: date.getHours(),
        minute: date.getMinutes(),
        repeats: true,
      };
    } else {
      trigger = { type: "date", date };
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: { title, body: description },
      trigger,
    });

    const newReminder = {
      id: Date.now().toString(),
      title,
      description,
      date: date.toISOString(),
      repeat,
      sounds: selectedSounds,
      notificationId,
    };

    try {
      const stored = await AsyncStorage.getItem("reminders");
      const reminders = stored ? JSON.parse(stored) : [];
      reminders.push(newReminder);
      await AsyncStorage.setItem("reminders", JSON.stringify(reminders));
      alert("Reminder saved 🎉");
      router.back();
    } catch (e) {
      alert("Failed to save reminder");
    }
  };

  // 🔊 TEST SOUND
  const testSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/bell.mp3"),
      );
      await sound.playAsync();
    } catch (e) {
      // ignore
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#2a8c82", "#d1913c"]} style={{ flex: 1 }}>
        {/* Hamburger */}
        {!menuOpen && (
          <View
            style={{ position: "absolute", top: 100, left: 20, zIndex: 100 }}
          >
            <TouchableOpacity
              onPress={() => setMenuOpen(true)}
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: "#f4b36a",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 26, color: "white" }}>☰</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>New Reminder</Text>

          <View style={styles.card}>
            <Text>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
            />

            <Text style={{ marginTop: 8 }}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Enter description"
            />

            <Text style={{ marginTop: 8 }}>Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            <Text style={{ marginTop: 8 }}>Time</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                onChange={onChangeDate}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                onChange={onChangeTime}
              />
            )}

            <Text style={{ marginTop: 8 }}>Repeat</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setRepeatPickerVisible(true)}
            >
              <Text>{repeat}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addBtn} onPress={handleAddReminder}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Repeat Modal */}
        <Modal
          transparent
          animationType="fade"
          visible={repeatPickerVisible}
          onRequestClose={() => setRepeatPickerVisible(false)}
        >
          <View style={modalStyles.modalOverlay}>
            <LinearGradient
              colors={["#2a8c82", "#d1913c"]}
              style={modalStyles.modalContent}
            >
              {repeatOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={modalStyles.option}
                  onPress={() => {
                    setRepeat(option);
                    setRepeatPickerVisible(false);
                  }}
                >
                  <Text style={modalStyles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  modalStyles.option,
                  { backgroundColor: "rgba(255,255,255,0.2)" },
                ]}
                onPress={() => setRepeatPickerVisible(false)}
              >
                <Text style={[modalStyles.optionText, { color: "white" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>
        {menuOpen && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: "rgba(244,179,106,0.25)" }}
              onPress={() => setMenuOpen(false)}
            />

            <View
              style={{
                width: 260,
                height: "100%",
                backgroundColor: "#f4b36a",
                position: "absolute",
                left: 0,
                padding: 20,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Menu
              </Text>

              <Text style={{ color: "white", marginTop: 20 }}>Home</Text>
              <Text style={{ color: "white", marginTop: 10 }}>Reminders</Text>
              <Text style={{ color: "white", marginTop: 10 }}>Settings</Text>

              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Text style={{ color: "white", marginTop: 30 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    color: "white",
    marginBottom: 20,
    fontWeight: "bold",
  },
  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  textArea: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    height: 80,
    marginVertical: 5,
  },
  pillButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 999,
    paddingHorizontal: 15,
    height: 40,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    width: "45%",
    height: 45,
    backgroundColor: "#ccc",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    backgroundColor: "#2f9e6f",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
});

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  option: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    backgroundColor: "#2f9e6f",
    alignItems: "center",
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
