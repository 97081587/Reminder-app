import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>

        <Text style={styles.text}>New reminder</Text>

        <View style={ styles.ReminderContainer} />
        <Text style={styles.title}>Title</Text>
        <Text style={styles.title}>Description (Optional)</Text>
        <Text style={styles.title}>Date & Time</Text>
          <Link href="/">
            <Text style={styles.cancelText}>Cancel</Text>
          </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFA355",
  },
  text: {
    flex: 1,
    color: "#ffffff",
    marginTop: 60,
    fontSize: 35,
  },
  cancelText: {
    color: "#000000",
    fontSize: 20,
    marginTop: 20,
  },

  ReminderContainer: {
    width: 300,
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginTop: 50,
  },
});
