// src/components/FileUpload.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const FileUpload = () => {
    const handleUpload = async () => {
        const res = await DocumentPicker.getDocumentAsync({});
        if (res.type === 'success') {
            console.log('Selected file: ', res);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Upload Timetable" onPress={handleUpload} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
});

export default FileUpload;