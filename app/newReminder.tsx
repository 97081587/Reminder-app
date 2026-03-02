import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function NewReminder() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <LinearGradient
      colors={["#2a8c82", "#d1913c"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ width: "100%", alignItems: "center" }}
      >
        <Text style={styles.header}>New Reminder</Text>

        <View style={styles.card}>
          {/* Title */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
            placeholderTextColor="#666"
          />

          {/* Description */}
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor="#666"
            multiline
          />

          {/* Date */}
          <Text style={styles.label}>Date & Time</Text>
          <View style={styles.input} />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addText}>Add Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
  },

  header: {
    fontSize: 34,
    color: "white",
    marginBottom: 30,
    fontWeight: "600",
  },

  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 30,
    padding: 25,
  },

  label: {
    marginTop: 15,
    marginBottom: 8,
    fontSize: 14,
    color: "#222",
  },

  input: {
    height: 45,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 30,
    paddingHorizontal: 15,
    justifyContent: "center",
  },

  textArea: {
    height: 100,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 15,
    textAlignVertical: "top",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  cancelBtn: {
    width: "45%",
    height: 50,
    backgroundColor: "#ddd",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    fontSize: 16,
  },

  addBtn: {
    width: "45%",
    height: 50,
    backgroundColor: "#2f9e6f",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  addText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});