import { StyleSheet, Text, View, TextInput, TouchableOpacity,Button, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Link } from "expo-router";




export default function EditReminder() {
    const router = useRouter();
    
    // opslaan
    // const saveEditedReminder = async (id, newText) => {
    //     const reminders = await getReminders();

    //     const updated = reminders.map(r =>
    //         r.id === id ? { ...r, text: newText } : r
    //     );

    //     await saveReminders(updated);
    //     return updated;
    // };

    //"HTML"
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
                        <Text style={styles.label}>Date & Time</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => showMode("date")}
                                >
                                <Text>
                                    {date.toLocaleDateString()}{" "}
                                    {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </Text>
                            </TouchableOpacity>

                            {showPicker && (
                                <DateTimePicker
                                    value={date}
                                    mode={mode}
                                    display="default"
                                    onChange={onChangeDate}
                                />
                            )}


                        {/* cancel and edit buttons */}
                        <View style={styles.buttonContainer}>
                            
                            <TouchableOpacity 
                                style={styles.cancelBtn}    
                            >
                                <Link href="/">
                                    <Text>Cancel</Text>
                                </Link>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.addBtn} 
                                // onPress={() => saveEditedReminder(id, newText)}
                            >
                                <Link href="/">
                                    <Text>Edit Reminder</Text>
                                </Link>
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