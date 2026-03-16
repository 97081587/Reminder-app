import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import { Link, useRouter} from "expo-router";
import  { React, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

//"HTML"
export default function EditReminder() {

    return (
        <LinearGradient 
            colors={["#2a8c82", "#d1913c"]} 
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                {/* page title */}
                <Text style={styles.title}>Edit Reminder</Text>

                    <View style={styles.card}>
                        {/* title field of the reminder */}
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                        />

                        {/* description field of the reminder */}
                        <Text style={styles.label}>Description (optional)</Text>
                        <TextInput
                            style={styles.input}
                        />

                        {/* cancel and save buttons */}
                    </View>
            </View>
        </LinearGradient>
    );
}

//"CSS"
const styles = StyleSheet.create({
    container: {
        flex: 1,   
        alignItems: "center",
        paddingTop: 60,
    },
    title: {
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
    }
});