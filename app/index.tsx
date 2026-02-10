import {StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.text}>Reminders</Text>
      <View style={styles.div}></View>
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
  div: {
    width: 70,
    height: 70,
    backgroundColor: "#ffffff",
    borderRadius: 100,
    // blurRadius: 1000,

  },
});
