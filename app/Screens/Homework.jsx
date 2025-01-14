import React from 'react';
import { View, Text, Button,StyleSheet } from 'react-native';

const Homework = () => (
<View style={styles.container}>
<Text>This is the Homework screen!</Text>
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

export default Homework;