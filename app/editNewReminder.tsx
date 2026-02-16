import {StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.text}>New Reminder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFA355",
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    marginTop: 60,
    fontSize: 35,
  },
});