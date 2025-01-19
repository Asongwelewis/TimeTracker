// App.js
import React from 'react';
import TimetableGrid from './components/TimetableGrid'; // Adjust the path if necessary

const App = () => {
    return (
        <TimetableGrid />
    );
};

export default App;

// TimetableGrid.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const TimetableGrid = () => {
    return (
        <View>
            <Text>Timetable</Text>
            <Button title="Go to Another Screen" />
        </View>
    );
};

export { TimetableGrid };