import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function NewReminder() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const saveReminder = async () => {
    const newReminder = {
      id: Date.now(),
      title: title,
      description: description,
    };

    try {
      const existingReminders = await AsyncStorage.getItem("reminders");

      const reminders = existingReminders
        ? JSON.parse(existingReminders)
        : [];

      reminders.push(newReminder);

      await AsyncStorage.setItem("reminders", JSON.stringify(reminders));

      router.back();
    } catch (error) {
      console.log("Error saving reminder:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#2a8c82", "#d1913c"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
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

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => router.back()}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={saveReminder}
              >
                <Text style={{ color: "white" }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 60,
  },

  header: {
    fontSize: 30,
    color: "white",
    marginBottom: 30,
  },

  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 30,
    padding: 25,
  },

  label: {
    marginTop: 15,
    marginBottom: 8,
  },

  input: {
    height: 45,
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 15,
  },

  textArea: {
    height: 80,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  cancelBtn: {
    width: "45%",
    height: 45,
    backgroundColor: "#ccc",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  addBtn: {
    width: "45%",
    height: 45,
    backgroundColor: "#2f9e6f",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});