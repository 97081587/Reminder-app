import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [selectedSound, setSelectedSound] = useState(null);
  const [soundPickerVisible, setSoundPickerVisible] = useState(false);

  // ✅ YOUR SOUNDS
  const soundOptions = [
    { label: "Default", value: "default", file: null },
    { label: "Bell", value: "bell", file: require("../assets/sounds/bell.mp3") },
    { label: "Chime", value: "chime", file: require("../assets/sounds/chime.mp3") },
    { label: "Mijn", value: "mijn", file: require("../assets/sounds/mijn.mp3") },
  ];

  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
      });
    }
  }, []);

  // 🔊 PLAY SOUND PREVIEW
  const playSound = async (file) => {
    if (!file) return;
    const { sound } = await Audio.Sound.createAsync(file);
    await sound.playAsync();
  };

  // ✅ SELECT SOUND
  const selectSound = (item) => {
    setSelectedSound(item);

    if (item.file) {
      playSound(item.file);
    }
  };

  // 📅 DATE PICKER
  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setDate(newDate);
    }
    setShowDatePicker(false);
    setShowTimePicker(true);
  };

  // ⏰ TIME PICKER
  const onChangeTime = (event, selectedTime) => {
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDate);
    }
    setShowTimePicker(false);
  };

  // ✅ ADD REMINDER
  const handleAddReminder = async () => {
    if (!title) {
      alert("Please enter a title");
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission not granted");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: description,
        sound: "default", // Expo limitation
      },
      trigger: {
        seconds: 5,
      },
    });

    const newReminder = {
      id: Date.now().toString(),
      title,
      description,
      date: date.toISOString(),
      sound: selectedSound?.value || "default",
    };

    const stored = await AsyncStorage.getItem("reminders");
    const reminders = stored ? JSON.parse(stored) : [];

    reminders.push(newReminder);

    await AsyncStorage.setItem("reminders", JSON.stringify(reminders));

    alert("Reminder saved 🚀");
    router.back();
  };

  // 🔊 TEST SOUND
  const testSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/bell.mp3")
    );
    await sound.playAsync();
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <LinearGradient colors={["#2a8c82", "#d1913c"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>New Reminder</Text>

          <View style={styles.card}>
            <Text>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text>Description</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text>Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            <Text>Time</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text>
                {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker value={date} mode="date" onChange={onChangeDate} />
            )}

            {showTimePicker && (
              <DateTimePicker value={date} mode="time" onChange={onChangeTime} />
            )}

            {/* SOUND PICKER */}
            <Text>Sound</Text>

            <TouchableOpacity
              style={styles.pillButton}
              onPress={() => setSoundPickerVisible(true)}
            >
              <Text>🔔</Text>
              <Text>
                {selectedSound ? selectedSound.label : "Default"}
              </Text>
            </TouchableOpacity>

            {/* TEST SOUND */}
            <TouchableOpacity onPress={testSound} style={{ marginTop: 10 }}>
              <Text>▶️ Test Sound</Text>
            </TouchableOpacity>

            {/* MODAL */}
            <Modal transparent visible={soundPickerVisible}>
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setSoundPickerVisible(false)}
              >
                <View style={styles.modalContent}>
                  <FlatList
                    data={soundOptions}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.option}
                        onPress={() => {
                          selectSound(item);
                          setSoundPickerVisible(false);
                        }}
                      >
                        <Text>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

            {/* BUTTONS */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addBtn} onPress={handleAddReminder}>
                <Text style={{ color: "white" }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", paddingTop: 60 },
  header: { fontSize: 30, color: "white", marginBottom: 20 },
  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 30,
    padding: 20,
  },
  input: {
    height: 45,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    marginBottom: 10,
  },
  textArea: {
    height: 70,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  pillButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 999,
    paddingHorizontal: 15,
    height: 40,
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
    width: "45%",
    height: 45,
    backgroundColor: "#2f9e6f",
    borderRadius: 20,
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
    width: 200,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  option: {
    padding: 10,
  },
});