import { StyleSheet, Text, View, TextInput, TouchableOpacity,Button, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

//"HTML"
export default function EditReminder() {
    const router = useRouter();
    // for date selector
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    // date selector ios
  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios'); // keep open on iOS
    if (selectedDate) setDate(selectedDate);
  };

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
                            style={styles.inputDesc}
                        />

                        {/* date selector for the reminder */}
                        <View style={{ padding: 20 }}>
                            <Button onPress={() => setShow(true)} title="Select Date" />
                            {show && (
                                <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onChange}
                                />
                            )}
                            <Text style={{ marginTop: 20 }}>Selected Date: {date.toDateString()}</Text>
                        </View>

                        {/* cancel and edit buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={styles.cancelBtn}
                                onPress={() => router.back()}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.addBtn} 
                                // onPress={saveReminder}
                            >
                                <Text>Edit Reminder</Text>
                            </TouchableOpacity>
                        </View>
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
    },
    inputDesc: {
        height: 80,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
    },
    buttonContainer: {
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