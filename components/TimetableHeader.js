import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Modal,
    Button,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import * as Calendar from 'expo-calendar';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Calendar as CalendarComponent } from 'react-native-calendars';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

const TimetableGrid = () => {
    const [events, setEvents] = useState([]);
    const [selectedDay, setSelectedDay] = useState(moment().format('YYYY-MM-DD'));
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [calendars, setCalendars] = useState([]);
    const [selectedCalendarId, setSelectedCalendarId] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        const getCalendars = async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
                const calendars = await Calendar.getCalendarsAsync();
                setCalendars(calendars);
                if (calendars.length > 0) {
                    setSelectedCalendarId(calendars[0].id); // Default to the first calendar
                }
            }
        };
        getCalendars();
    }, []);

    useEffect(() => {
        const getCalendarEvents = async () => {
            if (selectedCalendarId) {
                const startDate = moment(selectedDay).startOf('day').toISOString();
                const endDate = moment(selectedDay).endOf('day').toISOString();
                const events = await Calendar.getEventsAsync([selectedCalendarId], startDate, endDate);
                setEvents(events);
            }
            setLoading(false);
        };

        getCalendarEvents();
    }, [selectedDay, selectedCalendarId]);

    const renderEvent = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => {
            setSelectedEvent(item);
            setModalVisible(true);
        }}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text>{moment(item.startDate).format('HH:mm')} - {moment(item.endDate).format('HH:mm')}</Text>
        </TouchableOpacity>
    );

    const closeModal = () => {
        setModalVisible(false);
        setSelectedEvent(null);
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const uploadCalendar = () => {
        Alert.alert("Upload Calendar", "This feature is not implemented yet."); // Placeholder
    };

    const downloadCalendar = async () => {
        const icsContent = generateICS();
        const fileUri = FileSystem.documentDirectory + 'calendar.ics';
        await FileSystem.writeAsStringAsync(fileUri, icsContent);
        await Sharing.shareAsync(fileUri);
    };

    const generateICS = () => {
        let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\n';
        events.forEach(event => {
            ics += `BEGIN:VEVENT\n`;
            ics += `SUMMARY:${event.title}\n`;
            ics += `DTSTART:${moment(event.startDate).format('YYYYMMDDTHHmmSS')}\n`;
            ics += `DTEND:${moment(event.endDate).format('YYYYMMDDTHHmmSS')}\n`;
            ics += `DESCRIPTION:${event.description || ''}\n`;
            ics += `END:VEVENT\n`;
        });
        ics += 'END:VCALENDAR';
        return ics;
    };

    const scheduleCourse = () => {
        Alert.alert("Schedule Course", "Course scheduling functionality is not implemented yet."); // Placeholder
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Timetable</Text>
                <TouchableOpacity onPress={toggleMenu} style={styles.kebabMenu}>
                    <Icon name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {menuVisible && (
                <View style={styles.menu}>
                    <TouchableOpacity onPress={uploadCalendar}>
                        <Text style={styles.menuItem}>Upload Calendar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={downloadCalendar}>
                        <Text style={styles.menuItem}>Download Calendar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleMenu}>
                        <Text style={styles.menuItem}>Close Menu</Text>
                    </TouchableOpacity>
                </View>
            )}

            <CalendarComponent
                onDayPress={(day) => {
                    setSelectedDay(day.dateString);
                    setLoading(true);
                }}
                markedDates={{
                    [selectedDay]: { selected: true, marked: true, selectedColor: 'blue' },
                }}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: 'blue',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: 'red',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'blue',
                }}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={events}
                    renderItem={renderEvent}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<Text>No events for this day.</Text>}
                />
            )}

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    {selectedEvent && (
                        <>
                            <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                            <Text>{moment(selectedEvent.startDate).format('HH:mm')} - {moment(selectedEvent.endDate).format('HH:mm')}</Text>
                            <Text>{selectedEvent.description}</Text>
                            <Button title="Close" onPress={closeModal} />
                        </>
                    )}
                </View>
            </Modal>

            <TouchableOpacity style={styles.scheduleButton} onPress={scheduleCourse}>
                <Text style={styles.scheduleButtonText}>Schedule Course</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    kebabMenu: {
        padding: 5,
    },
    menu: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 5,
        position: 'absolute',
        top: 60, // Adjust according to your layout
        right: 20,
        elevation: 3,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    item: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginVertical: 8,
        borderRadius: 5,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scheduleButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    scheduleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TimetableGrid;