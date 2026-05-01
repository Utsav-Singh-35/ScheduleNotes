import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import useStore from '../store/useStore';

export default function DashboardScreen() {
  const { tasks, events } = useStore();
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  
  const todayDate = new Date().toISOString().split('T')[0];
  const todaysEvents = events[todayDate] || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder} />
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </View>

        <Text style={styles.greeting}>Hello, User</Text>
        <Text style={styles.title}>How're You Today?</Text>

        {/* Date Row (Dummy implementation based on UI) */}
        <View style={styles.dateRow}>
          {['17','18','19','20','21','22','23'].map((day, i) => (
            <View key={i} style={[styles.dateBubble, day === '20' && styles.dateBubbleActive]}>
              <Text style={[styles.dateText, day === '20' && styles.dateTextActive]}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.grid}>
          {/* Tasks Card */}
          <View style={[styles.card, { flex: 1, marginRight: 10 }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="checkmark-done-circle" size={20} color={colors.text} />
              <Text style={styles.cardTitle}>Tasks Done</Text>
            </View>
            <Text style={styles.mainStat}>{completedTasks}/{totalTasks}</Text>
          </View>

          {/* Events Card */}
          <View style={[styles.card, { flex: 1 }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar" size={20} color={colors.text} />
              <Text style={styles.cardTitle}>Today's Events</Text>
            </View>
            <Text style={styles.mainStat}>{todaysEvents.length}</Text>
          </View>
        </View>

        {/* Schedule Preview */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          {todaysEvents.length === 0 ? (
            <Text style={styles.emptyText}>No events scheduled for today.</Text>
          ) : (
            todaysEvents.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventDot} />
                <View>
                  <Text style={styles.eventName}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 5,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  dateBubble: {
    width: 40,
    height: 50,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBubbleActive: {
    backgroundColor: colors.primary,
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  dateTextActive: {
    color: '#000000',
  },
  grid: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
  mainStat: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  emptyText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  eventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.secondary,
    marginRight: 15,
  },
  eventName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  eventTime: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
