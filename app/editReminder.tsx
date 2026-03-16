import { StyleSheet, Text, View, FlatList } from "react-native";
import { Link } from "expo-router";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

//"HTML"
export default function EditReminder() {

    return (
        <LinearGradient 
            colors={["#2a8c82", "#d1913c"]} 
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Edit Reminder</Text>
            </View>
        </LinearGradient>
    );
}

//"CSS"
const styles = StyleSheet.create({
    container: {
        flex: 1,   
        alignItems: "center",
    },
    title: {
        fontSize: 30,
        color: "white",
        marginBottom: 30,
    }
});