import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import useStore from '../store/useStore';
import * as Notifications from 'expo-notifications';

export default function CalendarScreen() {
  const { events, addEvent } = useStore();
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');

  // Transform events for the calendar
  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: colors.secondary };
    return acc;
  }, {});

  if (selectedDate) {
    markedDates[selectedDate] = { 
      ...markedDates[selectedDate], 
      selected: true, 
      selectedColor: colors.primary 
    };
  }

  const handleAddEvent = async () => {
    if (newEventTitle && selectedDate) {
      addEvent(selectedDate, { title: newEventTitle, time: newEventTime });
      
      // Attempt to schedule a local notification if time is provided
      // For a real app, we'd parse the date & time properly.
      // Here we just schedule an example notification 5 seconds from now.
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Upcoming Event: " + newEventTitle,
          body: "It's time for your scheduled event.",
        },
        trigger: { seconds: 5 },
      });

      setModalVisible(false);
      setNewEventTitle('');
      setNewEventTime('');
    }
  };

  const selectedEvents = selectedDate ? (events[selectedDate] || []) : [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Schedule</Text>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={day => {
            setSelectedDate(day.dateString);
          }}
          markedDates={markedDates}
          theme={{
            backgroundColor: colors.card,
            calendarBackground: colors.card,
            textSectionTitleColor: colors.textSecondary,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: '#000',
            todayTextColor: colors.secondary,
            dayTextColor: colors.text,
            textDisabledColor: '#444',
            dotColor: colors.secondary,
            selectedDotColor: '#000',
            arrowColor: colors.text,
            monthTextColor: colors.text,
            indicatorColor: colors.secondary,
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14
          }}
        />
      </View>

      <View style={styles.eventsContainer}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>Events for {selectedDate || '...'}</Text>
          {selectedDate && (
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
              <Ionicons name="add" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        {selectedEvents.length === 0 ? (
          <Text style={styles.emptyText}>No events for this date.</Text>
        ) : (
          selectedEvents.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>
          ))
        )}
      </View>

      {/* Add Event Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Event</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              placeholderTextColor={colors.textSecondary}
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Time (e.g. 10:00 AM)"
              placeholderTextColor={colors.textSecondary}
              value={newEventTime}
              onChangeText={setNewEventTime}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddEvent}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  calendarContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  eventsContainer: {
    flex: 1,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  eventsTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  eventCard: {
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  eventTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  eventTime: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelBtn: {
    padding: 15,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    marginLeft: 10,
  },
  saveBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
