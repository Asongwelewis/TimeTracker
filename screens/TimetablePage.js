// src/pages/TimetablePage.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import TimetableGrid from '../components/TimetableGrid'; // Import the new timetable grid component

const TimetablePage = () => {
    return (
        <View style={styles.container}>
            {/* Render the new timetable grid */}
            <TimetableGrid month="January" year={2025} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 16,
    },
});

export default TimetablePage;