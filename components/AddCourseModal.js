// Example of AddCourseModal.js
import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const AddCourseModal = ({ visible, onClose }) => {
    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <Text>Add New Course</Text>
                {/* Add form fields here */}
                <Button title="Close" onPress={onClose} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AddCourseModal;