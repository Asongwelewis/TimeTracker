import React from 'react';
import { View, Text,Button, StyleSheet } from 'react-native';

const Settings = () => (
<View style={styles.container}>
<Text>This is the Settings screen!</Text>
<Button onPress={() => navigation.toggleDrawer()} title="Toggle Drawer" />
</View>
);

const styles = StyleSheet.create({
container: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
},
});

export default Settings;