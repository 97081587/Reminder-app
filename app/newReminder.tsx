import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
>>>>>>> 7a36dfc (Add drawer navigation and enhance notification handling in NewReminder)
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
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
  const [repeat, setRepeat] = useState("none");
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

  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,

        importance: Notifications.AndroidImportance.HIGH,
 7a36dfc (Add drawer navigation and enhance notification handling in NewReminder)
        sound: "default",
      });
    }
  }, []);

  const toggleSound = (sound: string) => {
    if (selectedSounds.includes(sound)) {
      setSelectedSounds(selectedSounds.filter((s) => s !== sound));
    } else {
      setSelectedSounds([...selectedSounds, sound]);
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
    }

    setShowDatePicker(false);
7a36dfc (Add drawer navigation and enhance notification handling in NewReminder)
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
    if (!title) {
      alert("Enter title");
      return;
    }

    if (date < new Date()) {
      alert("בחר זמן עתידי");
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      finalStatus = newStatus;
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
      const weekday = date.getDay();
      trigger = {
        type: "calendar",
        weekday: weekday === 0 ? 1 : weekday + 1,
        hour: date.getHours(),
        minute: date.getMinutes(),
        repeats: true,
      };
    } else {
      trigger = {
        type: "date",
        date: new Date(date.getTime()),
      };
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
      sounds: selectedSounds, // ✅ MULTIPLE SAVED
      notificationId,
    };

    const stored = await AsyncStorage.getItem("reminders");
    const reminders = stored ? JSON.parse(stored) : [];

    const updated = [...reminders, newReminder].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    await AsyncStorage.setItem("reminders", JSON.stringify(updated));

    alert("Reminder saved 🎉");
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
              <BlurView
                intensity={40}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
            </TouchableOpacity>

            {/* Drawer panel */}
            <Animated.View
              entering={SlideInLeft.duration(300)}
              exiting={SlideOutLeft.duration(300)}
              style={styles.drawer}
            >
              <LinearGradient
                colors={["#2a8c82", "#d1913c"]}
                style={styles.drawerGradient}
              >
                <TouchableOpacity
                  onPress={() => setDrawerVisible(false)}
                  style={styles.closeBtn}
                >
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
            <Text>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Enter description"
            />

            <Text>Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}

            <Text>Time</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text>
                {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} 7a36dfc (Add drawer navigation and enhance notification handling in NewReminder)
              </Text>
            </TouchableOpacity>

            {showDatePicker && (

              <DateTimePicker
                value={date}
                mode="date"
                onChange={onChangeDate}
              />

              <DateTimePicker value={date} mode="date" onChange={onChangeDate} />
            )}
            {showTimePicker && (
              <DateTimePicker value={date} mode="time" onChange={onChangeTime} />
 7a36dfc (Add drawer navigation and enhance notification handling in NewReminder)
            )}

            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                onChange={onChangeTime}
              />
            )}

            <TouchableOpacity style={styles.addBtn} onPress={handleAddReminder}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
            </TouchableOpacity>

        {/* Repeat Modal */}
        {repeatPickerVisible && (
          <Modal transparent animationType="fade">
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
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", paddingTop: 100 },
  header: { fontSize: 28, color: "white", marginBottom: 20, fontWeight: "bold" },

  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    padding: 20,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
  },

  textArea: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  pillButton: {
    flexDirection: "row",
    gap: 8,
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
 HEAD
  option: {
    padding: 10,
    borderRadius: 5,


  optionBtn: {
    width: "100%",
    padding: 15,
 7a36dfc (Add drawer navigation and enhance notification handling in NewReminder)
    marginVertical: 5,
  },

  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});