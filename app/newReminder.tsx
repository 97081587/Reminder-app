import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
// @ts-ignore: expo-av may not be available in this environment / no type declarations
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

export default function NewReminder() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [repeat, setRepeat] = useState<"none" | "daily" | "weekly">("none");
  const [repeatPickerVisible, setRepeatPickerVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 🔊 MULTIPLE SOUNDS
  const [selectedSounds, setSelectedSounds] = useState<string[]>([]);
  const [soundPickerVisible, setSoundPickerVisible] = useState(false);

  const soundOptions = ["Bell", "Chime", "Alert", "Digital", "Echo"];

  const repeatOptions: ("none" | "daily" | "weekly")[] = [
    "none",
    "daily",
    "weekly",
  ];

  // set Android channel once
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      }).catch(() => {
        // ignore errors setting channel
      });
    }
  }, []);

  const toggleSound = (sound: string) => {
    if (selectedSounds.includes(sound)) {
      setSelectedSounds((s) => s.filter((x) => x !== sound));
    } else {
      setSelectedSounds((s) => [...s, sound]);
    }
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setDate(newDate);
    }

    if (Platform.OS === "android") {
      setShowDatePicker(false);
      setShowTimePicker(true);
    } else {
      setShowDatePicker(false);
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

    if (date < new Date()) {
      alert("בחר זמן עתידי");
      return;
    }

    // Ensure we have permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission not granted");
      return;
    }

    let trigger: any;

    if (repeat === "daily") {
      trigger = {
        hour: date.getHours(),
        minute: date.getMinutes(),
        repeats: true,
        type: "calendar",
      };
    } else if (repeat === "weekly") {
      const weekday = date.getDay() || 7; // make Sunday 7
      trigger = {
        weekday,
        hour: date.getHours(),
        minute: date.getMinutes(),
        repeats: true,
        type: "calendar",
      };
    } else {
      trigger = {
        date: new Date(date.getTime()),
        type: "date",
      };
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: { title: title.trim(), body: description || "" },
      trigger,
    });

    const newReminder = {
      id: Date.now().toString(),
      title: title.trim(),
      description,
      date: date.toISOString(),
      repeat,
      sounds: selectedSounds,
      notificationId,
    };

    const stored = await AsyncStorage.getItem("reminders");
    const reminders = stored ? JSON.parse(stored) : [];

    const updated = [...reminders, newReminder].sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    await AsyncStorage.setItem("reminders", JSON.stringify(updated));

    alert("Reminder saved 🎉");
    router.back();
  };

  // 🔊 TEST SOUND
  const testSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/bell.mp3")
      );
      await sound.playAsync();
    } catch {
      // ignore if asset missing
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <LinearGradient colors={["#2a8c82", "#d1913c"]} style={{ flex: 1 }}>
        {/* Hamburger */}
        <View style={styles.hamburgerContainer}>
          <TouchableOpacity
            style={styles.hamburgerBtn}
            onPress={() => setDrawerVisible(true)}
          >
            <Feather name="menu" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Drawer */}
        {drawerVisible && (
          <>
            {/* Overlay + Blur */}
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={() => setDrawerVisible(false)}
              activeOpacity={1}
            >
              <View style={styles.overlay} />
              <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            </TouchableOpacity>

            {/* Drawer panel */}
            <Animated.View
              entering={SlideInLeft.duration(300)}
              exiting={SlideOutLeft.duration(300)}
              style={styles.drawer}
            >
              <LinearGradient colors={["#2a8c82", "#d1913c"]} style={styles.drawerGradient}>
                <TouchableOpacity onPress={() => setDrawerVisible(false)} style={styles.closeBtn}>
                  <Feather name="x" size={26} color="white" />
                </TouchableOpacity>

                <View style={{ marginTop: 40 }}>
                  <TouchableOpacity onPress={() => router.push("/")} style={styles.drawerItem}>
                    <Text style={styles.drawerText}>Home</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => router.push("/reminders" as any)} style={styles.drawerItem}>
                    <Text style={styles.drawerText}>Reminders</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => router.push("/settings" as any)} style={styles.drawerItem}>
                    <Text style={styles.drawerText}>Settings</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </>
        )}

        {/* Content */}
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>New Reminder</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text style={[styles.label, { marginTop: 10 }]}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Enter description"
            />

            <Text style={[styles.label, { marginTop: 10 }]}>Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { marginTop: 10 }]}>Time</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker value={date} mode="date" onChange={onChangeDate} />
            )}
            {showTimePicker && (
              <DateTimePicker value={date} mode="time" onChange={onChangeTime} />
            )}

            <View style={{ marginTop: 12 }}>
              <TouchableOpacity style={styles.pillButton} onPress={() => setRepeatPickerVisible(true)}>
                <Text>{`Repeat: ${repeat}`}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 12 }}>
              <TouchableOpacity style={styles.pillButton} onPress={() => setSoundPickerVisible(true)}>
                <Text>Choose Sounds</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.pillButton, { marginTop: 8 }]} onPress={testSound}>
                <Text>Test Sound</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addBtn} onPress={handleAddReminder}>
                <Text style={{ color: "white", fontWeight: "600" }}>Add Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Repeat Modal */}
        {repeatPickerVisible && (
          <Modal transparent animationType="fade" onRequestClose={() => setRepeatPickerVisible(false)}>
            <View style={modalStyles.modalOverlay}>
              <LinearGradient colors={["#2a8c82", "#d1913c"]} style={modalStyles.modalContent}>
                {repeatOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={modalStyles.optionBtn}
                    onPress={() => {
                      setRepeat(option);
                      setRepeatPickerVisible(false);
                    }}
                  >
                    <Text style={modalStyles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </LinearGradient>
            </View>
          </Modal>
        )}

        {/* Sound Picker Modal */}
        {soundPickerVisible && (
          <Modal transparent animationType="fade" onRequestClose={() => setSoundPickerVisible(false)}>
            <View style={modalStyles.modalOverlay}>
              <LinearGradient colors={["#2a8c82", "#d1913c"]} style={modalStyles.modalContent}>
                {soundOptions.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={modalStyles.optionBtn}
                    onPress={() => toggleSound(s)}
                  >
                    <Text style={modalStyles.optionText}>
                      {selectedSounds.includes(s) ? "✓ " : ""}{s}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={[modalStyles.optionBtn, { marginTop: 12 }]} onPress={() => setSoundPickerVisible(false)}>
                  <Text style={modalStyles.optionText}>Done</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Modal>
        )}
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 120,
  },
  header: {
    fontSize: 28,
    color: "white",
    fontWeight: "700",
    marginBottom: 20,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    height: 44,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
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
    marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  hamburgerContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 100,
  },
  hamburgerBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 16,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "75%",
    zIndex: 200,
  },
  drawerGradient: {
    flex: 1,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    padding: 20,
  },
  closeBtn: {
    alignSelf: "flex-end",
  },
  drawerItem: {
    marginVertical: 18,
  },
  drawerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
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

  optionBtn: {
    width: "100%",
    padding: 15,
    marginVertical: 5,
  },

  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});