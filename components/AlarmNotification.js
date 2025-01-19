// src/components/AlarmNotification.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlarmNotification = () => {
    return (
        <View style={styles.notification}>
            <Text>Upcoming Alarms:</Text>
            {/* List upcoming alarms here */}
            <Text>1. Math Exam - Tomorrow 9:00 AM</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    notification: {
        padding: 16,
        backgroundColor: '#f0f0f0',
        marginTop: 16,
    },
});

export default AlarmNotification;