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
    Alert,
    TextInput,
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
    const [calendarId, setCalendarId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
    const [lecturerName, setLecturerName] = useState('');
    const [courseDate, setCourseDate] = useState('');
    const [courseTime, setCourseTime] = useState('');

    useEffect(() => {
        const getCalendars = async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
                const calendars = await Calendar.getCalendarsAsync();
                if (calendars.length > 0) {
                    const firstCalendarId = calendars[0].id;
                    setCalendarId(firstCalendarId);
                    getCalendarEvents(firstCalendarId);
                }
            }
        };
        getCalendars();
    }, []);

    const getCalendarEvents = async (calendarId) => {
        const startDate = moment(selectedDay).startOf('day').toISOString();
        const endDate = moment(selectedDay).endOf('day').toISOString();
        const events = await Calendar.getEventsAsync([calendarId], startDate, endDate);
        setEvents(events);
        setLoading(false);
    };

    const renderEvent = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => {
            setSelectedEvent(item);
            setModalVisible(true);
        }}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemText}>{moment(item.startDate).format('HH:mm')} - {moment(item.endDate).format('HH:mm')}</Text>
        </TouchableOpacity>
    );

    const closeModal = () => {
        setModalVisible(false);
        setSelectedEvent(null);
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const openOptionsModal = () => {
        setOptionsModalVisible(true);
        toggleMenu();
    };

    const closeOptionsModal = () => {
        setOptionsModalVisible(false);
    };

    const uploadTimetable = () => {
        Alert.alert("Upload Timetable", "This feature is not implemented yet."); // Placeholder
        closeOptionsModal();
    };

    const downloadTimetable = async () => {
        const icsContent = generateICS();
        const fileUri = FileSystem.documentDirectory + 'timetable.ics';
        await FileSystem.writeAsStringAsync(fileUri, icsContent);
        await Sharing.shareAsync(fileUri);
        closeOptionsModal();
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
        setScheduleModalVisible(true);
    };

    const closeScheduleModal = () => {
        setScheduleModalVisible(false);
    };

    const saveAlarm = () => {
        Alert.alert("Save Alarm", "Alarm saved successfully."); // Placeholder
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#374957' }}>
            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => (
                    <View>
                        <View style={styles.headerContainer}>
                            <Text style={styles.header}>Timetable</Text>
                            <TouchableOpacity onPress={toggleMenu} style={styles.kebabMenu}>
                                <Icon name="ellipsis-vertical" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        {menuVisible && (
                            <View style={styles.menu}>
                                <TouchableOpacity onPress={uploadTimetable}>
                                    <Text style={styles.menuItem}>Upload Timetable</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={downloadTimetable}>
                                    <Text style={styles.menuItem}>Download Timetable</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={toggleMenu}>
                                    <Text style={styles.menuItem}>Close Menu</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <CalendarComponent
                            onDayPress={(day) => {
                                setSelectedDay(day.dateString);
                                if (calendarId) {
                                    getCalendarEvents(calendarId);
                                }
                            }}
                            markedDates={{
                                [selectedDay]: { selected: true, marked: true, selectedColor: 'blue' },
                            }}
                            theme={{
                                backgroundColor: '#374957',
                                calendarBackground: '#374957',
                                textSectionTitleColor: '#ffffff',
                                selectedDayBackgroundColor: 'darkgreen',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#ffffff',
                                dayTextColor: '#ffffff',
                                textDisabledColor: '#d9e1e8',
                                dotColor: 'red',
                                selectedDotColor: '#ffffff',
                                arrowColor: 'darkgreen',
                                monthTextColor: '#ffffff', // Month and year text color
                                textMonthFontWeight: 'bold',
                                textMonthFontSize: 20,
                                textDayHeaderFontWeight: 'bold',
                                textDayHeaderFontSize: 16,
                            }}
                            style={{ backgroundColor: '#374957' }} // Ensure the background around the calendar is #374957
                        />
                        {loading && <ActivityIndicator size="large" color="#0000ff" />}
                    </View>
                )}
                ListEmptyComponent={<Text>No events for this day.</Text>}
                contentContainerStyle={styles.listContainer}
            />

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

            <Modal
                animationType="slide"
                transparent={false}
                visible={optionsModalVisible}
                onRequestClose={closeOptionsModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Timetable Options</Text>
                    <TouchableOpacity onPress={uploadTimetable}>
                        <Text style={styles.optionText}>Upload Timetable</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={downloadTimetable}>
                        <Text style={styles.optionText}>Download Timetable</Text>
                    </TouchableOpacity>
                    <Button title="Close" onPress={closeOptionsModal} />
                </View>
            </Modal>

            <TouchableOpacity style={styles.scheduleButton} onPress={scheduleCourse}>
                <Text style={styles.scheduleButtonText}>Schedule Course</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={scheduleModalVisible}
                onRequestClose={closeScheduleModal}
            >
                <View style={styles.blurBackground}>
                    <View style={styles.fullScreenTransparentModalContainer}>
                        <Text style={[styles.modalTitle, styles.whiteText]}>Schedule Course</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.whiteText}>Lecturer Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Add Lecturer’s Name"
                                placeholderTextColor="#ccc"
                                value={lecturerName}
                                onChangeText={setLecturerName}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.whiteText}>Course Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Add a course Date"
                                placeholderTextColor="#ccc"
                                value={courseDate}
                                onChangeText={setCourseDate}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.whiteText}>Course Time</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Add a course Time"
                                placeholderTextColor="#ccc"
                                value={courseTime}
                                onChangeText={setCourseTime}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.whiteText}>Course Colour</Text>
                            <View style={styles.colorPicker}>
                                <View style={[styles.colorCircle, { backgroundColor: 'red' }]} />
                                <View style={[styles.colorCircle, { backgroundColor: 'blue' }]} />
                                <View style={[styles.colorCircle, { backgroundColor: 'green' }]} />
                                <View style={[styles.colorCircle, { backgroundColor: 'yellow' }]} />
                                <View style={[styles.colorCircle, { backgroundColor: 'purple' }]} />
                            </View>
                        </View>
                        <Button title="Save Alarm" onPress={saveAlarm} />
                        <Button title="Close" onPress={closeScheduleModal} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#374957',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ffffff',
    },
    kebabMenu: {
        padding: 5,
    },
    menu: {
        backgroundColor: '#374957',
        padding: 10,
        borderRadius: 5,
        position: 'absolute',
        top: 60,
        right: 20,
        elevation: 3,
        zIndex: 1,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        color: '#ffffff',
    },
    item: {
        backgroundColor: '#374957',
        padding: 15,
        marginVertical: 8,
        borderRadius: 5,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#ffffff',
    },
    itemText: {
        color: '#ffffff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#374957',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#ffffff',
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
    optionText: {
        fontSize: 18,
        marginVertical: 10,
        color: '#ffffff',
    },
    blurBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenTransparentModalContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputGroup: {
        marginBottom: 20,
        width: '100%',
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: '#374957',
        color: '#ffffff',
    },
    whiteText: {
        color: '#fff',
    },
    colorPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
});

export default TimetableGrid;