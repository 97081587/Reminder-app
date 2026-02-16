import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>
      
      {/* Base Gradient */}
      <LinearGradient
        colors={["#DFA355", "#46A5A7"]}
        locations={[0.4475, 0.9866]} // matches 44.75% & 98.66%
        start={{ x: 0.1, y: 1 }}   // ~349deg approximation
        end={{ x: 0, y: 0.8 }}
        style={styles.gradient}
      >
        
        {/* Fake "difference" overlay */}
        <View style={styles.differenceOverlay} />

        <Text style={styles.text}>Difference Effect</Text>
      
      </LinearGradient>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  differenceOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    opacity: 0, // adjust this to tweak the "difference" look
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
  },
});
