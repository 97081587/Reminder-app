import { StyleSheet, Text, View, FlatList } from "react-native";
import { Link } from "expo-router";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

//"HTML"
export default function EditReminder() {

    return (
        <linearGradient 
            colors={["#2a8c82", "#d1913c"]} 
            style={{ flex: 1 }}
        >
            <view style={styles.container}>
                <Text>Edit Reminder</Text>
            </view>
        </linearGradient>
    );
}

//"CSS"
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});